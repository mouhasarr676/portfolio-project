import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ImageUpload from './ImageUpload';

export default function ResourceManager({ endpoint, title, fields, columns, emptyItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [tagsText, setTagsText] = useState({}); // texte brut des champs "tags" pendant la frappe
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get(endpoint).then((res) => setItems(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, [endpoint]);

  const initTagsText = (item) => {
    const initial = {};
    fields.forEach((f) => {
      if (f.type === 'tags') {
        initial[f.key] = Array.isArray(item[f.key]) ? item[f.key].join(', ') : '';
      }
    });
    setTagsText(initial);
  };

  const openCreate = () => {
    setEditing({ ...emptyItem });
    initTagsText(emptyItem);
  };
  const openEdit = (item) => {
    setEditing({ ...item });
    initTagsText(item);
  };
  const closeForm = () => {
    setEditing(null);
    setTagsText({});
    setError('');
  };

  const handleChange = (key, value) => setEditing((prev) => ({ ...prev, [key]: value }));

  // Le champ affiche exactement ce que l'utilisateur tape (tagsText), et on
  // met à jour en parallèle le tableau réel dans `editing` pour l'enregistrement,
  // sans jamais reformater le texte affiché pendant la saisie.
  const handleTagsChange = (key, rawText) => {
    setTagsText((prev) => ({ ...prev, [key]: rawText }));
    const array = rawText.split(',').map((s) => s.trim()).filter(Boolean);
    handleChange(key, array);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...editing };
      delete payload.id;
      delete payload.created_at;

      if (editing.id) {
        await api.put(`${endpoint}/${editing.id}`, payload);
      } else {
        await api.post(endpoint, payload);
      }
      closeForm();
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet élément ?')) return;
    await api.delete(`${endpoint}/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-ink text-slate-200">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-slate-500 hover:text-white">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-xl text-white">{title}</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#1A1206] hover:brightness-110"
        >
          <Plus size={15} /> Ajouter
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun élément pour l'instant.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    {columns.map((col) => (
                      <td key={col.key} className="max-w-[220px] truncate px-4 py-3 text-slate-300">
                        {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? '—')}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => openEdit(item)} className="text-slate-500 hover:text-gold">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-red-400">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={closeForm}>
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-ink-2 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg text-white">{editing.id ? 'Modifier' : 'Ajouter'}</h2>
              <button onClick={closeForm} className="text-slate-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1.5 block text-xs text-slate-500">{field.label}</label>

                  {field.type === 'image' ? (
                    <ImageUpload
                      value={editing[field.key] ?? ''}
                      onChange={(url) => handleChange(field.key, url)}
                      folder={field.folder || 'misc'}
                    />
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={editing[field.key] ?? ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      required={field.required}
                      className="w-full resize-none rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
                    />
                  ) : field.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={!!editing[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.checked)}
                      className="h-4 w-4 accent-gold"
                    />
                  ) : field.type === 'tags' ? (
                    <input
                      type="text"
                      value={tagsText[field.key] ?? ''}
                      onChange={(e) => handleTagsChange(field.key, e.target.value)}
                      placeholder="Séparées par des virgules (ex: React, Node.js, Supabase)"
                      className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={editing[field.key] ?? ''}
                      onChange={(e) =>
                        handleChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)
                      }
                      required={field.required}
                      className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
                    />
                  )}
                </div>
              ))}

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-[#1A1206] hover:brightness-110 disabled:opacity-60"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
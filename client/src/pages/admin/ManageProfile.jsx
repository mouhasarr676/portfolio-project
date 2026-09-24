import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import ImageUpload from '../../components/admin/ImageUpload';
import LocationPicker from '../../components/admin/LocationPicker';

const textFields = [
  { key: 'full_name', label: 'Nom complet', required: true },
  { key: 'title', label: 'Titre / Poste', required: true },
  { key: 'bio', label: 'Bio', type: 'textarea' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Téléphone' },
  { key: 'whatsapp_number', label: 'Numéro WhatsApp (format international, ex: 221771234567)' },
  { key: 'address', label: 'Adresse (texte affiché sur le site)' },
  { key: 'years_experience', label: "Années d'expérience", type: 'number' },
];

export default function ManageProfile() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/profile').then((res) => setProfile(res.data[0] || {}));
  }, []);

  const handleChange = (key, value) => setProfile((prev) => ({ ...prev, [key]: value }));

  const handlePhotoChange = (url) => {
    // Une seule photo utilisée à la fois pour le site et le CV
    setProfile((prev) => ({ ...prev, photo_url: url, cv_photo_url: url }));
  };

  const handleLocationPick = (lat, lng) => {
    setProfile((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    try {
      const payload = { ...profile };
      const id = payload.id;
      delete payload.id;
      delete payload.updated_at;

      if (id) {
        await api.put(`/profile/${id}`, payload);
      } else {
        const res = await api.post('/profile', payload);
        setProfile(res.data);
      }
      setStatus('Profil enregistré ✓');
    } catch {
      setStatus("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div className="min-h-screen bg-ink" />;

  return (
    <div className="min-h-screen bg-ink text-slate-200">
      <header className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <Link to="/admin" className="text-slate-500 hover:text-white">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-display text-xl text-white">Profil</h1>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <form onSubmit={handleSave} className="space-y-5">
          <ImageUpload
            label="Photo de profil (utilisée sur le site et le CV)"
            value={profile.photo_url}
            onChange={handlePhotoChange}
            folder="profile"
          />

          {textFields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-xs text-slate-500">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={profile[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                  className="w-full resize-none rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={profile[field.key] ?? ''}
                  onChange={(e) =>
                    handleChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)
                  }
                  required={field.required}
                  className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
                />
              )}
            </div>
          ))}

          <LocationPicker
            lat={profile.latitude}
            lng={profile.longitude}
            onChange={handleLocationPick}
          />

          {status && <p className="text-xs text-sage">{status}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-[#1A1206] hover:brightness-110 disabled:opacity-60"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </main>
    </div>
  );
}
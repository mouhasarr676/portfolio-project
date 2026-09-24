import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Mail, MailOpen } from 'lucide-react';
import api from '../../services/api';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/messages').then((res) => setMessages(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markAsRead = async (id) => {
    await api.put(`/messages/${id}`);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Supprimer ce message ?')) return;
    await api.delete(`/messages/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-ink text-slate-200">
      <header className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <Link to="/admin" className="text-slate-500 hover:text-white">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-display text-xl text-white">Messages reçus</h1>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun message pour l'instant.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl border p-4 ${m.is_read ? 'border-white/10 bg-white/[0.02]' : 'border-gold/30 bg-gold/[0.04]'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.email}</p>
                  </div>
                  <div className="flex gap-3">
                    {!m.is_read && (
                      <button onClick={() => markAsRead(m.id)} className="text-slate-500 hover:text-gold" title="Marquer comme lu">
                        <MailOpen size={15} />
                      </button>
                    )}
                    <button onClick={() => remove(m.id)} className="text-slate-500 hover:text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{m.message}</p>
                <p className="mt-2 text-[11px] text-slate-600">{new Date(m.created_at).toLocaleString('fr-FR')}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
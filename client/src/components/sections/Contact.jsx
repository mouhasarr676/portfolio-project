import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MessageCircle, Mail } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import '../../utils/leafletIcons';
import Reveal from '../animations/Reveal';
import Button from '../ui/Button';
import { portfolioService } from '../../services/portfolio.service';
import { usePortfolioContext } from '../../context/PortfolioDataContext';

export default function Contact() {
  const { profile } = usePortfolioContext();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await portfolioService.sendMessage(form);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const whatsappLink = profile?.whatsapp_number
    ? `https://wa.me/${profile.whatsapp_number}?text=${encodeURIComponent('Bonjour, je vous contacte depuis votre portfolio.')}`
    : null;

  return (
    <section id="contact" className="bg-ink-2 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl text-white sm:text-3xl">Contact</h2>
        </Reveal>

        <div className="mt-9 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name" value={form.name} onChange={handleChange} required
                  placeholder="Votre nom"
                  className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-gold/50"
                />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="Votre email"
                  className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-gold/50"
                />
                <textarea
                  name="message" value={form.message} onChange={handleChange} required rows={4}
                  placeholder="Votre message"
                  className="w-full resize-none rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-gold/50"
                />
                <Button type="submit">
                  {status === 'sending' ? 'Envoi...' : status === 'sent' ? 'Message envoyé ✓' : 'Envoyer'}
                </Button>
                {status === 'error' && <p className="text-xs text-red-400">Une erreur est survenue, réessaie.</p>}
              </form>

              <div className="mt-6 flex flex-wrap gap-3">
                {whatsappLink && (
                  <Button variant="gold" href={whatsappLink} icon={MessageCircle}>WhatsApp</Button>
                )}
                                {profile?.email && (
                  <Button
                    variant="ghost"
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`}
                    icon={Mail}
                  >
                    Email
                  </Button>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="h-full min-h-[260px] overflow-hidden rounded-2xl border border-white/10">
              {profile?.latitude && profile?.longitude ? (
                <MapContainer
                  center={[profile.latitude, profile.longitude]}
                  zoom={12}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%', minHeight: '260px' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[profile.latitude, profile.longitude]}>
                    <Popup>{profile.address}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className="flex h-full min-h-[260px] items-center justify-center bg-ink text-sm text-slate-600">
                  Localisation non renseignée
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
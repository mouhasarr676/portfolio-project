import { Award, ZoomIn } from 'lucide-react';
import Reveal from '../animations/Reveal';
import { usePortfolioContext } from '../../context/PortfolioDataContext';
import { useLightbox } from '../../context/LightboxContext';

export default function Certifications() {
  const { certifications: certs } = usePortfolioContext();
  const { openLightbox } = useLightbox();
  if (!certs?.length) return null;

  return (
    <section id="certifications" className="bg-ink-2 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl text-white sm:text-3xl">Certifications</h2>
        </Reveal>

        <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {certs.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center transition hover:border-gold/40">
                {c.badge_image_url ? (
                  <button
                    type="button"
                    onClick={() => openLightbox(c.badge_image_url, c.title)}
                    className="group relative h-14 w-14 overflow-hidden rounded-lg"
                    aria-label={`Agrandir le badge ${c.title}`}
                  >
                    <img
                      src={c.badge_image_url}
                      alt={c.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                      <ZoomIn size={16} />
                    </span>
                  </button>
                ) : (
                  <Award size={22} className="text-gold" />
                )}

                <span className="text-xs font-medium text-white">{c.title}</span>
                <span className="text-[11px] text-slate-500">{c.issuer}</span>

                {c.credential_url && (
                  <a
                    href={c.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-[10px] text-gold hover:underline"
                  >
                    Voir le certificat
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


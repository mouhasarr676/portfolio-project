import { ExternalLink, ZoomIn } from 'lucide-react';
import { Github } from '../ui/BrandIcons';
import Reveal from '../animations/Reveal';
import { usePortfolioContext } from '../../context/PortfolioDataContext';
import { useLightbox } from '../../context/LightboxContext';

export default function Projects() {
  const { projects } = usePortfolioContext();
  const { openLightbox } = useLightbox();
  if (!projects?.length) return null;

  return (
    <section id="projects" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl text-white sm:text-3xl">Projets</h2>
        </Reveal>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <div className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-gold/40">
                {p.image_url ? (
                  <button
                    type="button"
                    onClick={() => openLightbox(p.image_url, p.title)}
                    className="relative block h-36 w-full overflow-hidden"
                    aria-label={`Agrandir l'aperçu de ${p.title}`}
                  >
                    <img src={p.image_url} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                      <ZoomIn size={20} />
                    </span>
                  </button>
                ) : (
                  <div className="flex h-36 w-full items-center justify-center bg-linear-to-br from-ink-2 to-[#0D1826] text-xs text-slate-600">
                    Aperçu du projet
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-base font-medium text-white">{p.title}</h3>
                  {p.tech_stack?.length > 0 && (
                    <p className="mt-1 text-xs text-sage">{p.tech_stack.join(' · ')}</p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.short_description}</p>
                  <div className="mt-4 flex gap-4 text-sm text-slate-300">
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gold">
                        <Github size={15} /> GitHub
                      </a>
                    )}
                    {p.demo_url && (
                      <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gold">
                        <ExternalLink size={15} /> Démo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
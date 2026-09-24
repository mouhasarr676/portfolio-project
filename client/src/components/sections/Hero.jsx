import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import Button from '../ui/Button';
import Reveal from '../animations/Reveal';
import { brandIcons } from '../ui/BrandIcons';
import { usePortfolioContext } from '../../context/PortfolioDataContext';

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Hero() {
  const { profile, socialLinks } = usePortfolioContext();

  const subtitle = profile?.address
    ? `${profile.title || ''} · ${profile.address}`
    : profile?.title || 'Développeur / Développeuse';

  return (
    <section id="hero" className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
      <motion.div
        className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 24, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Sur mobile : flex en colonne, l'ordre du DOM ci-dessous (titre/poste → photo → CTA/réseaux)
          détermine directement l'affichage. Sur md+ : grille 2 colonnes, la photo
          (col 2) s'étire sur les 2 lignes et reste centrée verticalement à côté du texte. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:px-8 md:grid md:grid-cols-[1.3fr_0.7fr] md:grid-rows-[auto_auto] md:items-center md:gap-x-10 md:gap-y-6">
        <div className="md:col-start-1 md:row-start-1">
          <Reveal>
            <h1 className="max-w-[12ch] font-display text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
              {profile?.full_name || 'Mon Nom'}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-3 text-sm text-sage">{subtitle}</p>
          </Reveal>
        </div>

        <Reveal
          delay={0.15}
          y={0}
          className="md:col-start-2 md:row-start-1 md:row-span-2 md:self-center"
        >
          <div className="relative mx-auto aspect-[1/1.1] w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-ink-2 to-[#0D1826]">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt={profile.full_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-600">
                Photo
              </div>
            )}
          </div>
        </Reveal>

        <div className="md:col-start-1 md:row-start-2">
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => scrollToId('contact')}>
                Me contacter
              </Button>

              <Button
                variant="ghost"
                onClick={() => scrollToId('projects')}
              >
                Voir mes projets
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-9 flex gap-4">
              {socialLinks &&
                socialLinks.map((link) => {
                  const raw = link.icon_name || '';
                  const iconKey =
                    raw.charAt(0).toUpperCase() + raw.slice(1);

                  const Icon =
                    brandIcons[iconKey] ||
                    Icons[iconKey] ||
                    Icons.Link;

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-gold/50 hover:text-gold"
                      aria-label={link.platform}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
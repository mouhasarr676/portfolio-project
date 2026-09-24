import { useEffect, useState } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { usePortfolioContext } from '../../context/PortfolioDataContext';

const links = [
  { label: 'Accueil', href: '#hero' },
  { label: 'À propos', href: '#about' },
  { label: 'Compétences', href: '#skills' },
  { label: 'Projets', href: '#projects' },
  { label: 'Parcours', href: '#timeline' },
  { label: 'Contact', href: '#contact' },
];

const cvDownloadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/cv/download`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { profile } = usePortfolioContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-white/10 bg-ink/80 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#hero" className="font-display text-lg text-gold">
          {profile?.full_name?.split(' ')[0]?.toLowerCase() || 'portfolio'}
          <span className="text-gold"> ndane sarr</span>
        </a>

        <div className="hidden gap-6 text-sm text-slate-400 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href={cvDownloadUrl}
          className="hidden items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-[#1A1206] transition hover:brightness-110 lg:inline-flex"
        >
          CV <Download size={15} />
        </a>

        <button
          className="text-white lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-slate-300"
              >
                {l.label}
              </a>
            ))}

            <a
              href={cvDownloadUrl}
              className="mt-2 rounded-lg bg-gold px-4 py-2.5 text-center text-sm font-medium text-[#1A1206]"
            >
              Télécharger le CV
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
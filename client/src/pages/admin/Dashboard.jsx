import { Link } from 'react-router-dom';
import { User, Sparkles, FolderKanban, Award, Briefcase, GraduationCap, Mail, Share2, Languages, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const sections = [
  { label: 'Profil', to: '/admin/profile', icon: User, desc: 'Nom, bio, photo, coordonnées' },
  { label: 'Compétences', to: '/admin/skills', icon: Sparkles, desc: 'Ajouter, modifier, réordonner' },
  { label: 'Projets', to: '/admin/projects', icon: FolderKanban, desc: 'Portfolio de réalisations' },
  { label: 'Certifications', to: '/admin/certifications', icon: Award, desc: 'Badges et diplômes' },
  { label: 'Expériences', to: '/admin/experiences', icon: Briefcase, desc: 'Parcours professionnel' },
  { label: 'Formation', to: '/admin/education', icon: GraduationCap, desc: 'Parcours académique' },
  { label: 'Messages', to: '/admin/messages', icon: Mail, desc: 'Messages reçus via le site' },
  { label: 'Réseaux sociaux', to: '/admin/social-links', icon: Share2, desc: 'Liens LinkedIn, GitHub, etc.' },
  { label: 'Langues', to: '/admin/languages', icon: Languages, desc: 'Langues parlées et niveau' },
];

export default function Dashboard() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-ink text-slate-200">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <h1 className="font-display text-xl text-white">Tableau de bord</h1>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:border-red-400/40 hover:text-red-400"
        >
          <LogOut size={15} /> Déconnexion
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ label, to, icon: Icon, desc }) => (
            <Link
              key={to}
              to={to}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-gold/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Icon size={18} />
              </div>
              <h2 className="mt-4 text-sm font-medium text-white">{label}</h2>
              <p className="mt-1 text-xs text-slate-500">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
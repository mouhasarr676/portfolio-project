import Reveal from '../animations/Reveal';
import { usePortfolioContext } from '../../context/PortfolioDataContext';

export default function About() {
  const { profile } = usePortfolioContext();
  if (!profile?.bio) return null;

  return (
    <section id="about" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl text-white sm:text-3xl">À propos</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-[65ch] text-[15px] leading-relaxed text-slate-400">{profile.bio}</p>
        </Reveal>
      </div>
    </section>
  );
}
import { useEffect, useRef, useState } from 'react';
import { usePortfolioContext } from '../../context/PortfolioDataContext';

function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          let start = null;

          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <b ref={ref} className="font-display text-3xl font-medium">
      {display}
      {suffix}
    </b>
  );
}

export default function Stats() {
  const { profile, projects, certifications, skills } = usePortfolioContext();

  const stats = [
    { value: profile?.years_experience || 0, suffix: '+', label: "ans d'expérience" },
    { value: projects?.length || 0, suffix: '+', label: 'projets livrés' },
    { value: certifications?.length || 0, suffix: '', label: 'certifications' },
    { value: skills?.length || 0, suffix: '+', label: 'technologies' },
  ];

  return (
    <section className="border-y border-white/10 bg-ink py-7">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-5 px-6 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            <span className="mt-1 block text-sm text-slate-400">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
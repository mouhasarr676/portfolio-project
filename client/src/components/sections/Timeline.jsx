import Reveal from '../animations/Reveal';
import { usePortfolioContext } from '../../context/PortfolioDataContext';

function formatRange(start, end, isCurrent) {
  const s = new Date(start).getFullYear();
  if (isCurrent) return `${s} — aujourd'hui`;
  if (!end) return `${s}`;
  const e = new Date(end).getFullYear();
  return s === e ? `${s}` : `${s} — ${e}`;
}

export default function Timeline() {
  const { experiences, education } = usePortfolioContext();

  const items = [
    ...(experiences || []).map((e) => ({
      id: `exp-${e.id}`,
      title: `${e.role} — ${e.company}`,
      description: e.description,
      start: e.start_date,
      end: e.end_date,
      isCurrent: e.is_current,
      type: 'Expérience',
    })),
    ...(education || []).map((e) => ({
      id: `edu-${e.id}`,
      title: `${e.degree} — ${e.institution}`,
      description: e.description,
      start: e.start_date,
      end: e.end_date,
      isCurrent: e.is_current,
      type: 'Formation',
    })),
  ].sort((a, b) => new Date(b.start) - new Date(a.start));

  if (!items.length) return null;

  return (
    <section id="timeline" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl text-white sm:text-3xl">Parcours</h2>
        </Reveal>

        <div className="relative mt-9 ml-1 border-l border-white/10 pl-7">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06} className="relative pb-9 last:pb-0">
              <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-[#0F1B14]" />
              <p className="text-xs font-medium text-gold">{formatRange(item.start, item.end, item.isCurrent)}</p>
              <h3 className="mt-1 text-[15px] font-medium text-white">{item.title}</h3>
              <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-600">{item.type}</p>
              {item.description && <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
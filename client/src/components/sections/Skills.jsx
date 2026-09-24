import { useEffect, useState } from 'react';
import Reveal from '../animations/Reveal';
import { usePortfolioContext } from '../../context/PortfolioDataContext';

/**
 * Détermine le nombre de colonnes selon la largeur d'écran, aligné sur
 * les breakpoints Tailwind utilisés ailleurs (sm: 640px, lg: 1024px).
 */
function useColumnCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCount(3);
      else if (w >= 640) setCount(2);
      else setCount(1);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return count;
}

/**
 * Répartit les catégories en colonnes en remplissant TOUJOURS la colonne 1
 * en premier (dans l'ordre), puis la colonne 2, etc. — contrairement au
 * CSS `columns` natif qui équilibre par hauteur et peut placer les
 * éléments de façon imprévisible.
 */
function distributeIntoColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  items.forEach((item, i) => {
    columns[i % columnCount].push(item);
  });
  return columns.filter((col) => col.length > 0);
}

function CategoryCard({ cat, skills }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="mb-3 text-xs uppercase tracking-wide text-sage">{cat}</h3>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id}>
            <p className="text-sm font-medium text-white">{skill.name}</p>
            <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gold transition-all duration-700"
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const { skills } = usePortfolioContext();
  const columnCount = useColumnCount();
  if (!skills?.length) return null;

  const categories = [...new Set(skills.map((s) => s.category))];
  const columns = distributeIntoColumns(categories, columnCount);

  return (
    <section id="skills" className="bg-ink-2 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl text-white sm:text-3xl">Compétences</h2>
      
        </Reveal>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-start">
          {columns.map((columnCats, colIndex) => (
            <div key={colIndex} className="flex flex-1 flex-col gap-4">
              {columnCats.map((cat, i) => (
                <Reveal key={cat} delay={(colIndex + i) * 0.05}>
                  <CategoryCard cat={cat} skills={skills.filter((s) => s.category === cat)} />
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
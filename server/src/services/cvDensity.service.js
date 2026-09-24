/**
 * Calcule un facteur d'échelle (entre 0.68 et 1) en fonction du volume total
 * de contenu, pour que le CV tienne toujours sur une seule page A4 —
 * qu'il y ait 5 compétences ou 40.
 *
 * Chaque type de contenu "coûte" un nombre de points différent selon
 * l'espace qu'il occupe réellement dans la mise en page.
 */
export function computeDensityScale({ skills, projects, certifications, experiences, education, bio }) {
  const units =
    (skills?.length || 0) * 1 +
    (projects?.length || 0) * 4 +
    (certifications?.length || 0) * 1.5 +
    (experiences?.length || 0) * 3.5 +
    (education?.length || 0) * 3 +
    Math.ceil((bio?.length || 0) / 220);

  const REFERENCE_UNITS = 34; // volume "confortable" correspondant à scale = 1
  const MIN_SCALE = 0.68;
  const MAX_SCALE = 1;

  const raw = REFERENCE_UNITS / Math.max(units, REFERENCE_UNITS * 0.4);
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, raw));

  return Math.round(scale * 100) / 100;
}
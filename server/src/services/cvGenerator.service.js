import puppeteer from 'puppeteer';
import { buildCvHtml } from '../templates/cvTemplate.js';
import { computeDensityScale } from './cvDensity.service.js';

/**
 * Génère le PDF du CV en mémoire à partir des données actuelles.
 * Retourne un Buffer prêt à être envoyé au téléchargement.
 */
export async function generateCvPdf(data) {
  const scale = computeDensityScale(data);
  const html = await buildCvHtml({ ...data, scale });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });

    // Depuis Puppeteer v23+, page.pdf() renvoie un Uint8Array et non un Buffer Node.js.
    // Express corrompt silencieusement la réponse si on lui passe autre chose qu'un vrai
    // Buffer (il le traite comme du JSON) — conversion explicite obligatoire ici.
    return Buffer.from(pdfUint8Array);
  } finally {
    await browser.close();
  }
}
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
    // En production (Docker/Render), utilise le Chrome système installé via apt
    // (voir Dockerfile) plutôt que le Chromium bundlé de Puppeteer. En local,
    // cette variable n'existe pas, donc Puppeteer utilise son propre Chromium
    // téléchargé normalement lors du npm install local.
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
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

    return Buffer.from(pdfUint8Array);
  } finally {
    await browser.close();
  }
}
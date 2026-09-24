import QRCode from 'qrcode';

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const ICONS = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.2 1h2a2 2 0 0 1 2 1.7c.1 1 .4 2.1.7 3a2 2 0 0 1-.5 2.1L7.1 9.1a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .4 2 .6 3 .8a2 2 0 0 1 1.5 2Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8.5" r="5.5"/><path d="m7.5 13.5-1.8 6.8L12 17l6.3 3.3-1.8-6.8"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.2h9A1.5 1.5 0 0 1 21 8.7v9.8A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-12Z"/></svg>',
  quote: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 9c-1.7 0-3 1.3-3 3v3h4v-6Zm10 0c-1.7 0-3 1.3-3 3v3h4v-6Z"/></svg>',
};

const BRAND_ICONS = {
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.61-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48Z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.6L6.1 22H3l8.2-9.3L2.7 2h6.6l4.5 6.1L18.9 2Zm-1.2 18h1.7L7.4 3.9H5.6l12.1 16.1Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.44 1.34 4.93L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.12h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.53 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.53-3.7 8.2-8.25 8.2Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.79.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.24-.86.85-.86 2.06 0 1.22.88 2.4 1 2.56.13.17 1.74 2.66 4.22 3.73.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.17-.48-.29Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3C16.16 4.26 15.05 4.17 13.75 4.17c-2.7 0-4.55 1.65-4.55 4.68V10.5H6.7v3h2.5V21h4.3Z"/></svg>',
};

function socialIcon(iconName = '') {
  const key = iconName.toLowerCase().trim();
  return BRAND_ICONS[key] || ICONS.pin;
}

export async function buildCvHtml({ profile, skills, projects, certifications, experiences, education, socialLinks, languages, siteUrl, scale }) {
  const qrDataUrl = await QRCode.toDataURL(siteUrl, {
    margin: 0,
    color: { dark: '#0B1420', light: '#00000000' },
  });

  const skillsByCategory = {};
  (skills || []).forEach((s) => {
    if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
    skillsByCategory[s.category].push(s);
  });

  const timeline = [
    ...(experiences || []).map((e) => ({
      title: e.role, place: e.company, start: e.start_date, end: e.end_date,
      isCurrent: e.is_current, description: e.description, type: 'Expérience',
    })),
    ...(education || []).map((e) => ({
      title: e.degree, place: e.institution, start: e.start_date, end: e.end_date,
      isCurrent: e.is_current, description: e.description, type: 'Formation',
    })),
  ].sort((a, b) => new Date(b.start) - new Date(a.start));

  const skillsHtml = Object.entries(skillsByCategory)
    .map(([cat, items]) => `
      <div class="side-block">
        <p class="side-cat">${escapeHtml(cat)}</p>
        <div class="skill-tags">
          ${items.map((s) => `<span class="skill-tag">${escapeHtml(s.name)}</span>`).join('')}
        </div>
      </div>`)
    .join('');

  const languagesHtml = (languages || [])
    .map((l) => `
      <div class="lang-item">
        <div class="lang-top">
          <span class="lang-name">${escapeHtml(l.name)}</span>
          ${l.level_label ? `<span class="lang-level">${escapeHtml(l.level_label)}</span>` : ''}
        </div>
        <div class="lang-bar"><i style="width:${Math.max(0, Math.min(100, l.proficiency || 0))}%"></i></div>
      </div>`)
    .join('');

  // Certifications : cartes avec médaillon icône + accent doré, plus lisibles et visuellement fortes
  const certsHtml = (certifications || [])
    .map((c) => `
      <div class="cert-card">
        <div class="cert-badge">${ICONS.medal}</div>
        <div class="cert-info">
          <p class="cert-mini-title">${escapeHtml(c.title)}</p>
          <p class="cert-mini-issuer">${escapeHtml(c.issuer)}${c.issue_date ? ` · ${formatDate(c.issue_date)}` : ''}</p>
        </div>
      </div>`)
    .join('');

  const contactRows = [
    profile?.email ? `<div class="contact-row">${ICONS.mail}<span>${escapeHtml(profile.email)}</span></div>` : '',
    profile?.phone ? `<div class="contact-row">${ICONS.phone}<span>${escapeHtml(profile.phone)}</span></div>` : '',
    profile?.address ? `<div class="contact-row">${ICONS.pin}<span>${escapeHtml(profile.address)}</span></div>` : '',
  ].join('');

  const socialRows = (socialLinks || [])
    .map((s) => `<div class="contact-row">${socialIcon(s.icon_name || s.platform)}<span>${escapeHtml((s.url || '').replace(/^https?:\/\//, ''))}</span></div>`)
    .join('');

  // Timeline : ligne verticale continue + cartes légèrement détachées pour la profondeur
  const timelineHtml = timeline
    .map((item, i, arr) => `
      <div class="tl-item">
        <div class="tl-rail">
          <div class="tl-dot ${item.isCurrent ? 'tl-dot-current' : ''}"></div>
          ${i < arr.length - 1 ? '<div class="tl-line"></div>' : ''}
        </div>
        <div class="tl-card">
          <div class="tl-top">
            <p class="tl-title">${escapeHtml(item.title)}</p>
            <span class="tl-badge">${escapeHtml(item.type)}</span>
          </div>
          <p class="tl-place">${escapeHtml(item.place)}</p>
          <p class="tl-date">${formatDate(item.start)} — ${item.isCurrent ? "Aujourd'hui" : formatDate(item.end) || ''}</p>
          ${item.description ? `<p class="tl-desc">${escapeHtml(item.description)}</p>` : ''}
        </div>
      </div>`)
    .join('');

  // Projets : cartes avec bordure gauche accent + tags de stack distincts (au lieu de texte inline)
  const projectsHtml = (projects || [])
    .slice(0, 6)
    .map((p) => `
      <div class="proj-card">
        <p class="proj-title">${escapeHtml(p.title)}</p>
        ${p.short_description ? `<p class="proj-desc">${escapeHtml(p.short_description)}</p>` : ''}
        ${p.tech_stack?.length ? `<div class="proj-tags">${p.tech_stack.map((t) => `<span class="proj-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        ${p.github_url || p.demo_url ? `<p class="proj-links">${[p.github_url, p.demo_url].filter(Boolean).map(escapeHtml).join('  ·  ')}</p>` : ''}
      </div>`)
    .join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 210mm; height: 297mm; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased; }

  :root {
    --scale: ${scale};
    --ink: #0B1420;
    --gold: #C8912F;
    --gold-soft: #E8D9BC;
    --paper: #FAF8F3;
    --card: #FFFFFF;
    --line: #E7E0CF;
    --text-soft: #5C6A80;
    --fs-base: calc(8.6pt * var(--scale));
    --fs-sm: calc(7.4pt * var(--scale));
    --fs-xs: calc(6.6pt * var(--scale));
    --fs-name: calc(19pt * var(--scale));
    --fs-title: calc(9.5pt * var(--scale));
    --fs-h2: calc(9pt * var(--scale));
    --gap: calc(8px * var(--scale));
  }

  body { display: flex; }
  h1, h2, .side-name, .band h1 { font-family: 'Fraunces', Georgia, serif; }

  /* ===== SIDEBAR ===== */
  .sidebar { width: 34%; background: var(--ink); color: #E9EBF0; padding: calc(20px * var(--scale)) calc(16px * var(--scale)); }
  .avatar {
    width: calc(76px * var(--scale)); height: calc(76px * var(--scale));
    border-radius: 50%; overflow: hidden; background: #1B2638;
    margin: 0 auto calc(var(--gap) * 1.1); border: 2px solid var(--gold);
  }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .side-name { text-align: center; font-size: calc(13.5pt * var(--scale)); font-weight: 600; color: #fff; letter-spacing: -0.01em; }
  .side-title { text-align: center; font-size: var(--fs-sm); color: var(--gold-soft); margin-top: 3px; margin-bottom: calc(var(--gap) * 1.3); font-weight: 500; }

  .side-h2 {
    display: flex; align-items: center; gap: 5px;
    font-size: var(--fs-xs); text-transform: uppercase; letter-spacing: 0.09em;
    color: var(--gold); font-weight: 700; margin: calc(var(--gap) * 1.15) 0 calc(var(--gap) * 0.55);
  }
  .side-h2::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.14); }

  .contact-row { display: flex; align-items: center; gap: 6px; font-size: var(--fs-xs); color: #C7CEDA; margin-bottom: 4px; }
  .contact-row svg { width: calc(9px * var(--scale)); height: calc(9px * var(--scale)); color: var(--gold); flex-shrink: 0; }

  .side-block { margin-bottom: calc(var(--gap) * 0.65); }
  .side-cat { font-size: var(--fs-xs); font-weight: 700; color: #fff; margin-bottom: 4px; letter-spacing: 0.02em; }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .skill-tag {
    font-size: calc(6.4pt * var(--scale)); font-weight: 500; background: rgba(200,145,47,0.14);
    border: 1px solid rgba(200,145,47,0.35); border-radius: 20px;
    padding: 2.5px 8px; color: #F0E4CC;
  }

  .lang-item { margin-bottom: calc(var(--gap) * 0.55); }
  .lang-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
  .lang-name { font-size: var(--fs-xs); font-weight: 600; color: #fff; }
  .lang-level { font-size: calc(6pt * var(--scale)); color: #9AA3B5; }
  .lang-bar { height: 3px; background: rgba(255,255,255,0.12); border-radius: 2px; overflow: hidden; }
  .lang-bar i { display: block; height: 100%; background: var(--gold); border-radius: 2px; }

  /* Certifications — cartes avec médaillon icône */
  .cert-card {
    display: flex; align-items: center; gap: calc(7px * var(--scale));
    background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 9px; padding: calc(6px * var(--scale)) calc(8px * var(--scale));
    margin-bottom: calc(var(--gap) * 0.4);
  }
  .cert-badge {
    width: calc(20px * var(--scale)); height: calc(20px * var(--scale)); flex-shrink: 0;
    border-radius: 50%; background: rgba(200,145,47,0.16); border: 1px solid rgba(200,145,47,0.4);
    display: flex; align-items: center; justify-content: center; color: var(--gold);
  }
  .cert-badge svg { width: calc(11px * var(--scale)); height: calc(11px * var(--scale)); }
  .cert-mini-title { font-size: var(--fs-xs); font-weight: 700; color: #fff; line-height: 1.25; }
  .cert-mini-issuer { font-size: calc(6.1pt * var(--scale)); color: #9AA3B5; margin-top: 1px; }

  /* ===== MAIN ===== */
  .main { width: 66%; background: var(--paper); }
  .band {
    background: linear-gradient(125deg, var(--ink) 0%, #16233A 100%);
    color: #fff; padding: calc(18px * var(--scale)) calc(20px * var(--scale));
    display: flex; justify-content: space-between; align-items: center;
    border-left: calc(3px * var(--scale)) solid var(--gold);
  }
  .band h1 { font-size: var(--fs-name); font-weight: 600; letter-spacing: -0.01em; }
  .band .subtitle { font-size: var(--fs-title); color: var(--gold-soft); margin-top: 3px; font-weight: 500; }
  .qr-box { width: calc(38px * var(--scale)); height: calc(38px * var(--scale)); background: #fff; border-radius: 6px; padding: 3px; flex-shrink: 0; }
  .qr-box img { width: 100%; height: 100%; }
  .qr-label { font-size: calc(5pt * var(--scale)); text-align: center; color: var(--ink); margin-top: 1px; }

  .main-body { padding: calc(16px * var(--scale)) calc(20px * var(--scale)); }
  .main-h2 {
    display: flex; align-items: center; gap: 7px;
    font-size: var(--fs-h2); text-transform: uppercase; letter-spacing: 0.07em;
    color: var(--ink); font-weight: 700; margin-bottom: calc(var(--gap) * 0.65);
  }
  .main-h2 .h2-icon {
    width: calc(16px * var(--scale)); height: calc(16px * var(--scale)); border-radius: 5px;
    background: var(--ink); color: var(--gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .main-h2 .h2-icon svg { width: calc(9px * var(--scale)); height: calc(9px * var(--scale)); }
  .main-h2::after { content: ''; flex: 1; height: 1px; background: var(--line); }
  .block { margin-bottom: calc(var(--gap) * 1.5); }

  .bio-card {
    background: var(--card); border: 1px solid var(--line); border-left: calc(2.5px * var(--scale)) solid var(--gold);
    border-radius: 8px; padding: calc(9px * var(--scale)) calc(11px * var(--scale));
  }
  .bio-text { font-size: var(--fs-base); color: #3A4152; line-height: 1.55; font-style: italic; }

  /* Timeline avec rail + carte */
  .tl-item { display: flex; gap: calc(9px * var(--scale)); }
  .tl-rail { display: flex; flex-direction: column; align-items: center; width: calc(12px * var(--scale)); flex-shrink: 0; }
  .tl-dot { width: calc(8px * var(--scale)); height: calc(8px * var(--scale)); border-radius: 50%; background: var(--card); border: 2px solid var(--gold); margin-top: calc(4px * var(--scale)); flex-shrink: 0; }
  .tl-dot-current { background: var(--gold); }
  .tl-line { width: 1.5px; flex: 1; background: var(--line); margin: 2px 0; }
  .tl-card {
    flex: 1; background: var(--card); border: 1px solid var(--line); border-radius: 9px;
    padding: calc(7px * var(--scale)) calc(10px * var(--scale)); margin-bottom: calc(var(--gap) * 0.65);
  }
  .tl-top { display: flex; justify-content: space-between; align-items: baseline; gap: 6px; }
  .tl-title { font-size: var(--fs-base); font-weight: 700; color: var(--ink); }
  .tl-badge {
    font-size: calc(5.8pt * var(--scale)); text-transform: uppercase; letter-spacing: 0.04em;
    background: rgba(200,145,47,0.12); color: #A87220; border-radius: 10px; padding: 1.5px 7px; flex-shrink: 0;
  }
  .tl-place { font-size: var(--fs-sm); color: var(--text-soft); font-weight: 500; margin-top: 1px; }
  .tl-date { font-size: var(--fs-xs); color: var(--gold); font-weight: 700; margin-top: 2px; }
  .tl-desc { font-size: var(--fs-sm); color: var(--text-soft); line-height: 1.45; margin-top: 3px; }

  /* Projets en cartes */
  .proj-card {
    background: var(--card); border: 1px solid var(--line); border-radius: 9px;
    padding: calc(8px * var(--scale)) calc(11px * var(--scale)); margin-bottom: calc(var(--gap) * 0.65);
    border-top: calc(2.5px * var(--scale)) solid var(--gold);
  }
  .proj-title { font-size: var(--fs-base); font-weight: 700; color: var(--ink); }
  .proj-desc { font-size: var(--fs-sm); color: var(--text-soft); line-height: 1.45; margin-top: 2px; }
  .proj-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: calc(5px * var(--scale)); }
  .proj-tag {
    font-size: calc(6.2pt * var(--scale)); font-weight: 600; color: var(--ink);
    background: var(--gold-soft); border-radius: 5px; padding: 1.5px 6px;
  }
  .proj-links { font-size: var(--fs-xs); color: #9AA3B5; margin-top: calc(5px * var(--scale)); }
</style>
</head>
<body>

  <aside class="sidebar">
    <div class="avatar">
      ${profile?.cv_photo_url || profile?.photo_url ? `<img src="${profile.cv_photo_url || profile.photo_url}" alt="" />` : ''}
    </div>
    <p class="side-name">${escapeHtml(profile?.full_name || '')}</p>
    <p class="side-title">${escapeHtml(profile?.title || '')}</p>

    ${contactRows ? `<h2 class="side-h2">Contact</h2>${contactRows}` : ''}
    ${socialRows ? `<h2 class="side-h2">Réseaux</h2>${socialRows}` : ''}
    ${languagesHtml ? `<h2 class="side-h2">Langues</h2>${languagesHtml}` : ''}
    ${skillsHtml ? `<h2 class="side-h2">Compétences</h2>${skillsHtml}` : ''}
    ${certsHtml ? `<h2 class="side-h2">Certifications</h2>${certsHtml}` : ''}
  </aside>

  <main class="main">
    <div class="band">
      <div>
        <h1>${escapeHtml(profile?.full_name || '')}</h1>
        <p class="subtitle">${escapeHtml(profile?.title || '')}</p>
      </div>
      <div>
        <div class="qr-box"><img src="${qrDataUrl}" alt="QR" /></div>
        <p class="qr-label">Portfolio</p>
      </div>
    </div>

    <div class="main-body">
      ${profile?.bio ? `<div class="block"><h2 class="main-h2"><span class="h2-icon">${ICONS.quote}</span>Profil</h2><div class="bio-card"><p class="bio-text">${escapeHtml(profile.bio)}</p></div></div>` : ''}
      ${timelineHtml ? `<div class="block"><h2 class="main-h2"><span class="h2-icon">${ICONS.briefcase}</span>Parcours</h2>${timelineHtml}</div>` : ''}
      ${projectsHtml ? `<div class="block"><h2 class="main-h2"><span class="h2-icon">${ICONS.folder}</span>Projets</h2>${projectsHtml}</div>` : ''}
    </div>
  </main>

</body>
</html>`;
}
import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { generateCvPdf } from '../services/cvGenerator.service.js';

const router = Router();

router.get('/download', async (req, res) => {
  try {
    const [profileRes, skillsRes, projectsRes, certificationsRes, experiencesRes, educationRes, socialRes, languagesRes] =
      await Promise.all([
        supabaseAdmin.from('profile').select('*').limit(1).single(),
        supabaseAdmin.from('skills').select('*').order('display_order'),
        supabaseAdmin.from('projects').select('*').order('display_order'),
        supabaseAdmin.from('certifications').select('*').order('display_order'),
        supabaseAdmin.from('experiences').select('*').order('start_date', { ascending: false }),
        supabaseAdmin.from('education').select('*').order('start_date', { ascending: false }),
        supabaseAdmin.from('social_links').select('*').order('display_order'),
        supabaseAdmin.from('languages').select('*').order('display_order'),
      ]);

    if (profileRes.error) {
      return res.status(404).json({ error: 'Profil introuvable — remplis-le depuis /admin/profile' });
    }

    const pdfBuffer = await generateCvPdf({
      profile: profileRes.data,
      skills: skillsRes.data || [],
      projects: projectsRes.data || [],
      certifications: certificationsRes.data || [],
      experiences: experiencesRes.data || [],
      education: educationRes.data || [],
      socialLinks: socialRes.data || [],
      languages: languagesRes.data || [],
      siteUrl: process.env.SITE_URL || 'http://localhost:5173',
    });

    const fileName = `CV-${(profileRes.data.full_name || 'portfolio').replace(/\s+/g, '-')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Erreur génération CV:', err);
    res.status(500).json({ error: 'Erreur lors de la génération du CV' });
  }
});

export default router;
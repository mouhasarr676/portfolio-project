import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import { sendContactNotification } from '../services/email.service.js';

const router = Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nom, email et message sont requis' });
  }

  const { data, error } = await supabaseAdmin
    .from('messages')
    .insert([{ name, email, subject, message }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  // Envoi de la notification email en arrière-plan : si ça échoue,
  // le message reste bien enregistré en base (visible dans /admin/messages).
  const notifyTo = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (notifyTo) {
    sendContactNotification({ to: notifyTo, name, email, subject, message }).catch((err) => {
      console.error('Échec envoi email de notification:', err.message);
    });
  }

  res.status(201).json({ success: true, data });
});

router.get('/', requireAdmin, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin
    .from('messages')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabaseAdmin.from('messages').delete().eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

export default router;
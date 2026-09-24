import { supabaseAuth } from '../config/supabase.js';

/**
 * Protège les routes d'écriture (create/update/delete).
 * Le frontend envoie le token Supabase reçu à la connexion dans le header :
 *   Authorization: Bearer <token>
 * On vérifie ici que ce token est valide et correspond à un utilisateur réel.
 */
export async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  const token = authHeader.split(' ')[1];

  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Session invalide ou expirée' });
  }

  // Le token est valide : on attache l'utilisateur à la requête si besoin plus tard
  req.user = data.user;
  next();
}
import { supabaseAdmin } from '../config/supabase.js';

/**
 * Génère un contrôleur CRUD complet pour une table Supabase donnée.
 * Évite de réécrire le même code pour chaque ressource (skills, projects, etc.)
 *
 * @param {string} tableName - nom exact de la table dans Supabase
 * @param {string} orderColumn - colonne utilisée pour trier les résultats
 */
export function createCrudController(tableName, orderColumn = 'display_order') {
  return {
    // GET /api/xxx  -> liste complète
    getAll: async (req, res) => {
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .order(orderColumn, { ascending: true });

      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    },

    // GET /api/xxx/:id -> un seul élément
    getOne: async (req, res) => {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) return res.status(404).json({ error: 'Élément non trouvé' });
      res.json(data);
    },

    // POST /api/xxx -> création
    create: async (req, res) => {
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .insert([req.body])
        .select()
        .single();

      if (error) return res.status(400).json({ error: error.message });
      res.status(201).json(data);
    },

    // PUT /api/xxx/:id -> mise à jour
    update: async (req, res) => {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .update(req.body)
        .eq('id', id)
        .select()
        .single();

      if (error) return res.status(400).json({ error: error.message });
      res.json(data);
    },

    // DELETE /api/xxx/:id -> suppression
    remove: async (req, res) => {
      const { id } = req.params;
      const { error } = await supabaseAdmin
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) return res.status(400).json({ error: error.message });
      res.status(204).send();
    },
  };
}
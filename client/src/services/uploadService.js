import { supabase } from './supabaseClient';

/**
 * Upload un fichier image vers Supabase Storage et retourne son URL publique.
 * @param {File} file - le fichier sélectionné depuis la galerie
 * @param {string} folder - sous-dossier logique (ex: "profile", "projects")
 */
export async function uploadImage(file, folder = 'misc') {
  if (!file) throw new Error('Aucun fichier sélectionné');

  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('portfolio-assets')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(fileName);
  return data.publicUrl;
}
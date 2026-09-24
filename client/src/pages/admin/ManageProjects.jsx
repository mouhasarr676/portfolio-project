import ResourceManager from '../../components/admin/ResourceManager';

export default function ManageProjects() {
  return (
    <ResourceManager
      endpoint="/projects"
      title="Projets"
      columns={[
        { key: 'title', label: 'Titre' },
        { key: 'tech_stack', label: 'Stack', render: (v) => (v || []).join(', ') },
        { key: 'featured', label: 'Mis en avant', render: (v) => (v ? 'Oui' : 'Non') },
      ]}
      fields={[
        { key: 'title', label: 'Titre', required: true },
        { key: 'short_description', label: 'Description courte (pour la card)' },
        { key: 'description', label: 'Description complète', type: 'textarea' },
        { key: 'image_url', label: "Image d'aperçu (optionnel)", type: 'image', folder: 'projects' },
        { key: 'github_url', label: 'Lien GitHub' },
        { key: 'demo_url', label: 'Lien démo' },
        { key: 'tech_stack', label: 'Technologies', type: 'tags' },
        { key: 'featured', label: 'Mettre en avant', type: 'checkbox' },
        { key: 'display_order', label: "Ordre d'affichage", type: 'number' },
      ]}
      emptyItem={{
        title: '', short_description: '', description: '', image_url: '',
        github_url: '', demo_url: '', tech_stack: [], featured: false, display_order: 0,
      }}
    />
  );
}
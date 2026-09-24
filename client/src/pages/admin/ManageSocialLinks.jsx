import ResourceManager from '../../components/admin/ResourceManager';

export default function ManageSocialLinks() {
  return (
    <ResourceManager
      endpoint="/social-links"
      title="Réseaux sociaux"
      columns={[
        { key: 'platform', label: 'Plateforme' },
        { key: 'url', label: 'Lien' },
      ]}
      fields={[
        { key: 'platform', label: 'Nom (ex: LinkedIn, GitHub)', required: true },
        { key: 'url', label: 'URL complète', required: true },
        { key: 'icon_name', label: "Nom d'icône (github, linkedin, twitter, instagram, mail...)" },
        { key: 'display_order', label: "Ordre d'affichage", type: 'number' },
      ]}
      emptyItem={{ platform: '', url: '', icon_name: '', display_order: 0 }}
    />
  );
}
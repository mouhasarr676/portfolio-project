import ResourceManager from '../../components/admin/ResourceManager';

export default function ManageCertifications() {
  return (
    <ResourceManager
      endpoint="/certifications"
      title="Certifications"
      columns={[
        { key: 'title', label: 'Titre' },
        { key: 'issuer', label: 'Organisme' },
        { key: 'issue_date', label: 'Date' },
      ]}
      fields={[
        { key: 'title', label: 'Titre', required: true },
        { key: 'issuer', label: 'Organisme (ex: AWS, Google)', required: true },
        { key: 'issue_date', label: "Date d'obtention", type: 'date' },
        { key: 'credential_url', label: 'Lien vers le certificat' },
        { key: 'badge_image_url', label: 'Badge / logo (optionnel)', type: 'image', folder: 'certifications' },
        { key: 'display_order', label: "Ordre d'affichage", type: 'number' },
      ]}
      emptyItem={{ title: '', issuer: '', issue_date: '', credential_url: '', badge_image_url: '', display_order: 0 }}
    />
  );
}
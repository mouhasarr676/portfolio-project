import ResourceManager from '../../components/admin/ResourceManager';

export default function ManageSkills() {
  return (
    <ResourceManager
      endpoint="/skills"
      title="Compétences"
      columns={[
        { key: 'name', label: 'Nom' },
        { key: 'category', label: 'Catégorie' },
        { key: 'proficiency', label: 'Niveau', render: (v) => `${v}%` },
      ]}
      fields={[
        { key: 'name', label: 'Nom', required: true },
        { key: 'category', label: 'Catégorie (ex: Frontend, Backend)', required: true },
        { key: 'proficiency', label: 'Niveau (0-100)', type: 'number', required: true },
        { key: 'icon_name', label: "Nom d'icône (lucide-react, ex: code)" },
        { key: 'display_order', label: "Ordre d'affichage", type: 'number' },
        { key: 'show_on_cv', label: 'Afficher sur le CV', type: 'checkbox' },
      ]}
      emptyItem={{ name: '', category: '', proficiency: 50, icon_name: '', display_order: 0, show_on_cv: true }}
    />
  );
}
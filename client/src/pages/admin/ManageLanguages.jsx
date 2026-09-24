import ResourceManager from '../../components/admin/ResourceManager';

export default function ManageLanguages() {
  return (
    <ResourceManager
      endpoint="/languages"
      title="Langues"
      columns={[
        { key: 'name', label: 'Langue' },
        { key: 'level_label', label: 'Niveau' },
        { key: 'proficiency', label: '%', render: (v) => `${v}%` },
      ]}
      fields={[
        { key: 'name', label: 'Langue (ex: Français, Anglais)', required: true },
        { key: 'level_label', label: 'Étiquette de niveau (ex: Courant, Natif, Intermédiaire)' },
        { key: 'proficiency', label: 'Niveau en % (0-100)', type: 'number', required: true },
        { key: 'display_order', label: "Ordre d'affichage", type: 'number' },
      ]}
      emptyItem={{ name: '', level_label: '', proficiency: 50, display_order: 0 }}
    />
  );
}
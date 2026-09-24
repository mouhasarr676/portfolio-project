import ResourceManager from '../../components/admin/ResourceManager';

export default function ManageEducation() {
  return (
    <ResourceManager
      endpoint="/education"
      title="Parcours académique"
      columns={[
        { key: 'degree', label: 'Diplôme' },
        { key: 'institution', label: 'Établissement' },
        { key: 'start_date', label: 'Début' },
      ]}
      fields={[
        { key: 'degree', label: 'Diplôme / Formation', required: true },
        { key: 'institution', label: 'Établissement', required: true },
        { key: 'location', label: 'Lieu' },
        { key: 'start_date', label: 'Date de début', type: 'date', required: true },
        { key: 'end_date', label: 'Date de fin (laisser vide si en cours)', type: 'date' },
        { key: 'is_current', label: 'En cours', type: 'checkbox' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'display_order', label: "Ordre d'affichage", type: 'number' },
      ]}
      emptyItem={{
        degree: '', institution: '', location: '', start_date: '', end_date: '',
        is_current: false, description: '', display_order: 0,
      }}
    />
  );
}
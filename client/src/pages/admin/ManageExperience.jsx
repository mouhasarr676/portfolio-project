import ResourceManager from '../../components/admin/ResourceManager';

export default function ManageExperience() {
  return (
    <ResourceManager
      endpoint="/experiences"
      title="Expériences professionnelles"
      columns={[
        { key: 'role', label: 'Poste' },
        { key: 'company', label: 'Entreprise' },
        { key: 'start_date', label: 'Début' },
      ]}
      fields={[
        { key: 'role', label: 'Intitulé du poste', required: true },
        { key: 'company', label: 'Entreprise', required: true },
        { key: 'location', label: 'Lieu' },
        { key: 'start_date', label: 'Date de début', type: 'date', required: true },
        { key: 'end_date', label: 'Date de fin (laisser vide si en cours)', type: 'date' },
        { key: 'is_current', label: 'Poste actuel', type: 'checkbox' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'display_order', label: "Ordre d'affichage", type: 'number' },
      ]}
      emptyItem={{
        role: '', company: '', location: '', start_date: '', end_date: '',
        is_current: false, description: '', display_order: 0,
      }}
    />
  );
}
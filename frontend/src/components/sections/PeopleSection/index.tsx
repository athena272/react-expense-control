import FormField from '@shared/FormField'
import Table from '@shared/Table'
import tableStyles from '@shared/Table/Table.module.css'
import styles from './PeopleSection.module.css'
import type { Person } from '../../../types'

type PeopleErrors = {
  name?: string
  age?: string
  form?: string
}

type PeopleSectionProps = {
  people: Person[]
  personForm: { name: string; age: string }
  errors: PeopleErrors
  editingPersonId: number | null
  onNameChange: (value: string) => void
  onAgeChange: (value: string) => void
  onSubmit: () => void
  onCancelEdit: () => void
  onEdit: (person: Person) => void
  onDelete: (id: number) => void
}

export default function PeopleSection({
  people,
  personForm,
  errors,
  editingPersonId,
  onNameChange,
  onAgeChange,
  onSubmit,
  onCancelEdit,
  onEdit,
  onDelete,
}: PeopleSectionProps) {
  return (
    <section className="card">
      <h2>Pessoas</h2>
      <div className="grid">
        <FormField
          label="Nome"
          counter={`${personForm.name.length}/200`}
          error={errors.name}
        >
          <input
            className={errors.name ? 'input-error' : undefined}
            value={personForm.name}
            onChange={(event) => onNameChange(event.target.value)}
            maxLength={200}
            placeholder="Nome completo"
            name='nome-completo'
          />
        </FormField>
        <FormField label="Idade" error={errors.age}>
          <input
            type="number"
            min={0}
            className={errors.age ? 'input-error' : undefined}
            value={personForm.age}
            onChange={(event) => onAgeChange(event.target.value)}
            placeholder="Idade"
            name='idade'
          />
        </FormField>
      </div>
      <div className={styles.actions}>
        <button onClick={onSubmit}>
          {editingPersonId ? 'Atualizar' : 'Cadastrar'}
        </button>
        {editingPersonId && (
          <button className="secondary" onClick={onCancelEdit}>
            Cancelar edição
          </button>
        )}
      </div>
      {errors.form && <div className={styles.formError}>{errors.form}</div>}
      <Table headers={['Nome', 'Idade', 'Ações']}>
        {people.map((person) => (
          <div className={tableStyles.row} key={person.id}>
            <span>{person.name}</span>
            <span>{person.age}</span>
            <span className={styles.rowActions}>
              <button onClick={() => onEdit(person)}>Editar</button>
              <button className="danger" onClick={() => onDelete(person.id)}>
                Excluir
              </button>
            </span>
          </div>
        ))}
      </Table>
    </section>
  )
}

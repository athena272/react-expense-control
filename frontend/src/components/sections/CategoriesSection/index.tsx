import FormField from '@shared/FormField'
import Table from '@shared/Table'
import tableStyles from '@shared/Table/Table.module.css'
import styles from './CategoriesSection.module.css'
import type { Category, CategoryPurpose } from '../../../types'

type CategoryErrors = {
  description?: string
  purpose?: string
  form?: string
}

type CategoriesSectionProps = {
  categories: Category[]
  categoryForm: { description: string; purpose: CategoryPurpose }
  errors: CategoryErrors
  onDescriptionChange: (value: string) => void
  onPurposeChange: (value: CategoryPurpose) => void
  onSubmit: () => void
  formatCategoryPurpose: (purpose: CategoryPurpose) => string
}

export default function CategoriesSection({
  categories,
  categoryForm,
  errors,
  onDescriptionChange,
  onPurposeChange,
  onSubmit,
  formatCategoryPurpose,
}: CategoriesSectionProps) {
  return (
    <section className="card">
      <h2>Categorias</h2>
      <div className="grid">
        <FormField
          label="Descrição"
          counter={`${categoryForm.description.length}/400`}
          error={errors.description}
        >
          <input
            className={errors.description ? 'input-error' : undefined}
            value={categoryForm.description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            maxLength={400}
            placeholder="Ex.: Alimentação"
            name='descricao-categoria'
          />
        </FormField>
        <FormField label="Finalidade" error={errors.purpose}>
          <select
            className={errors.purpose ? 'input-error' : undefined}
            value={categoryForm.purpose}
            onChange={(event) =>
              onPurposeChange(event.target.value as CategoryPurpose)
            }
            name='finalidade-categoria'
          >
            <option value="" disabled>Selecione uma finalidade</option>
            <option value="Expense">Despesa</option>
            <option value="Income">Receita</option>
            <option value="Both">Ambas</option>
          </select>
        </FormField>
      </div>
      <div className={styles.actions}>
        <button onClick={onSubmit}>Cadastrar</button>
      </div>
      {errors.form && <div className={styles.formError}>{errors.form}</div>}
      <Table headers={['Descrição', 'Finalidade']}>
        {categories.map((category) => (
          <div className={tableStyles.row} key={category.id}>
            <span>{category.description}</span>
            <span>{formatCategoryPurpose(category.purpose)}</span>
          </div>
        ))}
      </Table>
    </section>
  )
}

import FormField from '@shared/FormField'
import Table from '@shared/Table'
import tableStyles from '@shared/Table/Table.module.css'
import styles from './TransactionsSection.module.css'
import type { Category, Person, Transaction, TransactionType } from '../../../types'

type TransactionErrors = {
  description?: string
  value?: string
  type?: string
  personId?: string
  categoryId?: string
  form?: string
}

type TransactionsSectionProps = {
  transactions: Transaction[]
  people: Person[]
  availableCategories: Category[]
  form: {
    description: string
    value: string
    type: TransactionType
    categoryId: string
    personId: string
  }
  errors: TransactionErrors
  onDescriptionChange: (value: string) => void
  onValueChange: (value: string) => void
  onTypeChange: (value: TransactionType) => void
  onPersonChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSubmit: () => void
  isTypeDisabled: boolean
  formatCategoryPurpose: (purpose: Category['purpose']) => string
  formatTransactionType: (type: TransactionType) => string
  formatMoney: (value: number) => string
}

export default function TransactionsSection({
  transactions,
  people,
  availableCategories,
  form,
  errors,
  onDescriptionChange,
  onValueChange,
  onTypeChange,
  onPersonChange,
  onCategoryChange,
  onSubmit,
  isTypeDisabled,
  formatCategoryPurpose,
  formatTransactionType,
  formatMoney,
}: TransactionsSectionProps) {
  return (
    <section className="card">
      <h2>Transações</h2>
      <div className="grid">
        <FormField
          label="Descrição"
          counter={`${form.description.length}/400`}
          error={errors.description}
        >
          <input
            className={errors.description ? 'input-error' : undefined}
            value={form.description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            maxLength={400}
            placeholder="Ex.: Mercado"
            name='descricao-transacao'
          />
        </FormField>
        <FormField label="Valor" error={errors.value}>
          <input
            type="number"
            min={0}
            className={errors.value ? 'input-error' : undefined}
            value={form.value}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder="0,00"
            name='valor-transacao'
          />
        </FormField>
        <FormField label="Tipo" error={errors.type}>
          <select
            className={errors.type ? 'input-error' : undefined}
            value={form.type}
            onChange={(event) => onTypeChange(event.target.value as TransactionType)}
            disabled={isTypeDisabled}
            name='tipo-transacao'
          >
            <option value="" disabled>Selecione um tipo</option>
            <option value="Expense">Despesa</option>
            <option value="Income">Receita</option>
          </select>
        </FormField>
        <FormField label="Pessoa" error={errors.personId}>
          <select
            className={errors.personId ? 'input-error' : undefined}
            value={form.personId}
            onChange={(event) => onPersonChange(event.target.value)}
            name='pessoa-transacao'
          >
            <option value="">Selecione</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} ({person.age})
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Categoria" error={errors.categoryId}>
          <select
            className={errors.categoryId ? 'input-error' : undefined}
            value={form.categoryId}
            onChange={(event) => onCategoryChange(event.target.value)}
            name='categoria-transacao'
          >
            <option value="">Selecione</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.description} ({formatCategoryPurpose(category.purpose)})
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <div className={styles.actions}>
        <button onClick={onSubmit}>Registrar</button>
      </div>
      {errors.form && <div className={styles.formError}>{errors.form}</div>}
      <Table headers={['Descrição', 'Pessoa', 'Categoria', 'Tipo', 'Valor']}>
        {transactions.map((transaction) => (
          <div className={tableStyles.row} key={transaction.id}>
            <span>{transaction.description}</span>
            <span>{transaction.personName}</span>
            <span>{transaction.categoryDescription}</span>
            <span>{formatTransactionType(transaction.type)}</span>
            <span>{formatMoney(transaction.value)}</span>
          </div>
        ))}
      </Table>
    </section>
  )
}

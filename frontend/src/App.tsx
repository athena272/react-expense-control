import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getCategories,
  getCategoryTotals,
  getPeople,
  getPeopleTotals,
  getTransactions,
} from './api'
import CategoriesSection from '@components/sections/CategoriesSection'
import CategoryTotalsSection from '@components/sections/CategoryTotalsSection'
import PeopleSection from '@components/sections/PeopleSection'
import PeopleTotalsSection from '@components/sections/PeopleTotalsSection'
import TransactionsSection from '@components/sections/TransactionsSection'
import { useCategoryActions } from './hooks/useCategoryActions'
import { useCategoryForm } from './hooks/useCategoryForm'
import { usePersonActions } from './hooks/usePersonActions'
import { usePeopleForm } from './hooks/usePeopleForm'
import { useTransactionActions } from './hooks/useTransactionActions'
import { useTransactionForm } from './hooks/useTransactionForm'
import type {
  Category,
  CategoryPurpose,
  CategoryTotalsReport,
  PeopleTotalsReport,
  Person,
  Transaction,
  TransactionType,
} from './types'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const defaultPeopleTotals: PeopleTotalsReport = {
  items: [],
  summary: { totalIncome: 0, totalExpense: 0, balance: 0 },
}

const defaultCategoryTotals: CategoryTotalsReport = {
  items: [],
  summary: { totalIncome: 0, totalExpense: 0, balance: 0 },
}

function formatMoney(value: number) {
  return currencyFormatter.format(value)
}

function formatCategoryPurpose(purpose: CategoryPurpose) {
  switch (purpose) {
    case 'Expense':
      return 'Despesa'
    case 'Income':
      return 'Receita'
    case 'Both':
      return 'Ambas'
    default:
      return purpose
  }
}

function formatTransactionType(type: TransactionType) {
  switch (type) {
    case 'Expense':
      return 'Despesa'
    case 'Income':
      return 'Receita'
    default:
      return type
  }
}

export default function App() {
  const [people, setPeople] = useState<Person[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [peopleTotals, setPeopleTotals] =
    useState<PeopleTotalsReport>(defaultPeopleTotals)
  const [categoryTotals, setCategoryTotals] =
    useState<CategoryTotalsReport>(defaultCategoryTotals)
  const [loadError, setLoadError] = useState<string | null>(null)

  const {
    personForm,
    editingPersonId,
    errors: personErrors,
    setErrors: setPersonErrors,
    updateName,
    updateAge,
    startEdit,
    cancelEdit,
    setPersonForm,
    setEditingPersonId,
  } = usePeopleForm()

  const {
    categoryForm,
    errors: categoryErrors,
    setErrors: setCategoryErrors,
    updateDescription,
    updatePurpose,
    reset: resetCategoryForm,
  } = useCategoryForm()

  const {
    form: transactionForm,
    errors: transactionErrors,
    setErrors: setTransactionErrors,
    updateDescription: updateTransactionDescription,
    updateValue: updateTransactionValue,
    updateType: updateTransactionType,
    updatePersonId,
    updateCategoryId,
    reset: resetTransactionForm,
  } = useTransactionForm()

  const loadAll = useCallback(async () => {
    try {
      setLoadError(null)
      const [
        peopleData,
        categoryData,
        transactionData,
        peopleTotalsData,
        categoryTotalsData,
      ] = await Promise.all([
        getPeople(),
        getCategories(),
        getTransactions(),
        getPeopleTotals(),
        getCategoryTotals(),
      ])

      setPeople(peopleData)
      setCategories(categoryData)
      setTransactions(transactionData)
      setPeopleTotals(peopleTotalsData)
      setCategoryTotals(categoryTotalsData)
    } catch (error) {
      setLoadError((error as Error).message)
    }
  }, [])

  const { handleSave: handleSavePerson, handleDelete: handleDeletePerson } =
    usePersonActions({
      personForm,
      setPersonForm,
      editingPersonId,
      setEditingPersonId,
      setErrors: setPersonErrors,
      loadAll,
    })

  const { handleSave: handleSaveCategory } = useCategoryActions({
    categoryForm,
    reset: resetCategoryForm,
    setErrors: setCategoryErrors,
    loadAll,
  })

  const { handleSave: handleSaveTransaction } = useTransactionActions({
    transactionForm,
    reset: resetTransactionForm,
    setErrors: setTransactionErrors,
    loadAll,
  })

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  useEffect(() => {
    if (!transactionForm.personId) {
      return
    }

    const selectedPerson = people.find(
      (person) => person.id === Number(transactionForm.personId)
    )

    // Regra de UI: menores de idade só podem lançar despesas.
    if (selectedPerson && selectedPerson.age < 18) {
      updateTransactionType('Expense')
    }
  }, [transactionForm.personId, people])

  const availableCategories = useMemo(() => {
    if (transactionForm.type === 'Expense') {
      return categories.filter(
        (category) =>
          category.purpose === 'Expense' || category.purpose === 'Both'
      )
    }

    return categories.filter(
      (category) =>
        category.purpose === 'Income' || category.purpose === 'Both'
    )
  }, [categories, transactionForm.type])

  return (
    <div className="app">
      <header>
        <h1>Controle de Gastos Residenciais</h1>
        <p>
          Cadastros e relatórios com regras de negócio aplicadas.
        </p>
        {loadError && (
          <p className="load-error" role="alert">
            {loadError}
          </p>
        )}
      </header>

      <PeopleSection
        people={people}
        personForm={personForm}
        errors={personErrors}
        editingPersonId={editingPersonId}
        onNameChange={updateName}
        onAgeChange={updateAge}
        onSubmit={handleSavePerson}
        onCancelEdit={cancelEdit}
        onEdit={startEdit}
        onDelete={handleDeletePerson}
      />

      <CategoriesSection
        categories={categories}
        categoryForm={categoryForm}
        errors={categoryErrors}
        onDescriptionChange={updateDescription}
        onPurposeChange={updatePurpose}
        onSubmit={handleSaveCategory}
        formatCategoryPurpose={formatCategoryPurpose}
      />

      <TransactionsSection
        transactions={transactions}
        people={people}
        availableCategories={availableCategories}
        form={transactionForm}
        errors={transactionErrors}
        onDescriptionChange={updateTransactionDescription}
        onValueChange={updateTransactionValue}
        onTypeChange={updateTransactionType}
        onPersonChange={updatePersonId}
        onCategoryChange={updateCategoryId}
        onSubmit={handleSaveTransaction}
        isTypeDisabled={
          people.find(
            (person) =>
              person.id === Number(transactionForm.personId) && person.age < 18
          ) !== undefined
        }
        formatCategoryPurpose={formatCategoryPurpose}
        formatTransactionType={formatTransactionType}
        formatMoney={formatMoney}
      />

      <PeopleTotalsSection report={peopleTotals} formatMoney={formatMoney} />
      <CategoryTotalsSection report={categoryTotals} formatMoney={formatMoney} />
    </div>
  )
}

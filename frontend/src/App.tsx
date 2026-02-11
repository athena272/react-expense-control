import { useEffect, useMemo, useState } from 'react'
import {
  createCategory,
  createPerson,
  createTransaction,
  deletePerson,
  getCategories,
  getCategoryTotals,
  getPeople,
  getPeopleTotals,
  getTransactions,
  updatePerson,
} from './api'
import CategoriesSection from '@components/sections/CategoriesSection'
import CategoryTotalsSection from '@components/sections/CategoryTotalsSection'
import PeopleSection from '@components/sections/PeopleSection'
import PeopleTotalsSection from '@components/sections/PeopleTotalsSection'
import TransactionsSection from '@components/sections/TransactionsSection'
import { useCategoryForm } from './hooks/useCategoryForm'
import { usePeopleForm } from './hooks/usePeopleForm'
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

  useEffect(() => {
    void loadAll()
  }, [])

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

  async function loadAll() {
    try {
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
      setPersonErrors((prev) => ({ ...prev, form: (error as Error).message }))
    }
  }

  async function handleSavePerson() {
    try {
      const ageNumber = Number(personForm.age)
      const errors: { name?: string; age?: string } = {}

      if (!personForm.name.trim()) {
        errors.name = 'Nome é obrigatório.'
      }

      if (Number.isNaN(ageNumber)) {
        errors.age = 'Idade é obrigatória.'
      }

      if (Object.keys(errors).length > 0) {
        setPersonErrors(errors)
        return
      }

      if (editingPersonId) {
        await updatePerson(editingPersonId, personForm.name, ageNumber)
      } else {
        await createPerson(personForm.name, ageNumber)
      }

      setPersonForm({ name: '', age: '' })
      setEditingPersonId(null)
      await loadAll()
      setPersonErrors({})
    } catch (error) {
      setPersonErrors((prev) => ({ ...prev, form: (error as Error).message }))
    }
  }

  async function handleDeletePerson(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta pessoa?')) {
      return
    }

    try {
      await deletePerson(id)
      await loadAll()
      setPersonErrors({})
    } catch (error) {
      setPersonErrors((prev) => ({ ...prev, form: (error as Error).message }))
    }
  }

  async function handleSaveCategory() {
    try {
      if (!categoryForm.description.trim()) {
        setCategoryErrors({ description: 'Descrição é obrigatória.' })
        return
      }

      await createCategory(categoryForm.description, categoryForm.purpose)
      resetCategoryForm()
      await loadAll()
      setCategoryErrors({})
    } catch (error) {
      setCategoryErrors((prev) => ({ ...prev, form: (error as Error).message }))
    }
  }

  async function handleSaveTransaction() {
    try {
      const valueNumber = Number(transactionForm.value)
      const errors: {
        description?: string
        value?: string
        personId?: string
        categoryId?: string
      } = {}

      if (!transactionForm.description.trim()) {
        errors.description = 'Descrição é obrigatória.'
      }

      if (Number.isNaN(valueNumber)) {
        errors.value = 'Valor é obrigatório.'
      } else if (valueNumber <= 0) {
        errors.value = 'Valor deve ser positivo.'
      }

      const categoryId = Number(transactionForm.categoryId)
      const personId = Number(transactionForm.personId)

      if (!categoryId || !personId) {
        if (!personId) {
          errors.personId = 'Selecione uma pessoa.'
        }
        if (!categoryId) {
          errors.categoryId = 'Selecione uma categoria.'
        }
      }

      if (Object.keys(errors).length > 0) {
        setTransactionErrors(errors)
        return
      }

      await createTransaction(
        transactionForm.description,
        valueNumber,
        transactionForm.type,
        categoryId,
        personId
      )
      resetTransactionForm()
      await loadAll()
      setTransactionErrors({})
    } catch (error) {
      setTransactionErrors((prev) => ({ ...prev, form: (error as Error).message }))
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Controle de Gastos Residenciais</h1>
        <p>
          Cadastros e relatórios com regras de negócio aplicadas.
        </p>
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

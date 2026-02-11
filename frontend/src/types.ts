export type TransactionType = 'Expense' | 'Income'

export type CategoryPurpose = 'Expense' | 'Income' | 'Both'

export interface Person {
  id: number
  name: string
  age: number
}

export interface Category {
  id: number
  description: string
  purpose: CategoryPurpose
}

export interface Transaction {
  id: number
  description: string
  value: number
  type: TransactionType
  categoryId: number
  categoryDescription: string
  personId: number
  personName: string
}

export interface PersonTotals {
  personId: number
  personName: string
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface CategoryTotals {
  categoryId: number
  categoryDescription: string
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface TotalsSummary {
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface PeopleTotalsReport {
  items: PersonTotals[]
  summary: TotalsSummary
}

export interface CategoryTotalsReport {
  items: CategoryTotals[]
  summary: TotalsSummary
}

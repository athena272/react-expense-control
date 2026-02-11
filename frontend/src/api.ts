import type {
  Category,
  CategoryTotalsReport,
  PeopleTotalsReport,
  Person,
  Transaction,
} from './types'
import type { CategoryPurpose, TransactionType } from './types'

// Porta padrão do Kestrel em execução local (http://localhost:5122).
const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Erro ao comunicar com a API.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function getPeople() {
  return request<Person[]>('/api/people')
}

export function createPerson(name: string, age: number) {
  return request<Person>('/api/people', {
    method: 'POST',
    body: JSON.stringify({ name, age }),
  })
}

export function updatePerson(id: number, name: string, age: number) {
  return request<Person>(`/api/people/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, age }),
  })
}

export function deletePerson(id: number) {
  return request<void>(`/api/people/${id}`, { method: 'DELETE' })
}

export function getCategories() {
  return request<Category[]>('/api/categories')
}

export function createCategory(description: string, purpose: CategoryPurpose) {
  return request<Category>('/api/categories', {
    method: 'POST',
    body: JSON.stringify({ description, purpose }),
  })
}

export function getTransactions() {
  return request<Transaction[]>('/api/transactions')
}

export function createTransaction(
  description: string,
  value: number,
  type: TransactionType,
  categoryId: number,
  personId: number
) {
  return request<Transaction>('/api/transactions', {
    method: 'POST',
    body: JSON.stringify({ description, value, type, categoryId, personId }),
  })
}

export function getPeopleTotals() {
  return request<PeopleTotalsReport>('/api/reports/people-totals')
}

export function getCategoryTotals() {
  return request<CategoryTotalsReport>('/api/reports/category-totals')
}

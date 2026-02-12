import type { TransactionType } from '../types'

export type TransactionFormErrors = {
  description?: string
  value?: string
  type?: string
  personId?: string
  categoryId?: string
}

export type TransactionForm = {
  description: string
  value: string
  type: TransactionType | ''
  categoryId: string
  personId: string
}

export function validateTransactionForm(
  form: TransactionForm
): TransactionFormErrors {
  const errors: TransactionFormErrors = {}
  const valueNumber = Number(form.value)
  const categoryId = Number(form.categoryId)
  const personId = Number(form.personId)

  if (!form.description.trim()) {
    errors.description = 'Descrição é obrigatória.'
  }

  if (Number.isNaN(valueNumber)) {
    errors.value = 'Valor é obrigatório.'
  } else if (valueNumber <= 0) {
    errors.value = 'Valor deve ser positivo.'
  }

  if (!form.type) {
    errors.type = 'Selecione um tipo.'
  }

  if (!personId) {
    errors.personId = 'Selecione uma pessoa.'
  }

  if (!categoryId) {
    errors.categoryId = 'Selecione uma categoria.'
  }

  return errors
}

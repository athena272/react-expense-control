import type { CategoryPurpose } from '../types'

export type CategoryFormErrors = {
  description?: string
  purpose?: string
}

export type CategoryForm = {
  description: string
  purpose: CategoryPurpose | ''
}

export function validateCategoryForm(form: CategoryForm): CategoryFormErrors {
  const errors: CategoryFormErrors = {}

  if (!form.description.trim()) {
    errors.description = 'Descrição é obrigatória.'
  }

  if (!form.purpose) {
    errors.purpose = 'Selecione uma finalidade.'
  }

  return errors
}

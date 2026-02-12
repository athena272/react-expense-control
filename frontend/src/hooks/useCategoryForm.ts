import { useState } from 'react'
import type { CategoryPurpose } from '../types'

type CategoryErrors = {
  description?: string
  purpose?: string
  form?: string
}

export function useCategoryForm() {
  const [categoryForm, setCategoryForm] = useState({
    description: '',
    purpose: '' as CategoryPurpose,
  })
  const [errors, setErrors] = useState<CategoryErrors>({})

  const updateDescription = (value: string) => {
    setCategoryForm((prev) => ({ ...prev, description: value }))
    if (errors.description || errors.form) {
      setErrors((prev) => ({ ...prev, description: undefined, form: undefined }))
    }
  }

  const updatePurpose = (value: CategoryPurpose) => {
    setCategoryForm((prev) => ({ ...prev, purpose: value }))
    if (errors.form || errors.purpose) {
      setErrors((prev) => ({ ...prev, form: undefined, purpose: undefined }))
    }
  }

  const reset = () => {
    setCategoryForm({ description: '', purpose: '' as CategoryPurpose })
    setErrors({})
  }

  return {
    categoryForm,
    errors,
    setErrors,
    updateDescription,
    updatePurpose,
    reset,
  }
}

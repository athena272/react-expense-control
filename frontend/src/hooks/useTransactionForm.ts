import { useState } from 'react'
import type { TransactionType } from '../types'

type TransactionErrors = {
  description?: string
  value?: string
  type?: string
  personId?: string
  categoryId?: string
  form?: string
}

export function useTransactionForm() {
  const [form, setForm] = useState({
    description: '',
    value: '',
    type: '' as TransactionType,
    categoryId: '',
    personId: '',
  })
  const [errors, setErrors] = useState<TransactionErrors>({})

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateDescription = (value: string) => {
    updateField('description', value)
    if (errors.description || errors.form) {
      setErrors((prev) => ({ ...prev, description: undefined, form: undefined }))
    }
  }

  const updateValue = (value: string) => {
    updateField('value', value)
    if (errors.value || errors.form) {
      setErrors((prev) => ({ ...prev, value: undefined, form: undefined }))
    }
  }

  const updateType = (value: TransactionType) => {
    setForm((prev) => ({ ...prev, type: value }))
    if (errors.form || errors.type) {
      setErrors((prev) => ({ ...prev, form: undefined, type: undefined }))
    }
  }

  const updatePersonId = (value: string) => {
    updateField('personId', value)
    if (errors.personId || errors.form) {
      setErrors((prev) => ({ ...prev, personId: undefined, form: undefined }))
    }
  }

  const updateCategoryId = (value: string) => {
    updateField('categoryId', value)
    if (errors.categoryId || errors.form) {
      setErrors((prev) => ({ ...prev, categoryId: undefined, form: undefined }))
    }
  }

  const reset = () => {
    setForm({
      description: '',
      value: '',
      type: '' as TransactionType,
      categoryId: '',
      personId: '',
    })
    setErrors({})
  }

  return {
    form,
    setForm,
    errors,
    setErrors,
    updateDescription,
    updateValue,
    updateType,
    updatePersonId,
    updateCategoryId,
    reset,
  }
}

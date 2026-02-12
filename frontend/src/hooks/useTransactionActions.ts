import { useCallback } from 'react'
import { createTransaction } from '../api'
import type { TransactionType } from '../types'
import { validateTransactionForm } from '../validators/transactionValidator'

type TransactionErrors = {
  description?: string
  value?: string
  type?: string
  personId?: string
  categoryId?: string
  form?: string
}

type UseTransactionActionsParams = {
  transactionForm: {
    description: string
    value: string
    type: TransactionType
    categoryId: string
    personId: string
  }
  reset: () => void
  setErrors: (errors: TransactionErrors | ((prev: TransactionErrors) => TransactionErrors)) => void
  loadAll: () => Promise<void>
}

export function useTransactionActions({
  transactionForm,
  reset,
  setErrors,
  loadAll,
}: UseTransactionActionsParams) {
  const handleSave = useCallback(async () => {
    try {
      const validationErrors = validateTransactionForm(transactionForm)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      const valueNumber = Number(transactionForm.value)
      const categoryId = Number(transactionForm.categoryId)
      const personId = Number(transactionForm.personId)

      await createTransaction(
        transactionForm.description,
        valueNumber,
        transactionForm.type,
        categoryId,
        personId
      )
      reset()
      await loadAll()
      setErrors({})
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: (error as Error).message }))
    }
  }, [transactionForm, reset, setErrors, loadAll])

  return { handleSave }
}

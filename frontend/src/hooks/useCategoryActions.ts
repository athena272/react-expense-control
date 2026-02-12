import { useCallback } from 'react'
import { createCategory } from '../api'
import { validateCategoryForm } from '../validators/categoryValidator'

type CategoryErrors = {
  description?: string
  purpose?: string
  form?: string
}

type UseCategoryActionsParams = {
  categoryForm: { description: string; purpose: string }
  reset: () => void
  setErrors: (errors: CategoryErrors | ((prev: CategoryErrors) => CategoryErrors)) => void
  loadAll: () => Promise<void>
}

export function useCategoryActions({
  categoryForm,
  reset,
  setErrors,
  loadAll,
}: UseCategoryActionsParams) {
  const handleSave = useCallback(async () => {
    try {
      const validationErrors = validateCategoryForm(categoryForm)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      await createCategory(
        categoryForm.description,
        categoryForm.purpose as 'Expense' | 'Income' | 'Both'
      )
      reset()
      await loadAll()
      setErrors({})
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: (error as Error).message }))
    }
  }, [categoryForm, reset, setErrors, loadAll])

  return { handleSave }
}

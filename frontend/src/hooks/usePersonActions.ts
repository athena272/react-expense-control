import { useCallback } from 'react'
import { createPerson, updatePerson, deletePerson } from '../api'
import { validatePersonForm } from '../validators/personValidator'

type PeopleErrors = {
  name?: string
  age?: string
  form?: string
}

type UsePersonActionsParams = {
  personForm: { name: string; age: string }
  setPersonForm: (form: { name: string; age: string }) => void
  editingPersonId: number | null
  setEditingPersonId: (id: number | null) => void
  setErrors: (errors: PeopleErrors | ((prev: PeopleErrors) => PeopleErrors)) => void
  loadAll: () => Promise<void>
}

export function usePersonActions({
  personForm,
  setPersonForm,
  editingPersonId,
  setEditingPersonId,
  setErrors,
  loadAll,
}: UsePersonActionsParams) {
  const handleSave = useCallback(async () => {
    try {
      const validationErrors = validatePersonForm(personForm)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      const ageNumber = Number(personForm.age)
      if (editingPersonId) {
        await updatePerson(editingPersonId, personForm.name, ageNumber)
      } else {
        await createPerson(personForm.name, ageNumber)
      }

      setPersonForm({ name: '', age: '' })
      setEditingPersonId(null)
      await loadAll()
      setErrors({})
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: (error as Error).message }))
    }
  }, [
    personForm,
    editingPersonId,
    setPersonForm,
    setEditingPersonId,
    setErrors,
    loadAll,
  ])

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm('Tem certeza que deseja excluir esta pessoa?')) {
        return
      }

      try {
        await deletePerson(id)
        await loadAll()
        setErrors({})
      } catch (error) {
        setErrors((prev) => ({ ...prev, form: (error as Error).message }))
      }
    },
    [setErrors, loadAll]
  )

  return { handleSave, handleDelete }
}

import { useState } from 'react'
import type { Person } from '../types'

type PeopleErrors = {
  name?: string
  age?: string
  form?: string
}

export function usePeopleForm() {
  const [personForm, setPersonForm] = useState({ name: '', age: '' })
  const [editingPersonId, setEditingPersonId] = useState<number | null>(null)
  const [errors, setErrors] = useState<PeopleErrors>({})

  const updateName = (value: string) => {
    setPersonForm((prev) => ({ ...prev, name: value }))
    if (errors.name || errors.form) {
      setErrors((prev) => ({ ...prev, name: undefined, form: undefined }))
    }
  }

  const updateAge = (value: string) => {
    setPersonForm((prev) => ({ ...prev, age: value }))
    if (errors.age || errors.form) {
      setErrors((prev) => ({ ...prev, age: undefined, form: undefined }))
    }
  }

  const startEdit = (person: Person) => {
    setPersonForm({ name: person.name, age: String(person.age) })
    setEditingPersonId(person.id)
  }

  const cancelEdit = () => {
    setEditingPersonId(null)
    setPersonForm({ name: '', age: '' })
    setErrors({})
  }

  return {
    personForm,
    setPersonForm,
    editingPersonId,
    setEditingPersonId,
    errors,
    setErrors,
    updateName,
    updateAge,
    startEdit,
    cancelEdit,
  }
}

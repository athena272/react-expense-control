export type PersonFormErrors = {
  name?: string
  age?: string
}

export type PersonForm = {
  name: string
  age: string
}

export function validatePersonForm(form: PersonForm): PersonFormErrors {
  const errors: PersonFormErrors = {}
  const ageNumber = Number(form.age)

  if (!form.name.trim()) {
    errors.name = 'Nome é obrigatório.'
  }

  if (Number.isNaN(ageNumber)) {
    errors.age = 'Idade é obrigatória.'
  }

  return errors
}

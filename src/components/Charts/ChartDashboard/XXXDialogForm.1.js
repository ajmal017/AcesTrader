// DialogForm.js

import React from 'react'
import { useForm } from 'form-hooks'

const DialogForm = () => {
  const { errors, touched, values, handleBlur, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      name: 'Bruce',
      email: 'b@g.com',
    },
    onSubmit: (values) => fetch(/* values */),
    // onSubmit: (values) => render(/* values */),
    validate: (values) => ({
      ...(!values.name.length ? { name: 'Requires a name' } : {}),
      ...(!values.email.length ? { email: 'Requires an email' } : {}),
    }),
  })

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" value={values.name} onChange={handleChange} onBlur={handleBlur} />
      {touched['name'] && errors['name']}
      <input name="email" type="text" value={values.email} onChange={handleChange} onBlur={handleBlur} />
      {touched['email'] && errors['email']}
      <button type="submit" disabled={isSubmitting}>
        submit
      </button>
    </form>
  )
}

export default DialogForm

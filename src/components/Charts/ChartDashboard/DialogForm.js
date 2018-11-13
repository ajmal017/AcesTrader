// DialogForm.js

import React from 'react'
import { Formik } from 'formik'
// import './styles.css'

// const DialogForm = (formValues, listGroup, exitCallback) => {
const DialogForm = (props) => {
  return (
    <>
      <Formik
        // initialValues={{ email: 'b@g.com', password: '1234' }}
        initialValues={props.formValues}
        validate={(values) => {
          let errors = {}
          if (!values.email) {
            errors.email = 'Required'
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address'
          }
          return errors
        }}
        onSubmit={(values) => {
          props.exitCallback(values)
          // onSubmit={(values, { setSubmitting }) => {
          //   setTimeout(() => {
          //     alert(JSON.stringify(values, null, 2))
          //     setSubmitting(false)
          //   }, 400)
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            {/* <input type="email" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
        {errors.email && touched.email && errors.email}
        <input type="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
        {errors.password && touched.password && errors.password} */}

            <label htmlFor="watched">Watched</label>
            <input type="text" name="watched" value={values.watched} onChange={handleChange} onBlur={handleBlur} />
            <br />
            <label htmlFor="watchedPrice">WatchedPrice</label>
            <input type="text" name="watchedPrice" value={values.watchedPrice} onChange={handleChange} onBlur={handleBlur} />
            <br />
            {props.listGroup === 'positions' ? (
              <span>
                <label htmlFor="entered">Entered</label>
                <input type="text" name="entered" value={values.entered} onChange={handleChange} onBlur={handleBlur} />
                <br />
                <label htmlFor="enteredPrice">EnteredPrice</label>
                <input type="text" name="enteredPrice" value={values.enteredPrice} onChange={handleChange} onBlur={handleBlur} />
                <br />
                <label htmlFor="filledQuantity">FilledQuantity</label>
                <input type="text" name="filledQuantity" value={values.filledQuantity} onChange={handleChange} onBlur={handleBlur} />
                <br />
              </span>
            ) : null}
            <br />
            {/* ================================================ */}
            <label htmlFor="session">Session</label>
            <input type="text" name="session" value={values.session} onChange={handleChange} onBlur={handleBlur} />
            <br />
            <label htmlFor="instruction">Instruction</label>
            <input type="text" name="instruction" value={values.instruction} onChange={handleChange} onBlur={handleBlur} />
            <br />
            <label htmlFor="quantity">Quantity</label>
            <input type="text" name="quantity" value={values.quantity} onChange={handleChange} onBlur={handleBlur} />
            <br />
            <label htmlFor="quantityType">QuantityType</label>
            <input type="text" name="quantityType" value={values.quantityType} onChange={handleChange} onBlur={handleBlur} />
            <br />
            <label htmlFor="orderType">OrderType</label>
            <input type="text" name="orderType" value={values.orderType} onChange={handleChange} onBlur={handleBlur} />
            <br />
            <label htmlFor="duration">Duration</label>
            <input type="text" name="duration" value={values.duration} onChange={handleChange} onBlur={handleBlur} />
            <br />
            <br />

            <button type="submit" disabled={isSubmitting} className={'dialog-button-submit'}>
              Submit
            </button>
          </form>
        )}
      </Formik>
    </>
  )
}

export default DialogForm

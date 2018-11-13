// DialogForm.js

import React, { Component } from 'react'
import dialogPolyfill from 'dialog-polyfill'
import './styles.css'

class DialogForm extends Component {
  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.dialogDashboardParams = null
    this.hash = props.hash
    this.symbol = props.symbol
    this.listGroup = props.listGroup
    this.exitCallback = props.exitCallback
    this.state = props.formValues
  }

  componentDidMount() {
    this.dialogDashboardParams = document.getElementById('dashboard-params' + this.hash)
    dialogPolyfill.registerDialog(this.dialogDashboardParams) // Now dialog acts like a native <dialog>.
  }

  componentDidUpdate(prevProps) {
    if (this.props.showDialog !== prevProps.showDialog) {
      if (this.props.showDialog) {
        this.dialogDashboardParams.showModal()
      } else {
        this.dialogDashboardParams.close()
      }
    }
    if (this.props.formValues !== prevProps.formValues) {
      this.setState(this.props.formValues)
    }
  }

  handleInputChange(event) {
    const target = event.target
    const name = target.name
    const value = target.value
    this.setState({
      [name]: value,
    })
  }

  render() {
    return (
      <dialog id={'dashboard-params' + this.hash} className={'dashboard-dialog-form'}>
        <span className={'dialog-symbol'}> {this.symbol} - Make Your Changes Below.</span>
        <br />
        <br />
        <form method="dialog">
          <label htmlFor="watched">Watched</label>
          <input type="text" name="watched" value={this.state.watched} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="watchedPrice">WatchedPrice</label>
          <input type="text" name="watchedPrice" value={this.state.watchedPrice} onChange={this.handleInputChange} />
          <br />
          {this.listGroup === 'positions' ? (
            <span>
              <label htmlFor="entered">Entered</label>
              <input type="text" name="entered" value={this.state.entered} onChange={this.handleInputChange} />
              <br />
              <label htmlFor="enteredPrice">EnteredPrice</label>
              <input type="text" name="enteredPrice" value={this.state.enteredPrice} onChange={this.handleInputChange} />
              <br />
              <label htmlFor="filledQuantity">FilledQuantity</label>
              <input type="text" name="filledQuantity" value={this.state.filledQuantity} onChange={this.handleInputChange} />
              <br />
            </span>
          ) : null}
          <br />
          {/* ================================================ */}
          <label htmlFor="session">Session</label>
          <input type="text" name="session" value={this.state.session} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="instruction">Instruction</label>
          <input type="text" name="instruction" value={this.state.instruction} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="quantity">Quantity</label>
          <input type="text" name="quantity" value={this.state.quantity} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="quantityType">QuantityType</label>
          <input type="text" name="quantityType" value={this.state.quantityType} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="orderType">OrderType</label>
          <input type="text" name="orderType" value={this.state.orderType} onChange={this.handleInputChange} />
          <br />
          <label htmlFor="duration">Duration</label>
          <input type="text" name="duration" value={this.state.duration} onChange={this.handleInputChange} />
          <br />
          <br />
          {/* ================================================ */}
          <button
            type="submit"
            onClick={() => {
              this.exitCallback(null)
              // this.dialogDashboardParams.close()
            }}>
            Cancel
          </button>
          &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            type="submit"
            onClick={() => {
              this.exitCallback(this.state)
              // this.dialogDashboardParams.close()
            }}>
            Save
          </button>
        </form>
      </dialog>
    )
  }
}

//   return (
//     <>
//       <Formik
//         // initialValues={{ email: 'b@g.com', password: '1234' }}
//         initialValues={props.formValues}
//         validate={(values) => {
//           let errors = {}
//           if (!values.email) {
//             errors.email = 'Required'
//           } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
//             errors.email = 'Invalid email address'
//           }
//           return errors
//         }}
//         onSubmit={(values) => {
//           props.exitCallback(values)
//           // onSubmit={(values, { setSubmitting }) => {
//           //   setTimeout(() => {
//           //     alert(JSON.stringify(values, null, 2))
//           //     setSubmitting(false)
//           //   }, 400)
//         }}>
//         {({
//           values,
//           errors,
//           touched,
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           isSubmitting,
//           /* and other goodies */
//         }) => (
//           <form onSubmit={handleSubmit}>
//             {/* <input type="email" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
//         {errors.email && touched.email && errors.email}
//         <input type="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
//         {errors.password && touched.password && errors.password} */}

//             <label htmlFor="watched">Watched</label>
//             <input type="text" name="watched" value={values.watched} onChange={handleChange} onBlur={handleBlur} />
//             <br />
//             <label htmlFor="watchedPrice">WatchedPrice</label>
//             <input type="text" name="watchedPrice" value={values.watchedPrice} onChange={handleChange} onBlur={handleBlur} />
//             <br />
//             {props.listGroup === 'positions' ? (
//               <span>
//                 <label htmlFor="entered">Entered</label>
//                 <input type="text" name="entered" value={values.entered} onChange={handleChange} onBlur={handleBlur} />
//                 <br />
//                 <label htmlFor="enteredPrice">EnteredPrice</label>
//                 <input type="text" name="enteredPrice" value={values.enteredPrice} onChange={handleChange} onBlur={handleBlur} />
//                 <br />
//                 <label htmlFor="filledQuantity">FilledQuantity</label>
//                 <input type="text" name="filledQuantity" value={values.filledQuantity} onChange={handleChange} onBlur={handleBlur} />
//                 <br />
//               </span>
//             ) : null}
//             <br />
//             {/* ================================================ */}
//             <label htmlFor="session">Session</label>
//             <input type="text" name="session" value={values.session} onChange={handleChange} onBlur={handleBlur} />
//             <br />
//             <label htmlFor="instruction">Instruction</label>
//             <input type="text" name="instruction" value={values.instruction} onChange={handleChange} onBlur={handleBlur} />
//             <br />
//             <label htmlFor="quantity">Quantity</label>
//             <input type="text" name="quantity" value={values.quantity} onChange={handleChange} onBlur={handleBlur} />
//             <br />
//             <label htmlFor="quantityType">QuantityType</label>
//             <input type="text" name="quantityType" value={values.quantityType} onChange={handleChange} onBlur={handleBlur} />
//             <br />
//             <label htmlFor="orderType">OrderType</label>
//             <input type="text" name="orderType" value={values.orderType} onChange={handleChange} onBlur={handleBlur} />
//             <br />
//             <label htmlFor="duration">Duration</label>
//             <input type="text" name="duration" value={values.duration} onChange={handleChange} onBlur={handleBlur} />
//             <br />
//             <br />

//             <button type="submit" disabled={isSubmitting} className={'dialog-button-submit'}>
//               Submit
//             </button>
//           </form>
//         )}
//       </Formik>
//     </>
//   )
// }

export default DialogForm

// Checkbox/index.js
// Tutorial: http://react.tips/checkboxes-in-react/

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Checkbox extends Component {
  state = {
    isChecked: false,
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props

    //get the next value now, as setState is async and the
    // resulting switched value will not be available immediately after.
    handleCheckboxChange(!this.state.isChecked, label)

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked,
    }))
  }

  render() {
    const { label } = this.props
    const { isChecked } = this.state

    return (
      <div className="checkbox">
        <label>
          <input type="checkbox" value={label} checked={isChecked} onChange={this.toggleCheckboxChange} />

          {label}
        </label>
      </div>
    )
  }
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
}

export default Checkbox

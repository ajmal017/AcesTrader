// PlanToolbar

import React from 'react'
import { objectQuery } from '../../../../lib/navigateBreadCrumbs.js'
import * as Icons from '../../../../lib/IconsLookup.js'
import getToolbarList from './getToolbarList.js'

const PlanToolbar = function(props) {
  'use-strict'

  const toolbarKeys = {
    NEW_ACCOUNT: 'new-account',
    NEW_ANNUITY: 'new-annuity',
    NEW_INSURANCE: 'new-insurance',
    NEW_IRA: 'new-irs',
    NEW_PENSION: 'new-pension',
    NEW_PERSON: 'new-person',
    NEW_BENEFICIARY: 'new-beneficiary',
    NEW_TRANSFER: 'new-transfer',
    NEW_DEPOSIT: 'new-deposit',
    NEW_PAYOUT: 'new-payout',
    NEW_COST: 'new-cost',
    NEW_PARAMETERCHANGE: 'new-parameterchange',
    EDIT_PARAMETERS: 'edit-parameters',
    EDIT_PLAN_DESCRIPTION: 'edit-plan-description',
    EDIT_OBJECT: 'edit-object',
    DELETE_OBJECT: 'delete-object',
    ADD_DEPOSIT: 'add-deposit',
    ADD_WITHDRAWAL: 'add-withdrawal',
    ADD_TRANSFER: 'add-transfer',
    ADD_COST: 'add-cost',
    ADD_BENEFICIARY: 'add-beneficiary',
    ADD_PARAMETER_CHANGE: 'add-parameter-change',
    ADD_DEPOSIT_DISABLED: 'add-deposit-disabled',
    ADD_WITHDRAWAL_DISABLED: 'add-withdrawal-disabled',
    ADD_TRANSFER_DISABLED: 'add-transfer-disabled',
    ADD_COST_DISABLED: 'add-cost-disabled',
    ADD_NEW_PARAMETER_CHANGE: 'add-new-parameter-change', //for global plan w/long label
  }

  const getButtonParameters = function(toolbarListItem) {
    let params = { hidden: false, disabled: false, left: false } //defaults
    switch (toolbarListItem) {
      case toolbarKeys.NEW_ACCOUNT:
        params.label = 'Add New Account'
        params.title = 'Add a new tax normal account to the plan'
        params.icon = 'addaccount'
        params.left = true
        break
      case toolbarKeys.NEW_ANNUITY:
        params.label = 'Add New Annuity'
        params.title = 'Add a new annuity account to the plan'
        params.icon = 'addaccount'
        params.left = true
        break
      case toolbarKeys.NEW_INSURANCE:
        params.label = 'Add New Insurance Policy'
        params.title = 'Add a new insurance policy to the plan'
        params.icon = 'addaccount'
        params.left = true
        break
      case toolbarKeys.NEW_IRA:
        params.label = 'Add New IRA or Other Plan'
        params.title = 'Add a new IRA or other tax deferred plan'
        params.icon = 'addaccount'
        params.left = true
        break
      case toolbarKeys.NEW_PENSION:
        params.label = 'Add New Pension or Other Income'
        params.title = 'Add a new pension or some other retirement income'
        params.icon = 'addaccount'
        params.left = true
        break
      case toolbarKeys.NEW_PERSON:
        params.label = 'Add New Person'
        params.title = 'Add a new person to be considered in the plan'
        params.icon = 'addperson'
        params.left = true
        break
      case toolbarKeys.NEW_BENEFICIARY:
        params.label = 'Add New Beneficiary Instruction'
        params.title = 'Add a new beneficiary instruction to the plan'
        params.icon = 'beneficiary'
        params.left = true
        break
      case toolbarKeys.NEW_TRANSFER:
        params.label = 'Add New Transfer Instruction'
        params.title = 'Add a new transfer instruction to the plan'
        params.icon = 'transfer'
        params.left = true
        break
      case toolbarKeys.NEW_DEPOSIT:
        params.label = 'Add New Deposit Instruction'
        params.title = 'Add a new deposit instruction to the plan'
        params.icon = 'deposit'
        params.left = true
        break
      case toolbarKeys.NEW_PAYOUT:
        params.label = 'Add New Withdrawal Instruction'
        params.title = 'Add a new withdrawal instruction to the plan'
        params.icon = 'withdraw'
        params.left = true
        break
      case toolbarKeys.NEW_COST:
        params.label = 'Add New Cost Instruction'
        params.title = 'Add a new cost instruction to the plan'
        params.icon = 'cost'
        params.left = true
        break
      case toolbarKeys.NEW_PARAMETERCHANGE:
        params.label = 'Add New Parameter Change Instruction'
        params.title = 'Add a new parameter change instruction to the plan'
        params.icon = 'parameterchange'
        params.left = true
        break
      case toolbarKeys.EDIT_PARAMETERS:
        params.label = 'Edit Global Plan Parameters'
        params.title = 'Edit the global plan parameters that apply to all assets'
        params.icon = 'edit'
        params.left = true
        break
      case toolbarKeys.EDIT_PLAN_DESCRIPTION:
        params.label = "Edit The Plan's Description"
        params.title = "Edit the plan's summary description"
        params.icon = 'edit'
        params.left = true
        break
      case toolbarKeys.EDIT_OBJECT:
        params.label = 'Edit'
        params.title = 'Edit this item'
        params.icon = 'edit'
        break
      case toolbarKeys.DELETE_OBJECT:
        params.label = 'Delete'
        params.title = 'Delete this item'
        params.icon = 'deleteitem'
        break
      case toolbarKeys.ADD_DEPOSIT:
        params.label = 'Deposit'
        params.title = 'Add a deposit instruction'
        params.icon = 'deposit'
        break
      case toolbarKeys.ADD_WITHDRAWAL:
        params.label = 'Wthdrw'
        params.title = 'Add a withdrawal instruction'
        params.icon = 'withdraw'
        break
      case toolbarKeys.ADD_TRANSFER:
        params.label = 'Xfer'
        params.title = 'Add a tranfer instruction'
        params.icon = 'transfer'
        break
      case toolbarKeys.ADD_COST:
        params.label = 'Cost'
        params.title = 'Add a cost instruction'
        params.icon = 'cost'
        break
      case toolbarKeys.ADD_BENEFICIARY:
        params.label = 'Bnfcry'
        params.title = 'Add a beneficiary instruction'
        params.icon = 'beneficiary'
        break
      case toolbarKeys.ADD_PARAMETER_CHANGE:
        params.label = 'Parchg'
        params.title = 'Add a parameter change instruction'
        params.icon = 'parameterchange'
        break
      case toolbarKeys.ADD_DEPOSIT_DISABLED:
        params.label = 'Deposit'
        params.title = 'Add a deposit instruction'
        params.icon = 'deposit'
        params.disabled = true
        break
      case toolbarKeys.ADD_WITHDRAWAL_DISABLED:
        params.label = 'Wthdrw'
        params.title = 'Add a withdrawal instruction'
        params.icon = 'withdraw'
        params.disabled = true
        break
      case toolbarKeys.ADD_TRANSFER_DISABLED:
        params.label = 'Xfer'
        params.title = 'Add a tranfer instruction'
        params.icon = 'transfer'
        params.disabled = true
        break
      case toolbarKeys.ADD_COST_DISABLED:
        params.label = 'Cost'
        params.title = 'Add a cost instruction'
        params.icon = 'cost'
        params.disabled = true
        break
      case toolbarKeys.ADD_NEW_PARAMETER_CHANGE: //for global plan w/long label
        params.label = 'Add New Parameter Change Instruction'
        params.title = 'Add a new parameter change instruction to the plan'
        params.icon = 'parameterchange'
        params.left = true
        break
      default:
        if (process.env.NODE_ENV === 'development') {
          debugger
        } //developer testing
    }
    return params
  }

  const handleClick = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    const flag = evt.target.id
    props.handleClick(evt, flag)
  }

  const dataStore = props.dataStore
  const breadcrumbs = dataStore.selectedTreeNode
  const selectedObject = objectQuery(breadcrumbs, dataStore.planObject)
  const toolbarList = getToolbarList(toolbarKeys, selectedObject)
  // debugger

  // Create an array of html items, one for each button icon
  // Each button icon is positioned in its assigned grid area.
  let menuButtonsIcons = toolbarList.map((element, index) => {
    let { icon, title, disabled, left } = getButtonParameters(element)

    let buttonIcon = icon
    let buttonTitle = title
    let buttonClass = disabled ? 'disabled' : ''
    let buttonJustify = left ? 'start' : 'center'
    let col = index + 1
    let divStyleIcon = {
      gridArea: `1 / ${col} / 2 / ${col + 1}`,
      padding: '0 8px',
      justifySelf: `${buttonJustify}`,
    }
    return (
      <div key={index} className={buttonClass} style={divStyleIcon} onClick={handleClick}>
        <img id={buttonIcon} onClick={handleClick} src={Icons[buttonIcon]} alt="" title={buttonTitle} width={28} />
      </div>
    )
  })

  // Create an array of html items, one for each button label
  // Each button label is positioned in its assigned grid area.
  let menuButtonsLabels = toolbarList.map((element, index) => {
    let { label, disabled } = getButtonParameters(element)
    let buttonLabel = label
    let buttonClass = disabled ? 'disabled' : ''
    let col = index + 1
    let divStyleLabel = {
      gridArea: `2 / ${col} / 3 / ${col + 1}`,
      padding: '0 4px',
    }
    return (
      <div key={index} className={buttonClass} style={divStyleLabel}>
        {buttonLabel}
      </div>
    )
  })

  // debugger
  return (
    <div className="grid-container">
      {menuButtonsIcons}
      {menuButtonsLabels}
    </div>
  )
}
export default PlanToolbar

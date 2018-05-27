// getToolbarList.js

var F = require('../../../../lib/fobj') //gets the static object of constants

export const getToolbarList = function(toolbarKeys, selectedObject) {
  'use-strict'
  // const toolbarKeys = props.toolbarKeys
  // const myObject = props.planObject
  let toolbarList = [] //array of key words for the toolbar buttons needed
  switch (selectedObject.objecttype) {
    case F.SUMMARY_ID:
      break
    case F.ANNUITY_ID:
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      toolbarList.push(toolbarKeys.ADD_DEPOSIT)
      toolbarList.push(toolbarKeys.ADD_WITHDRAWAL)
      toolbarList.push(toolbarKeys.ADD_TRANSFER)
      toolbarList.push(toolbarKeys.ADD_COST)
      toolbarList.push(toolbarKeys.ADD_BENEFICIARY)
      toolbarList.push(toolbarKeys.ADD_PARAMETER_CHANGE)
      break
    case F.ACCOUNT_ID:
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      toolbarList.push(toolbarKeys.ADD_DEPOSIT)
      toolbarList.push(toolbarKeys.ADD_WITHDRAWAL)
      toolbarList.push(toolbarKeys.ADD_TRANSFER)
      toolbarList.push(toolbarKeys.ADD_COST)
      toolbarList.push(toolbarKeys.ADD_BENEFICIARY)
      toolbarList.push(toolbarKeys.ADD_PARAMETER_CHANGE)
      break
    case F.INSURANCE_ID:
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      toolbarList.push(toolbarKeys.ADD_DEPOSIT)
      toolbarList.push(toolbarKeys.ADD_WITHDRAWAL)
      toolbarList.push(toolbarKeys.ADD_TRANSFER)
      toolbarList.push(toolbarKeys.ADD_COST)
      toolbarList.push(toolbarKeys.ADD_BENEFICIARY)
      toolbarList.push(toolbarKeys.ADD_PARAMETER_CHANGE)
      break
    case F.IRA_ID:
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      toolbarList.push(toolbarKeys.ADD_DEPOSIT)
      toolbarList.push(toolbarKeys.ADD_WITHDRAWAL)
      toolbarList.push(toolbarKeys.ADD_TRANSFER)
      toolbarList.push(toolbarKeys.ADD_COST_DISABLED)
      toolbarList.push(toolbarKeys.ADD_BENEFICIARY)
      toolbarList.push(toolbarKeys.ADD_PARAMETER_CHANGE)
      break
    case F.PENSION_ID:
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      toolbarList.push(toolbarKeys.ADD_DEPOSIT_DISABLED)
      toolbarList.push(toolbarKeys.ADD_WITHDRAWAL_DISABLED)
      toolbarList.push(toolbarKeys.ADD_TRANSFER_DISABLED)
      toolbarList.push(toolbarKeys.ADD_COST_DISABLED)
      toolbarList.push(toolbarKeys.ADD_BENEFICIARY)
      toolbarList.push(toolbarKeys.ADD_PARAMETER_CHANGE)
      break
    case F.PERSON_ID:
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      break
    case F.PARAMS_COLLECTION_ID:
      toolbarList.push(toolbarKeys.EDIT_PARAMETERS)
      break
    case F.PARAMS_ID:
      toolbarList.push(toolbarKeys.EDIT_PARAMETERS)
      toolbarList.push(toolbarKeys.ADD_NEW_PARAMETER_CHANGE)
      break
    case F.ALLPLANRESULTS_ID:
      break
    case F.MONTECARLORESULTS_ID:
      break
    case F.BENEFICIARY_ID:
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      break
    case F.TRANSFER_ID:
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      break
    case F.DEPOSIT_ID:
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      break
    case F.COST_ID: // F.PAYIN_ID
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      break
    case F.PAYOUT_ID: // F.WITHDRAWAL_ID
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      break
    case F.PARAMETERCHANGE_ID:
      toolbarList.push(toolbarKeys.EDIT_OBJECT)
      toolbarList.push(toolbarKeys.DELETE_OBJECT)
      break
    case F.ACCOUNT_COLLECTION_ID:
      toolbarList.push(toolbarKeys.NEW_ACCOUNT)
      break
    case F.ANNUITY_COLLECTION_ID:
      toolbarList.push(toolbarKeys.NEW_ANNUITY)
      break
    case F.INSURANCE_COLLECTION_ID:
      toolbarList.push(toolbarKeys.NEW_INSURANCE)
      break
    case F.IRA_COLLECTION_ID:
      toolbarList.push(toolbarKeys.NEW_IRA)
      break
    case F.PENSION_COLLECTION_ID:
      toolbarList.push(toolbarKeys.NEW_PENSION)
      break
    case F.PERSON_COLLECTION_ID:
      toolbarList.push(toolbarKeys.NEW_PERSON)
      break
    case F.BENEFICIARY_COLLECTION_ID:
      toolbarList.push(toolbarKeys.NEW_BENEFICIARY)
      break
    case F.TRANSFER_COLLECTION_ID:
      toolbarList.push(toolbarKeys.NEW_TRANSFER)
      break
    case F.DEPOSIT_COLLECTION_ID:
      toolbarList.push(toolbarKeys.NEW_DEPOSIT)
      break
    // case F.WITHDRAWALS_COLLECTION_ID:
    case F.PAYOUT_COLLECTION_ID:
      toolbarList.push(toolbarKeys.NEW_PAYOUT)
      break
    // case F.PAYIN_COLLECTION_ID:
    case F.COST_COLLECTION_ID:
      toolbarList.push(toolbarKeys.NEW_COST)
      break
    case F.PARAMETERCHANGE_COLLECTION_ID:
      toolbarList.push(toolbarKeys.ADD_NEW_PARAMETER_CHANGE)
      break
    default:
      if (process.env.NODE_ENV === 'development') {
        debugger
      } //developer testing for missing case
  }
  return toolbarList
}
export default getToolbarList

// getInstructionLabelText.js

var accounting = require('../../../lib/accounting') //gets the accounting methods

const getInstructionLabelText = function(obj, objBreadcrumbs) {
  var start = null
  var period = null
  var plural = null
  var amount = null
  var dest = null

  switch (true) {
    case objBreadcrumbs.includes('costs') || objBreadcrumbs.includes('payins'):
      if (obj.costamount > 0) {
        amount = accounting.formatNumber(obj.costamount)
      }
      if (obj.coststartyear > 0) {
        start = obj.coststartyear.toString()
      }
      if (obj.costperiodyears > 0) {
        period = obj.costperiodyears.toString()
        if (obj.costperiodyears > 1) {
          plural = true
        }
      }
      return `${amount} ${start ? `starting ${start} ${period ? `for ${period} year${plural ? 's' : ''}` : ''}` : ''}`

    case objBreadcrumbs.includes('beneficiaries'):
      // if (obj.sweepbalance) {
      //   amount = 'Sweep Balance'
      // }
      // if (obj.beneficiarypercent > 0) {
      //   amount = accounting.formatPercent(obj.beneficiarypercent)
      // }
      // if (obj.beneficiaryamount > 0) {
      //   amount = accounting.formatNumber(obj.beneficiaryamount)
      // }
      if (obj.sweepbalance) {
        amount = 'Sweep Balance'
      } else if (obj.beneficiarypercent > 0) {
        amount = accounting.formatPercent(obj.beneficiarypercent)
      } else if (obj.beneficiaryamount > 0) {
        amount = accounting.formatNumber(obj.beneficiaryamount)
      } else {
        amount = '' //Unspecified Amount
      }
      if (amount === undefined) {
        amount = '' //specified amount was not handled
      }
      return `${obj.beneficiaryname} ${amount ? ' - ' : ''} ${amount}`

    case objBreadcrumbs.includes('deposits'):
      if (obj.depositamount > 0) {
        amount = accounting.formatNumber(obj.depositamount)
      }
      if (obj.depositstartyear > 0) {
        start = obj.depositstartyear.toString()
      }
      if (obj.depositperiodyears > 0) {
        period = obj.depositperiodyears.toString()
        if (obj.depositperiodyears > 1) {
          plural = true
        }
      }
      return `${amount} ${start ? `starting ${start} ${period ? `for ${period} year${plural ? 's' : ''}` : ''}` : ''}`

    case objBreadcrumbs.includes('transfers'):
      dest = obj.destinationtitle
      if (obj.sweepbalance) {
        amount = 'Sweep Balance'
      } else if (obj.transferincomeonly) {
        amount = 'Income Only'
      } else if (obj.transferpercent > 0) {
        amount = accounting.formatPercent(obj.transferpercent)
      } else if (obj.transferwithdrawalamount > 0) {
        amount = accounting.formatNumber(obj.transferwithdrawalamount)
      } else if (obj.transferdeliveryamount > 0) {
        amount = accounting.formatNumber(obj.transferdeliveryamount)
      }
      if (obj.transferstartyear > 0) {
        start = `starting ${obj.transferstartyear.toString()}`
      } else {
        start = ''
      }
      if (obj.transferperiodyears > 0) {
        plural = obj.transferperiodyears > 1 ? 'years' : 'year'
        period = `for ${obj.transferperiodyears.toString()} ${plural}`
      }
      return `${dest} ${amount} ${start} ${period}`

    case objBreadcrumbs.includes('withdrawals') || objBreadcrumbs.includes('payouts'):
      if (obj.sweepbalance) {
        amount = 'Sweep Balance'
      } else if (obj.payoutincomeonly) {
        amount = 'Income Only'
      } else if (obj.payoutamount > 0) {
        amount = accounting.formatNumber(obj.payoutamount)
      } else if (obj.payoutpercent > 0) {
        amount = accounting.formatPercent(obj.payoutpercent)
      }
      if (obj.payoutstartyear > 0) {
        start = obj.payoutstartyear.toString()
      }
      if (obj.payoutperiodyears > 0) {
        period = obj.payoutperiodyears.toString()
        if (obj.payoutperiodyears > 1) {
          plural = true
        }
      }
      return `${amount} ${start ? `starting ${start} ${period ? `for ${period} year${plural ? 's' : ''}` : ''}` : ''}`

    case objBreadcrumbs.includes('parameterchanges'):
      let globalParams, changeRoi, roi, capgainstax, fedtax, statetax, cola, expensechangefactor, expensechangeamount, yearlygifttaxexclude
      globalParams = objBreadcrumbs.includes('parameters') ? true : null
      changeRoi = changeRoi || objBreadcrumbs.includes('parameters') ? true : null
      changeRoi = changeRoi || objBreadcrumbs.includes('anuities') ? true : null
      changeRoi = changeRoi || objBreadcrumbs.includes('accounts') ? true : null
      changeRoi = changeRoi || objBreadcrumbs.includes('insurances') ? true : null
      changeRoi = changeRoi || objBreadcrumbs.includes('iras') ? true : null
      if (changeRoi) {
        //these are relevant for an instruction of this asset
        //roi = obj.parmchangeearningsrate >= 0 ? accounting.formatPercent(obj.parmchangeearningsrate) : null
        //capgainstax = obj.parmchangecapitalgainstax >= 0 ? accounting.formatPercent(obj.parmchangecapitalgainstax) : null
        roi = obj.parmchangeearningsrate >= 0 ? ' Roi' : ''
        capgainstax = obj.parmchangecapitalgainstax >= 0 ? ' CapGainsTax' : ''
      }

      cola = globalParams && obj.parmchangeinflationrate >= 0 ? ' Cola' : ''
      expensechangefactor = globalParams && obj.parmchangelivingexpensechangefactor >= 0 ? ' ExpenseChangeFactor' : ''
      expensechangeamount = globalParams && obj.parmchangelivingexpensespecified > 0 ? ' ExpenseChangeAmount' : ''
      yearlygifttaxexclude = globalParams && obj.parmchangeindividualyearlygifttaxexclusion >= 0 ? ' YearlyGiftTaxExclude' : ''

      // fedtax = obj.parmchangefederalincometax >= 0 ? accounting.formatPercent(obj.parmchangefederalincometax) : ''
      // statetax = obj.parmchangestateincometax >= 0 ? accounting.formatPercent(obj.parmchangestateincometax) : ''
      fedtax = obj.parmchangefederalincometax >= 0 ? ' FedTax' : ''
      statetax = obj.parmchangestateincometax >= 0 ? ' StateTax' : ''
      start = obj.parmchangeeffectiveyear > 0 ? obj.parmchangeeffectiveyear.toString() : ''
      return `${start}>${roi}${cola}${fedtax}${statetax}${capgainstax}${expensechangefactor}${expensechangeamount}${yearlygifttaxexclude}`

    default:
      if (process.env.NODE_ENV === 'development') {
        debugger
      } //developer testing
      return `Unknown instruction for: ${objBreadcrumbs}`
  }
}
export default getInstructionLabelText

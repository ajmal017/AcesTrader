// ChartLineGraphData

import PropTypes from 'prop-types'

const ChartLineGraphData = (props) => {
  'use-strict'

  const { chart_name, data_object } = props // the calc results data object
  const chart_type = data_object[chart_name].objecttype
  const chartdata_array = data_object[chart_name].chartdata

  const lineColor = {
    balance: '#329af0', // blue 5
    additions: '#40c057', // green 6
    otherPayouts: '#f03e3e', //red 7
    retireePayout: '#fab005', // yellow 6
  }

  // Refactor the input raw chart data into the Chartjs input data object below
  const data = {
    labels: [],
    datasets: [
      {
        label: 'Balance',
        data: [],
        borderColor: lineColor.balance,
        backgroundColor: lineColor.balance,
        pointBorderColor: lineColor.balance,
        pointBackgroundColor: lineColor.balance,
      },
      {
        label: 'Additions',
        data: [],
        borderColor: lineColor.additions,
        backgroundColor: lineColor.additions,
        pointBorderColor: lineColor.additions,
        pointBackgroundColor: lineColor.additions,
      },
      {
        label: 'Other Payouts',
        data: [],
        borderColor: lineColor.otherPayouts,
        backgroundColor: lineColor.otherPayouts,
        pointBorderColor: lineColor.otherPayouts,
        pointBackgroundColor: lineColor.otherPayouts,
      },
      {
        label: 'Retiree Payout',
        data: [],
        borderColor: lineColor.retireePayout,
        backgroundColor: lineColor.retireePayout,
        pointBorderColor: lineColor.retireePayout,
        pointBackgroundColor: lineColor.retireePayout,
      },
    ],
  }

  let parseForInt = (item) => {
    return parseInt(item.replace(/,/g, ''), 10)
  }

  for (let item of chartdata_array) {
    if (!isNaN(item[0])) {
      //skips the row of column names
      data.labels.push(item[0]) // year
      if (chart_type === 'planresults') {
        data.datasets[0].data.push(parseForInt(item[1])) // Balance
        data.datasets[1].data.push(parseForInt(item[2])) // Additions
        data.datasets[2].data.push(parseForInt(item[3])) // Other Payouts
        data.datasets[3].data.push(parseForInt(item[4])) // Retiree Payout
      } else if (chart_type === 'pension') {
        data.datasets[0].data.push(parseForInt('0')) // Balance
        data.datasets[1].data.push(parseForInt(item[1])) // Additions
        data.datasets[2].data.push(parseForInt(item[2])) // Other Payouts
        data.datasets[3].data.push(parseForInt(item[3])) // Retiree Payout
      } else {
        data.datasets[0].data.push(parseForInt(item[1])) // Balance
        data.datasets[1].data.push(parseForInt(item[2]) + parseForInt(item[3])) // Additions = Earnings + Receipts
        data.datasets[2].data.push(parseForInt(item[4]) + parseForInt(item[5])) // Other Payouts = Tax Payments + Transfers Out
        data.datasets[3].data.push(parseForInt(item[6])) // Retiree Payout
      }
    }
  }

  return data //the line chart's data
}

ChartLineGraphData.propTypes = {
  chart_name: PropTypes.string.isRequired,
  data_object: PropTypes.object.isRequired,
}

export default ChartLineGraphData

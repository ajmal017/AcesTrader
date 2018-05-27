// ReactChartLine
// See readme.txt for all reference links.

const React = require('react')
const { Line } = require('react-chartjs-2')

const ReactChartLine = (props) => {
  'use-strict'

  // This code is a clumsy hack to alert the user to a clockable legendItem,
  // since chart.js does not have a way to enable a cursor=pointer for legends.
  // See this post about not changing the mouse cursor to 'pointer'
  // when the user is hovering over the legend.
  // https://github.com/chartjs/Chart.js/issues/3262
  let cursorSet
  const handleHover = function(e, legendItem) {
    if (!cursorSet) {
      document.body.style.cursor = 'pointer'
      cursorSet = true
      //console.log("set Hover Timeout")
      setTimeout(() => {
        document.body.style.cursor = 'default'
        cursorSet = false
      }, 500)
    }
  }

  const options = {
    animation: {
      duration: 200,
    },
    maintainAspectRatio: false,
    responsive: true,
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
    legend: {
      labels: {
        boxWidth: 14,
      },
      cursor: 'pointer',
      onHover: handleHover,
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      position: 'nearest',
      titleFontColor: '#0b7285', //cyan 9
      bodyFontColor: '#0b7285', //cyan 9
      backgroundColor: '#dee2e6', //gray 3
    },
    hover: {
      mode: 'dataset',
    },
    scales: {
      xAxes: [
        {
          ticks: {
            autoSkip: true,
            autoSkipPadding: 0,
          },
          display: true,
          scaleLabel: {
            show: true,
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            show: true,
          },
          ticks: {
            beginAtZero: true,
            callback: function(value, index, values) {
              if (parseInt(value, 10) >= 1000) {
                //add commas
                return (
                  ' ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                )
              } else {
                return ' ' + value
              }
            },
          },
        },
      ],
    },
  }

  let autoskipNumber = 0
  if (props.data.labels.length > 20) {
    autoskipNumber = 34
  }
  if (props.data.labels.length > 60) {
    autoskipNumber = 40
  }
  if (props.data.labels.length > 100) {
    autoskipNumber = 60
  }
  options.scales.xAxes[0].ticks.autoSkipPadding = autoskipNumber

  for (let dataset of props.data.datasets) {
    dataset.fill = false
    dataset.pointRadius = 1
    dataset.pointHitRadius = 10
    dataset.pointBorderWidth = 1
    dataset.label === 'Balance'
      ? (dataset.pointHoverRadius = 2)
      : (dataset.pointHoverRadius = 2.4)
  }
  return <Line data={props.data} options={options} height={100} />
}

export default ReactChartLine

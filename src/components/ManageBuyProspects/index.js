// ManageBuyProspects/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import withSizes from 'react-sizes'
import appScrollbarWidth from '../../lib/appScrollbarWidth.js'
import Checkbox from '../Checkbox'
import axios from 'axios' //--TESTING--
import './styles.css'

class ManageBuyProspects extends Component {
  constructor(props) {
    super(props)
    this.state = { value: 'UWT, UCO, TNA, FAS, GUSH, ERX, USO, MCHI, XME, XOP, KRE, IJR, FXI, KBE, XLF, DIA, IWM, PDBC, EWJ, XLE, ACWI, EWH, EWQ, VTV, EWY, SCHF, IEFA, VEU, VEA, EFA, EZU, VGK, EWU, HEZU, OIH, TBT ' }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.windowHeight = null //waiting for render to aet current value
    this.textAreaBox = ''
  }

  setRenderWindowHeight(windowHeight) {
    this.windowHeight = windowHeight
    this.adjustElementHeight(windowHeight)
  }

  adjustElementHeight(windowHeight) {
    if (this.componentMounted) {
      const magicnumber = 74 //this is the window height space not used by the Container
      let Host = document.getElementById('saveas-host')
      let Container = document.getElementById('saveas-container')
      let ContainerHeight = windowHeight - magicnumber
      Host.style.height = ContainerHeight - 60 + 'px' //keeps host height less than container
      Container.style.height = ContainerHeight + 'px' // this is the adjustment as user resizes window
    }
  }

  componentDidMount() {
    this.componentMounted = true
    this.adjustElementHeight(this.windowHeight)
    this.scrollbarWidth = appScrollbarWidth()
    window.scrollTo(0, 0)
    this.textAreaBox = document.getElementById('syms')
    let textBox = document.getElementById('pname')
    //For the cursor to be moved to the end, the input has to have focus first,
    //then when the value is changed it will goto the end.
    //If you set value to the same, it won't change in chrome.
    textBox.focus()
    textBox.value = ''
    textBox.value = this.state.value

    // this temporary axios code below
    // is to design and test the chart data processing
    let IEX_BASE_URL = 'https://api.iextrading.com/1.0/'
    axios
      // .get(IEX_BASE_URL + 'stock/aapl/batch?types=chart&range=1m&last=10')
      .get(IEX_BASE_URL + 'stock/aapl/batch?types=quote,news,chart&range=1m&last=10')
      .then((response) => {
        this.buildChartData(response) //experimental
      })
      .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
  }
  buildChartData(response) {
    console.log(response.data)
  }

  componentDidUpdate() {
    this.adjustElementHeight(this.windowHeight)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
    this.textAreaBox.value = ''
  }

  handleClick(flag) {
    if (flag === 'submit') {
      this.handleSubmitBuys()
    }
    if (flag === 'accept') {
      this.handleAcceptBuys()
    }
  }

  handleSubmitBuys() {
    // let tableData = []
  }

  handleAcceptBuys() {}

  render() {
    this.setRenderWindowHeight(this.props.height)
    return (
      <div id="saveas-host">
        <div id="saveas-container">
          <div id="saveas-layout">
            <div className="title">
              <span>Add Buy-on-the-Dip Prospects</span>
            </div>
            <div className="content-box">
              <p>
                This form takes the ETF symbols listed in the Buy-on-the-Dip page from ETFdb.com.
                <br />Enter the symbols and press the Submit button to verify the entries.
                <br />The symbols will be added to the Buys prospect list if you click Accept.
              </p>
              <label htmlFor="pname">Enter the symbols list:</label>
              <input type="text" id="pname" value={this.state.value} onChange={this.handleChange} />

              <label id="textareacaption" htmlFor="syms">
                Add these symbol names?
              </label>
              <textarea id="syms" readOnly={true} />
              <div className="buttons">
                <button className="buttonsubmit" onClick={() => this.handleClick('submit')} type="button" aria-label="tes">
                  Submit
                </button>
                <button className="buttonaccept" onClick={() => this.handleClick('accept')} type="button" aria-label="no">
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapSizesToProps = ({ height, width }) => ({
  height: height,
  width: width,
})

// withSizes is used as a HOC to supply window demensions as a prop item
// https://www.npmjs.com/package/react-sizes
export default connect()(withSizes(mapSizesToProps)(ManageBuyProspects))

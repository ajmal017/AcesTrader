// ManageProspects/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import withSizes from 'react-sizes'
import appScrollbarWidth from '../../lib/appScrollbarWidth.js'
import Checkbox from '../Checkbox'
import { addBuystoList } from '../../redux/reducerBuys'
import { addSellstoList } from '../../redux/reducerSells'
import axios from 'axios' //--TESTING--
import './styles.css'

class ManageProspects extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value:
        "'TQQQ','UDOW','UPRO','QLD','SPXL','MCHI','SSO','MTUM','XLK','QQQ','FXI','IWF','XLF','SPYG','DIA','EWJ','EWI','EWS','IVV','VOO','SPY','ACWI','VT','EWH','IEFA','SCHF','VEU','EFA','CWB','EZU','USMV','EFV'",
      // 'UWT, UCO, TNA, FAS, GUSH, ERX, USO, MCHI, XME, XOP, KRE, IJR, FXI, KBE, XLF, DIA, IWM, PDBC, EWJ, XLE, ACWI, EWH, EWQ, VTV, EWY, SCHF, IEFA, VEU, VEA, EFA, EZU, VGK, EWU, HEZU, OIH, TBT ',
    }
    this.handleClick = props.handleClick
    this.handleChange = this.handleChange.bind(this)
    this.handleLocalClick = this.handleLocalClick.bind(this)
    this.windowHeight = null //waiting for render to aet current value
    this.textAreaBox = null
    this.textBox = null
    this.newProspects = null
    this.tradeSide = props.tradeSide
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
    this.textBox = document.getElementById('pname')
    //For the cursor to be moved to the end, the input has to have focus first,
    //then when the value is changed it will goto the end.
    //If you set value to the same, it won't change in chrome.
    this.textBox.focus()
    this.textBox.value = ''
    this.textBox.value = this.state.value

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

  handleLocalClick(flag) {
    if (flag === 'submit') {
      this.handleSubmit()
    }
    if (flag === 'accept') {
      this.handleAccept()
    }
  }

  handleSubmit() {
    let data1 = this.textBox.value
      .replace(/,/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ') //get the symbols in array
    let data2 = data1.map((token) => {
      if (token) {
        return token.replace(/\W*/g, '').toUpperCase()
      }
    })
    this.textAreaBox.value = data2.join(' ')
  }

  handleAccept() {
    this.newProspects = this.textAreaBox.value.split(' ').sort()
    //this.textAreaBox.value = this.newProspects.join(' ')
    if (this.tradeSide.toUpperCase() === 'BUYS') {
      this.props.dispatch(addBuystoList(this.newProspects))
    } else {
      this.props.dispatch(addSellstoList(this.newProspects))
    }
    this.props.handleClick('push', 'prospectbuys')
  }

  render() {
    this.setRenderWindowHeight(this.props.height)
    let title = this.tradeSide
    return (
      <div id="saveas-host">
        <div id="saveas-container">
          <div id="saveas-layout">
            <div className="title">
              <span>Add Prospective {title}</span>
            </div>
            <div className="content-box">
              <p>
                This form takes one or more symbols to be added to the {this.tradeSide} prospect list.
                <br />Enter the symbols and press the Submit button to verify the entries.
                <br />The symbols will be added to the {this.tradeSide} prospect list if you click Accept.
              </p>
              <label htmlFor="pname">Enter the list of prospective {title.toLowerCase()}:</label>
              <input type="text" id="pname" value={this.state.value} onChange={this.handleChange} />

              <label id="textareacaption" htmlFor="syms">
                Add these prospective {title.toLowerCase()}?
              </label>
              <textarea id="syms" readOnly={true} />
              <div className="buttons">
                <button className="buttonsubmit" onClick={() => this.handleLocalClick('submit')} type="button" aria-label="tes">
                  Submit
                </button>
                <button className="buttonaccept" onClick={() => this.handleLocalClick('accept')} type="button" aria-label="no">
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

// function mapStateToProps(state) {
//   const props = {
//     buys: state.buys,
//   }
//   return props
// }

const mapSizesToProps = ({ height, width }) => ({
  height: height,
  width: width,
})

// withSizes is used as a HOC to supply window demensions as a prop item
// https://www.npmjs.com/package/react-sizes
export default connect()(withSizes(mapSizesToProps)(ManageProspects))

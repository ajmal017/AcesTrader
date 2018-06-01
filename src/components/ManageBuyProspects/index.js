// ManageBuyProspects/index.js

// compose based on Saveas/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import withSizes from 'react-sizes'
import appScrollbarWidth from '../../lib/appScrollbarWidth.js'
import Checkbox from '../Checkbox'
import { get } from '../../lib/table-scraper'
import axios from 'axios' //--TESTING--
import './styles.css'
// var scraper = require('../../lib/table-scraper')

class ManageBuyProspects extends Component {
  constructor(props) {
    super(props)
    this.state = { value: 'http://etfdb.com/news/2018/05/21/buy-on-the-dip-prospects-may-21-2018-edition/', errCode: null }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.windowHeight = null //waiting for render to aet current value
    this.errorMsg = ''
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
    let textBox = document.getElementById('pname')
    //For the cursor to be moved to the end, the input has to have focus first,
    //then when the value is changed it will goto the end.
    //If you set value to the same, it won't change in chrome.
    textBox.focus()
    textBox.value = ''
    textBox.value = this.state.value

    axios
      // .get('http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC')
      .get('https://iextrading.com/apps/stocks/#/HYD')
      .then((response) => {
        console.log(response.data)
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
    // .catch((error) => {
    //   console.log('Error fetching and parsing data', error)
    // })

    // // axios.get(`http://etfdb.com/news/2018/05/21/buy-on-the-dip-prospects-may-21-2018-edition/`).then((res) => {
    // axios.get(`https://iextrading.com/apps/stocks/#/HYD`).then((res) => {
    //   const persons = res.data
    //   console.log(persons)
    // })
  }

  componentDidUpdate() {
    this.adjustElementHeight(this.windowHeight)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
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
    const url = this.state.value
    get(url).then(function(tableData) {
      debugger
      /*
         tableData === 
          [ 
            [ 
              { State: 'Minnesota', 'Capital City': 'Saint Paul', 'Pop.': '3' },
              { State: 'New York', 'Capital City': 'Albany', 'Pop.': 'Eight Million' } 
            ] 
          ]
      */
    })
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
                This form takes the url of a Buy-on-the-Dip page from ETFdb.com.
                <br />When entered with the Submit button a list of the ETF symbols is presented.
                <br />These will be added to the list of prospective Buys if you click Accept.
              </p>
              <label htmlFor="pname">Enter Web Page Address:</label>
              <input type="text" id="pname" value={this.state.value} onChange={this.handleChange} />

              {/* <p id="textareacaption">The captured symbol names:</p> */}
              <label id="textareacaption" htmlFor="syms">
                The captured symbol names:
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

function mapStateToProps(state) {
  const props = {
    // planName: state.files.planName,
    // planObject: state.files.planObject,
    // planMeta: state.files.planObject.forecaster.meta,
    // plansList: state.common.plansList,
    // initialized: state.common.initialized,
    // initializedDate: state.common.initializedDate,
    // newPlansListDate: state.common.newPlansListDate,
    // newVersionDate: state.common.newVersionDate,
    // currentVersion: state.common.currentVersion,
  }
  return props
}

// withSizes is used as a HOC to supply window demensions as a prop item
// https://www.npmjs.com/package/react-sizes
export default connect(mapStateToProps)(withSizes(mapSizesToProps)(ManageBuyProspects))

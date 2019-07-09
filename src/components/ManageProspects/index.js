// @ts-nocheck
// prevent false error flag on ".value" on this.textBox.value

// ManageProspects/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import withSizes from 'react-sizes'
import appScrollbarWidth from '../../lib/appScrollbarWidth.js'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
import { addBuysToList, removeAllBuysFromList } from '../../redux/reducerBuys'
import { addSellstoList, removeAllSellsFromList } from '../../redux/reducerSells'
import { addTrendBuysToList, removeAllTrendBuysFromList } from '../../redux/reducerTrendBuys'
import { addWatchPriceAndIssueType } from '../../redux/thunkEditListObjects'
import { queryClearProspectsList } from '../../redux/reducerModal'
import { putSymbolDataObjects } from '../../lib/appSymbolDataObject'
import { loadWatchedPrices } from '../../lib/appLoadWatchedPrices'
import { verifySymbolLookups } from '../../lib/appVerifySymbolLookups'
import './styles.css'

class ManageProspects extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAcceptButtonDisabled: true,
    }
    this.handleClick = props.handleClick
    this.handleChange = this.handleChange.bind(this)
    this.handleLocalClick = this.handleLocalClick.bind(this)
    this.handleClearQueryResonse = this.handleClearQueryResonse.bind(this)
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
      Host.style.height = ContainerHeight - 0 + 'px' //keeps host height less than container
      // Host.style.height = ContainerHeight - 60 + 'px' //keeps host height less than container
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
    this.reference = getReference() //indicates the user's role
    this.textBox.value = ''
    if (this.reference === referenceLocaltrader && process.env.NODE_ENV === 'development') {
      this.textBox.value = this.props.mockSymbols //for testing and debugging
    }
  }

  componentDidUpdate() {
    this.adjustElementHeight(this.windowHeight)
  }

  handleChange(event) {
    this.setState({ textValue: event.target.value })
    // this.textAreaBox.value = ''
  }

  handleLocalClick(flag) {
    if (flag === 'submit') {
      this.handleSubmit()
    }
    if (flag === 'accept') {
      this.handleAccept()
    }
    if (flag === 'delete') {
      this.handleDelete()
    }
  }

  handleSubmit() {
    // Verify the submitted list of symbols
    let cleanedInput
    let verifiedList
    this.textBox.value = this.textBox.value.trim()
    if (this.textBox.value === '') {
      this.textBox.value = '**No Data**'
    } else {
      if (/^\(/.test(this.textBox.value)) {
        // This is the case where an ETFdb table is copied from their
        // web page and pasted here, and the text can look like this:
        // (SHY A)	1-3 Year Treasury Bond Ishares ETF	$83.29	-1.54%
        // (VCSH A)	Sht-Term Corp Bond Vanguard	$78.19	-2.32%
        // We extract the symbols with the code in cleanEtfDb()
        cleanedInput = this.cleanEtfDb(this.textBox.value)
      } else {
        cleanedInput = this.textBox.value
          .replace(/,/g, ' ')
          .replace(/\s+/g, ' ')
          .split(' ') //get the symbols in array
      }
      let cleanedTokens = cleanedInput.map((token) => {
        return token.replace(/\W*/g, '').toUpperCase()
      })

      // remove any duplicates in this input array
      let prunedTokens = cleanedTokens.filter((element, index) => cleanedTokens.indexOf(element) === index)
      // console.log(prunedTokens)

      let prospectsArray
      let positionsArray
      if (this.tradeSide.toUpperCase() === 'BUYS') {
        prospectsArray = this.props.state.buys
        positionsArray = this.props.state.longs
      } else if (this.tradeSide.toUpperCase() === 'SHORT SALES') {
        prospectsArray = this.props.state.sells
        positionsArray = this.props.state.shorts
      } else if (this.tradeSide.toUpperCase() === 'TREND BUYS') {
        prospectsArray = this.props.state.trendbuys
        positionsArray = this.props.state.trendlongs
      } else {
        alert('ERROR1 Missing tradeSide in ManageProspects')
        // debugger
      }
      // Note: positionsArray not longer scanned for dups, as they are allowed with hash tags for ID instead of symbol
      verifiedList = this.verifyList(prunedTokens.sort(), prospectsArray, positionsArray)
      if (verifiedList.length === 0) {
        this.textAreaBox.value = '**No New Symbols In The List, All These Are Already Entered**'
      } else {
        this.textAreaBox.value = 'Verifying Symbols, Please Wait...'
        verifySymbolLookups(verifiedList).then(
          function (data) {
            if (data.error) {
              // Extract symbol from string ".../stock/symbol/company" to use in reporting error
              let result = /.*\/stock\/(\w+).*/.exec(data.error.request.responseURL)
              let symbol = result[1]
              this.textAreaBox.value = `${symbol} is an unknown symbol, correct the symbol and verify again.`
              this.setState({
                ...this.state,
                isAcceptButtonDisabled: true,
              })
            } else {
              // Data is an array of objects, each with info about one symbol
              // Save the array to be used later
              putSymbolDataObjects(data.arr)

              // Allow the user to accept this list of prospects' symbols
              this.textAreaBox.value = verifiedList.join(' ')
              this.setState({
                ...this.state,
                isAcceptButtonDisabled: false,
              })
              return
            }
          }.bind(this)
        )
        //this fetches the symbol prices and puts them into appWatchedPrice for later retrival by redux thunk "addWatchPriceAndIssueType"
        loadWatchedPrices(verifiedList) //this fetches prices and then puts them into this object for retrival later
      }
    }
  }

  cleanEtfDb(value) {
    let firstArray = value.split('%')
    let secondArray = firstArray.map((token1) => {
      let token2 = token1.replace(/\s*\(/, '')
      let token3 = token2.replace(/\s.*/, '')
      return token3
    })
    let thirdArray = secondArray.filter((item) => item !== '')
    return thirdArray
  }

  handleAccept() {
    if (this.textAreaBox.value !== '') {
      this.newProspects = this.textAreaBox.value.split(' ').sort()
      if (this.tradeSide.toUpperCase() === 'BUYS') {
        this.props.dispatch(addBuysToList(this.newProspects))
        this.props.dispatch(addWatchPriceAndIssueType(this.tradeSide.toUpperCase())) //call thunk
        this.props.handleClick('push', 'prospectbuys') // return to last window
      } else if (this.tradeSide.toUpperCase() === 'SHORT SALES') {
        this.props.dispatch(addSellstoList(this.newProspects))
        this.props.dispatch(addWatchPriceAndIssueType(this.tradeSide.toUpperCase())) //call thunk
        this.props.handleClick('push', 'prospectsells') // return to last window
      } else if (this.tradeSide.toUpperCase() === 'TREND BUYS') {
        this.props.dispatch(addTrendBuysToList(this.newProspects))
        this.props.dispatch(addWatchPriceAndIssueType(this.tradeSide.toUpperCase())) //call thunk
        this.props.handleClick('push', 'prospecttrendbuys') // return to last window
      } else {
        alert('ERROR2 Missing tradeSide in ManageProspects')
        // debugger
      }
    } else {
      this.textAreaBox.value = '**No Data**'
    }
  }

  verifyList(inputList, prospectsArray, positionsArray) {
    let prunedList
    prunedList = this.pruneList(inputList, prospectsArray)
    // prunedList = this.pruneList(prunedList, positionsArray)
    return prunedList
  }
  pruneList(inputList, stateObjects) {
    let newList = [] // start with empty array to be populated
    let hh = 0
    let kk = 0
    let objectSymbol = null
    let listSymbol = null
    while (hh < stateObjects.length || kk < inputList.length) {
      if (hh < stateObjects.length) {
        objectSymbol = stateObjects[hh].symbol
      }
      if (kk < inputList.length) {
        listSymbol = inputList[kk]
      }
      if (hh >= stateObjects.length) {
        //empty array of objects
        newList.push(listSymbol)
        ++kk
      } else if (kk >= inputList.length) {
        //empty list of new symbols
        return newList //finished prunning
      } else if (objectSymbol < listSymbol) {
        //continue to next object symbol
        ++hh
      } else if (objectSymbol > listSymbol) {
        newList.push(listSymbol) //keep new symbol
        ++kk
      } else if (objectSymbol === listSymbol) {
        // don't keep new symbol
        ++hh
        ++kk
      }
    }
    return newList
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
                <br />
                Enter the symbols and click the Verfy button to verify the entries.
              </p>
              <label htmlFor="pname">Enter prospective {title.toLowerCase()}:</label>
              <input type="text" id="pname" value={this.state.textValue} onChange={this.handleChange} />

              <p className="acceptdescription">
                Symbols already in the {this.tradeSide} list are removed from the prospects list when you click Verfy.
                <br />
                The remaining new symbols shown are added to the {this.tradeSide} list when you click Accept.
              </p>
              <label id="textareacaption" htmlFor="syms">
                Add these new prospective {title.toLowerCase()}?
              </label>
              <textarea id="syms" readOnly={true} />
              <div className="buttons">
                <button id="buttonsubmit" onClick={() => this.handleLocalClick('submit')} type="button" aria-label="">
                  Verify
                </button>
                <button id="buttonaccept" onClick={() => this.handleLocalClick('accept')} type="button" aria-label="" disabled={this.state.isAcceptButtonDisabled}>
                  Accept
                </button>
                <button id="buttondelete" onClick={() => this.handleLocalClick('delete')} type="button" aria-label="no">
                  Delete All {this.tradeSide} List Symbols
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleDelete() {
    this.props.dispatch(queryClearProspectsList(this.tradeSide, this.handleClearQueryResonse))
    this.textAreaBox.value = ''
  }

  handleClearQueryResonse(response) {
    let buttonFlag = response.buttonFlag
    if (buttonFlag === 'yes') {
      if (this.tradeSide.toUpperCase() === 'BUYS') {
        this.props.dispatch(removeAllBuysFromList())
      } else if (this.tradeSide.toUpperCase() === 'SHORT SALES') {
        this.props.dispatch(removeAllSellsFromList())
      } else if (this.tradeSide.toUpperCase() === 'TREND BUYS') {
        this.props.dispatch(removeAllTrendBuysFromList())
      } else {
        alert('ERROR3 Missing tradeSide in ManageProspects')
        // debugger
      }
    }
  }
}

const mapStateToProps = (state) => ({
  state: state,
})

const mapSizesToProps = ({ height, width }) => ({
  height: height,
  width: width,
})

// withSizes is used as a HOC to supply window demensions as a prop item
// https://www.npmjs.com/package/react-sizes
export default connect(mapStateToProps)(withSizes(mapSizesToProps)(ManageProspects))
// export default connect(mapStateToProps)(ManageProspects)

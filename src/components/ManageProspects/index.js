// ManageProspects/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import withSizes from 'react-sizes'
import appScrollbarWidth from '../../lib/appScrollbarWidth.js'
import { addBuystoList, removeAllBuysFromList } from '../../redux/reducerBuys'
import { addSellstoList, removeAllSellsFromList } from '../../redux/reducerSells'
import { notification, queryClearProspectsList } from '../../redux/ducksModal'
import './styles.css'

class ManageProspects extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAcceptButtonDisabled: true,
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
    this.textBox.value = ''
    this.textBox.value = this.state.value
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
    if (flag === 'delete') {
      this.handleDelete()
    }
  }

  handleSubmit() {
    if (this.textBox.value !== '') {
      let cleanedInput = this.textBox.value
        .replace(/,/g, ' ')
        .replace(/\s+/g, ' ')
        .split(' ') //get the symbols in array
      let cleanedTokens = cleanedInput.map((token) => {
        return token.replace(/\W*/g, '').toUpperCase()
      })
      let prospectsArray
      let positionsArray
      if (this.tradeSide.toUpperCase() === 'BUYS') {
        prospectsArray = this.props.state.buys
        positionsArray = this.props.state.longs
      } else {
        prospectsArray = this.props.state.sells
        positionsArray = this.props.state.shorts
      }
      let verifiedList = this.verifyList(cleanedTokens.sort(), prospectsArray, positionsArray)
      if (verifiedList.length > 0) {
        this.textAreaBox.value = verifiedList.join(' ')
        this.setState({
          ...this.state,
          isAcceptButtonDisabled: false,
        })
      } else {
        this.textAreaBox.value = '**No New Symbols**'
      }
    } else {
      this.textBox.value = '**No Data**'
    }
  }

  handleAccept() {
    if (this.textAreaBox.value !== '') {
      this.newProspects = this.textAreaBox.value.split(' ').sort()
      //this.textAreaBox.value = this.newProspects.join(' ')
      if (this.tradeSide.toUpperCase() === 'BUYS') {
        this.props.dispatch(addBuystoList(this.newProspects))
        this.props.handleClick('push', 'prospectbuys')
      } else {
        this.props.dispatch(addSellstoList(this.newProspects))
        this.props.handleClick('push', 'prospectsells')
      }
    } else {
      this.textAreaBox.value = '**No Data**'
    }
  }

  verifyList(inputList, prospectsArray, positionsArray) {
    let prunedList
    prunedList = this.pruneList(inputList, prospectsArray)
    prunedList = this.pruneList(prunedList, positionsArray)
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
      if ((hh >= stateObjects.length) {
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
                <br />Enter the symbols and press the Submit button to verify the entries.
              </p>
              <label htmlFor="pname">Enter prospective {title.toLowerCase()}:</label>
              <input type="text" id="pname" value={this.state.value} onChange={this.handleChange} />

              <p className="acceptdescription">
                Symbols already in the {this.tradeSide} list or in Positions are removed from the submitted list.
                <br />The remaining symbols shown below are added to the {this.tradeSide} list when you click Accept.
              </p>
              <label id="textareacaption" htmlFor="syms">
                Add these prospective {title.toLowerCase()}?
              </label>
              <textarea id="syms" readOnly={true} />
              <div className="buttons">
                <button id="buttonsubmit" onClick={() => this.handleLocalClick('submit')} type="button" aria-label="">
                  Submit
                </button>
                <button id="buttonaccept" onClick={() => this.handleLocalClick('accept')} type="button" aria-label="" disabled={this.state.isAcceptButtonDisabled}>
                  Accept
                </button>
                <button id="buttondelete" onClick={() => this.handleLocalClick('delete')} type="button" aria-label="no">
                  Delete All
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
  }
  handleClearQueryResonse(response) {
    let buttonFlag = response.buttonFlag
    if (buttonFlag === 'yes') {
      if (this.tradeSide.toUpperCase() === 'BUYS') {
        this.props.dispatch(removeAllBuysFromList())
      } else {
        this.props.dispatch(removeAllSellsFromList())
      }
      }
  }
  
}

const mapStateToProps = (state) => ({
  state: state,
  // longs: state.longs,
  // shorts: state.shorts,
})

const mapSizesToProps = ({ height, width }) => ({
  height: height,
  width: width,
})

// withSizes is used as a HOC to supply window demensions as a prop item
// https://www.npmjs.com/package/react-sizes
export default connect(mapStateToProps)(withSizes(mapSizesToProps)(ManageProspects))
// export default connect(mapStateToProps)(ManageProspects)

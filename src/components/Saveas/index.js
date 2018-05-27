// Saveas
import React, { Component } from 'react'
import { connect } from 'react-redux'
import withSizes from 'react-sizes'
import { saveToStorage } from '../../redux/ducksFiles'
import { addPlanToList, recoverAllPlansToList } from '../../redux/ducksCommon'
import { resetState } from '../../redux'
import appScrollbarWidth from '../../lib/appScrollbarWidth.js'
import exampleFileNames from '../../lib/exampleFileNames.json'
import Checkbox from '../Checkbox'
import './styles.css'
var F = require('../../lib/fobj') //gets the static object of constants

class Saveas extends Component {
  constructor(props) {
    super(props)
    this.state = { value: this.props.planName, errCode: null }
    this.exampleFileNames = exampleFileNames
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.toggleCheckbox = this.toggleCheckbox.bind(this)
    this.windowHeight = null //waiting for render to aet current value
    this.makeExamplePlan = false //toggles when checkbox is clicked
    this.errorMsg = ''
  }

  toggleCheckbox = (isChecked, label) => {
    this.makeExamplePlan = isChecked
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
    this.maxPlans() // Check for maximum allowed saved plans
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
  }

  componentDidUpdate() {
    this.adjustElementHeight(this.windowHeight)
  }

  handleChange(event) {
    this.setState({ value: event.target.value, errDup: null, errReserved: null, errExmp: null })
  }

  handleClick(flag) {
    if (flag === 'cancel') {
      this.handleSpecialAction()
      this.props.history.push('/forecaster')
    }
    if (flag === 'save') {
      if (this.state.errDup) {
        //A prior errDup value triggered the query dialog,
        //but user has chosen Save to overwrite the existing plan.
        this.saveFile(this.state.value, this.props.planObject)
      }
      if (this.dupName()) {
        this.setState({ errDup: true }) // A dup name was found
      } else if (this.reservedName()) {
        this.setState({ errReserved: true }) // A reserved name was found (e.g. "Untitled" or "@@...")
      } else if (this.exampleName()) {
        this.setState({ errExmp: true }) // An example plan name was found
      } else {
        this.saveFile(this.state.value, this.props.planObject) // acceptable plan name was submitted
      }
    }
  }

  maxPlans() {
    // let useridTokens = this.props.planObject.forecaster.meta.userid.split('-')
    // if (useridTokens) {
    //   let maxAllowed = parseInt(useridTokens[1]) //userid format is "NAME-maxvalue"
    //   if (this.props.plansList.length > maxAllowed - 1) {
    //     const noticeCode = 'maxsaved'
    //     this.props.dispatch(notification(noticeCode))
    //     this.props.history.push('/forecaster') // restore the existing page
    //     // return null
    //   }
    // }
  }

  //This is a hack to allow user to reset the state and list of user plans
  //by using these special input strings and then hitting Cancel
  handleSpecialAction() {
    switch (this.state.value) {
      case '@@meta':
        let savedate = 'saved date: ' + this.props.planMeta.savedate
        // let createdate = 'created date: ' + this.props.planMeta.createdate
        let savedversion = 'saved version: ' + this.props.planMeta.applicationversion
        // let deploymentversion = 'deploymentversion: ' + this.props.planMeta.deploymentversion
        let userid = 'userid: ' + this.props.planMeta.userid
        let examplefile = 'examplefile: ' + this.props.planMeta.examplefile.toString()
        // let initialized = 'initialized: ' + this.props.initialized.toString()
        let initializedDate = 'initialized state date: ' + this.props.initializedDate
        // let newPlansListDate = 'newPlansListDate: ' + this.props.newPlansListDate
        // let newVersionDate = 'newVersionDate: ' + this.props.newVersionDate
        let currentVersion = 'current app version: ' + this.props.currentVersion
        let meta = `@@meta:\n
        ${savedate}
        ${savedversion}
        ${userid}
        ${examplefile}\n
        ${initializedDate}
        ${currentVersion}`
        alert(meta)
        break
      case '@@reset':
        let date = new Date()
        let recoverDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        this.props.dispatch(resetState())
        this.props.dispatch(recoverAllPlansToList(recoverDate))
        alert('@@reset performed')
        break
      case '@@':
        alert(
          '@@ Developer Commands:\n\n@@meta -  Reads the meta data from the opened plan\n\n@@reset - Resets plan to the default and rebuilds the list of user plans from those in local storage.'
        )
        break
      default:
        break
    }
  }

  dupName() {
    // test for unique name
    var dupNames = this.props.plansList.filter((name, index) => {
      return name === this.state.value
    })
    if (dupNames && dupNames.length > 0) {
      return true // A dup name was found: dupName[0])
    }
    return false
  }
  reservedName() {
    if (this.state.value.toLowerCase() === F.UNTITLEDFILENAME.toLowerCase()) {
      return true // An unallowed name was found
    }
    if (this.state.value.indexOf('@@') === 0) {
      return true // An unallowed name was found
    }
    return false
  }
  exampleName() {
    // test for use of example plan name
    const nameLower = this.state.value.toLowerCase()
    var exampleNames = exampleFileNames[0].fileNames.filter((name, index) => {
      return name === nameLower
    })
    if (exampleNames && exampleNames.length > 0) {
      return true // An  example file name was found
    }
    return false
  }

  saveFile(planName, planObject) {
    this.props.dispatch(saveToStorage(planName, planObject, this.makeExamplePlan))
    this.props.dispatch(addPlanToList(planName)) // remove plan name from plansList array
    this.props.history.push('/forecaster') // restore the existing page
    return null
  }

  render() {
    let checkboxStyle =
      process.env.NODE_ENV === 'development'
        ? {
            padding: '30px 0 0 60px',
            display: 'block',
          }
        : {
            display: 'none',
          }
    const contentNewplan = F.UNTITLEDFILENAME === this.props.planName
    this.setRenderWindowHeight(this.props.height)
    return (
      <div id="saveas-host">
        <div id="saveas-container">
          <div id="saveas-layout">
            <div className="title">
              <span>Save As...</span>
            </div>
            <div className="content-box">
              {contentNewplan ? (
                <span>
                  <p>Name your new plan and save it with your selected name.</p>
                  <p>This is required for new plans that are named: {F.UNTITLEDFILENAME}.</p>
                </span>
              ) : (
                <span>
                  <p>Rename your current plan and save it with the new name.</p>
                  <p>Your old plan remains in memory with its last saved changes.</p>
                </span>
              )}
              <p>The newly named plan becomes your current plan.</p>
              <label htmlFor="pname">Enter Plan Name:</label>
              <input type="text" id="pname" placeholder="New name.." value={this.state.value} onChange={this.handleChange} />
              {this.state.errDup ? <p className="saveaserrmsg">A plan with that name already exists. Use another name or overwrite that file.</p> : null}
              {this.state.errReserved ? <p className="saveaserrmsg">You can't use {this.state.value} as a name. Use another name.</p> : null}
              {this.state.errExmp ? <p className="saveaserrmsg">You can't use that name, it's an example plan. Use another name.</p> : null}
            </div>
            <div className="buttons">
              <button className="buttonsave" onClick={() => this.handleClick('save')} type="button" aria-label="tes">
                {this.state.errDup ? 'Overwrite Existing Plan' : 'Save With New Name'}
              </button>
              <button className="buttoncancel" onClick={() => this.handleClick('cancel')} type="button" aria-label="no">
                Cancel
              </button>
            </div>
          </div>
          <div style={checkboxStyle}>
            <Checkbox label={'Mark As Example Plan'} handleCheckboxChange={this.toggleCheckbox} />
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
    planName: state.files.planName,
    planObject: state.files.planObject,
    planMeta: state.files.planObject.forecaster.meta,
    plansList: state.common.plansList,
    initialized: state.common.initialized,
    initializedDate: state.common.initializedDate,
    newPlansListDate: state.common.newPlansListDate,
    newVersionDate: state.common.newVersionDate,
    currentVersion: state.common.currentVersion,
  }
  return props
}

// withSizes is used as a HOC to supply window demensions as a prop item
// https://www.npmjs.com/package/react-sizes
export default connect(mapStateToProps)(withSizes(mapSizesToProps)(Saveas))

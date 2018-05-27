// Import/index.js
// http://blog.teamtreehouse.com/reading-files-using-the-html5-filereader-api
//https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/

import React from 'react'
import { connect } from 'react-redux'
import exampleFileNames from '../../lib/exampleFileNames.json'
import { addPlanToList } from '../../redux/ducksCommon'
import { importPlanAllSlices } from '../../redux'
import './styles.css'

class Import extends React.Component {
  constructor(props) {
    super(props)
    this.callRedux = this.callRedux.bind(this)
    this.preventDefaults = this.preventDefaults.bind(this)
    this.highlight = this.highlight.bind(this)
    this.unhighlight = this.unhighlight.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.fileInput = null
    this.fileDisplayArea = null
    this.dropArea = null
  }

  dupName(planName) {
    // test for unique name
    var dupNames = this.props.plansList.filter((name, index) => {
      return name === planName
    })
    if (dupNames && dupNames.length > 0) {
      return true // A dup name was found: dupName[0])
    }
    return false
  }
  exampleName(planName) {
    // test for use of example plan name
    const nameLower = planName.toLowerCase()
    var exampleNames = exampleFileNames[0].fileNames.filter((name, index) => {
      return name === nameLower
    })
    if (exampleNames && exampleNames.length > 0) {
      return true // An  example file name was found
    }
    return false
  }

  callRedux(planName, planFileData) {
    // debugger
    this.props.dispatch(importPlanAllSlices(planName, planFileData))
    this.props.dispatch(addPlanToList(planName)) // add plan name to plansList array
    this.props.history.push('/forecaster') // shows the imported plan
  }
  preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }
  highlight(e) {
    this.dropArea.classList.add('highlight')
  }
  unhighlight(e) {
    this.dropArea.classList.remove('highlight')
  }

  componentDidMount() {
    this.fileInput = document.getElementById('fileInput')
    this.fileDisplayArea = document.getElementById('fileDisplayArea')
    this.dropArea = document.getElementById('drop-area')

    let events = ['dragenter', 'dragover', 'dragleave', 'drop']
    events.forEach((eventName) => {
      this.dropArea.addEventListener(eventName, this.preventDefaults, false)
    })
    this.dropArea.addEventListener('dragenter', this.highlight, false)
    this.dropArea.addEventListener('dragover', this.highlight, false)
    this.dropArea.addEventListener('dragleave', this.unhighlight, false)
    this.dropArea.addEventListener('drop', this.unhighlight, false)
    this.dropArea.addEventListener('drop', this.handleDrop, false)
  }

  componentWillUnmount() {
    let events = ['dragenter', 'dragover', 'dragleave', 'drop']
    events.forEach((eventName) => {
      this.dropArea.removeEventListener(eventName, this.preventDefaults, false)
    })
    this.dropArea.removeEventListener('dragenter', this.highlight, false)
    this.dropArea.removeEventListener('dragover', this.highlight, false)
    this.dropArea.removeEventListener('dragleave', this.unhighlight, false)
    this.dropArea.removeEventListener('drop', this.unhighlight, false)
    this.dropArea.removeEventListener('drop', this.handleDrop, false)
  }

  handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files
    let filesArray = [...files]
    let file = filesArray[0]
    this.handleImport(file)
  }

  handleChange(e) {
    e.preventDefault()
    e.stopPropagation()
    let file = this.fileInput.files[0]
    this.handleImport(file)
  }

  handleImport(file) {
    let reader = new FileReader()
    let planName = file.name
    this.fileDisplayArea.innerText = ''
    if (planName.includes('.frc') || planName.includes('.mpx')) {
      planName = planName.slice(0, -4)
      if (this.dupName(planName) || this.exampleName(planName)) {
        this.fileDisplayArea.innerText = 'A plan file with that name already exists.'
      } else {
        reader.onload = (e) => {
          let planFileData = reader.result
          // this.fileDisplayArea.innerText = planFileData
          let formatXML = /^PD94/.test(planFileData) //this input is base64 encoded XML characters: the legacy file format
          let formatJSON = /^eyJm/.test(planFileData) //this input is base64 encoded json characters: the new file format
          if (formatXML || formatJSON) {
            // is valid file data
            this.callRedux(planName, planFileData)
          } else {
            this.fileDisplayArea.innerText = 'The plan file is not a valid data format.'
          }
        }
        reader.readAsText(file) //start the async i/o to read the file data
      }
    } else {
      this.fileDisplayArea.innerText = 'Plan is not a MoneyPlan file (*.mpx *.frc)'
    }
  }

  render() {
    return (
      <div id="page-wrapper">
        <h1>Import A Plan</h1>
        <h4>Click the button or drag and drop onto the dashed region.</h4>

        <div id="filePicker">
          <input type="file" id="fileInput" onChange={this.handleChange} />
          <label id="fileInputLabel" className="button" htmlFor="fileInput">
            Choose File
          </label>
        </div>

        {/* <div id="input-wrapper">
          <h4>Select a plan:</h4>
          <input type="file" id="fileInput" onChange={this.handleChange} />
          <label className="button" htmlFor="fileInput">
            Choose File
          </label>
        </div> */}

        <div id="drop-area">
          <form className="my-form">
            <input type="file" id="fileElem" accept="text/*" />
            {/* <label className="button" htmlFor="fileElem">
              Select File
            </label> */}
          </form>
        </div>
        <pre id="fileDisplayArea" />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const props = {
    planName: state.files.planName,
    planObject: state.files.planObject,
    plansList: state.common.plansList,
  }
  return props
}

export default connect(mapStateToProps)(Import)

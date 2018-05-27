// FilePanel
// Presents a list of plan names for user selection.
// The selected file name is passed back to FileList where
// the file data is collected for processing.

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import uuidv4 from 'uuid/v4'
import withSizes from 'react-sizes'
import Dropdown from 'rc-dropdown'
import Menu, { Item as MenuItem } from 'rc-menu'
import 'rc-dropdown/assets/index.css'
import * as Icons from '../../../lib/IconsLookup.js'
import appScrollbarWidth from '../../../lib/appScrollbarWidth.js'
import './styles.css'
// ****See: https://github.com/react-component/dropdown **
// ****See: https://github.com/react-component/menu **

class FilePanel extends Component {
  constructor(props) {
    super(props)
    this.exampleNames = this.props.exampleNames
    this.handlePlanClick = this.props.handlePlanClick
    this.handleExampleClick = this.props.handleExampleClick
    this.handleDropdownClick = this.props.handleDropdownClick
    this.windowHeight = null //waiting for render
    this.dropdownPlanName = null
  }

  setRenderWindowHeight(windowHeight) {
    this.windowHeight = windowHeight
    this.adjustElementHeight(windowHeight)
  }

  adjustElementHeight(windowHeight) {
    if (this.componentMounted) {
      //   let elem = document.getElementById('filepanel-container')
      //   let style = window.getComputedStyle(elem)
      //   let gridTemplateColumns = style.gridTemplateColumns //note style name's change from shiskabab to camelCase
      //   let columnCount = gridTemplateColumns.split(' ').length //use this to change toolbar design for different container sizes
      const magicnumber = 74 //this is the window height space not used by the FilePanelContainer
      let FilePanelHost = document.getElementById('filepanel-host')
      let FilePanelContainer = document.getElementById('filepanel-container')
      let FilePanelContainerHeight = windowHeight - magicnumber
      FilePanelHost.style.height = FilePanelContainerHeight - 60 + 'px' //keeps host height less than container
      FilePanelContainer.style.height = FilePanelContainerHeight + 'px' // this is the adjustment as user resizes window
    }
  }

  componentDidMount() {
    this.componentMounted = true
    this.adjustElementHeight(this.windowHeight)
    this.scrollbarWidth = appScrollbarWidth()
    window.scrollTo(0, 0)
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.plansList !== nextProps.plansList) {
  //     const userPlaceNames = ['User plan name1', 'User plan name2', 'User plan name3', 'User plan name4']
  //     this.userPlanNames = this.userPlanNames.concat(userPlaceNames)
  //   }
  // }

  componentDidUpdate() {
    this.adjustElementHeight(this.windowHeight)
  }

  handlePlanMenuClick = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    this.dropdownPlanName = evt.currentTarget.id
  }

  // ****This section below supports the 'rc-dropdown' and 'rc-menu' usage **
  onSelect = ({ key }) => {
    // const notice = {
    //   key: `${key}`,
    //   name: `${this.dropdownPlanName}`,
    // }
    if (key.toLowerCase() === 'delete') {
      this.handleDropdownClick(null, this.dropdownPlanName, 'delete')
    }
    if (key.toLowerCase() === 'export') {
      this.handleDropdownClick(null, this.dropdownPlanName, 'export')
    }
    this.onVisibleChange(false)
  }
  onVisibleChange = (visible) => {
    // const rowNameId = this.dropdownPlanName.replace(/[\W_]/g, '')
    const rowNameId = this.dropdownPlanName
    let nameElement = document.getElementById(rowNameId)
    nameElement.className = visible ? 'branchTextSelected' : 'branchText'
  }
  // ****This section above supports the 'rc-dropdown' and 'rc-menu' usage **

  render() {
    this.setRenderWindowHeight(this.props.height)

    // TEMP FOR TESTING
    // const userPlaceNames = ['User plan name1', 'User plan name2', 'User plan name3', 'User plan name4']
    // this.userPlanNames = this.userPlanNames.concat(userPlaceNames)

    // ****This section below supports the 'rc-dropdown' and 'rc-menu' usage **
    const menu = (
      <Menu onSelect={this.onSelect} style={{ width: 90 }}>
        <MenuItem className="menuItem" key={'Delete'}>
          Delete
        </MenuItem>
        {/* <MenuItem className="menuItem" key={'Sort'} disabled>
          Sort
        </MenuItem> */}
        <MenuItem className="menuItem" key={'Export'}>
          Export
        </MenuItem>
      </Menu>
    )
    // ****This section above supports the 'rc-dropdown' and 'rc-menu' usage **

    const userPlanNameRows = this.props.plansList.map((name, index) => {
      return (
        <li key={uuidv4()} className="userPlanNameRow" tabIndex="0">
          <span>
            <a onClick={this.handlePlanClick(name)}>
              <img src={Icons['blueduck']} className="userPlanNameRowImage" alt="" width={20} height={20} />
              <span id={name} className="branchText">
                {name}
              </span>
            </a>
          </span>
          <Dropdown trigger={['click']} onVisibleChange={this.onVisibleChange} overlay={menu}>
            <img id={name} onClick={this.handlePlanMenuClick} src={Icons['menuvertical']} className={'userRowMenuIcon'} alt="" width={20} height={20} />
          </Dropdown>
        </li>
      )
    })

    const exampleNameRows = this.exampleNames.map((name, index) => {
      return (
        <li key={uuidv4()} tabIndex="0">
          {/* <span className="button  center_tree-instruction" /> */}
          <a onClick={this.handleExampleClick(name)}>
            <img src={Icons['newplan']} className="userPlanNameRowImage" alt="" width={16} height={16} />
            <span className="branchText">{name}</span>
          </a>
        </li>
      )
    })

    const currentPlanName = this.props.planName

    return (
      <div id="filepanel-host">
        <div id="filepanel-container">
          <div id="filepanel-layout">
            <div className="userplans-header">
              <span>
                Your Plans - Opened: {currentPlanName} {this.props.dirty ? '*' : null}
              </span>
            </div>
            <div id="userPlans" className="userplans-box">
              <ul id={'userPlanNameRows'} className={'namerow'}>
                {userPlanNameRows}
              </ul>
            </div>
            <div className="exampleplans-header">
              <span>Example Plans</span>
            </div>
            <div id="examplePlans" className="exampleplans-box">
              <ul id={'exampleNameRows'} className={'namerow'}>
                {exampleNameRows}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FilePanel.propTypes = {
  dirty: PropTypes.bool,
  planName: PropTypes.string,
  plansList: PropTypes.array,
  handlePlanClick: PropTypes.func,
  handleExampleClick: PropTypes.func,
  handleDropdownClick: PropTypes.func,
}

const mapSizesToProps = ({ height, width }) => ({
  height: height,
  width: width,
})

// withSizes is used as a HOC to supply window demensions as a prop item to FilePanel
// https://www.npmjs.com/package/react-sizes
export default withSizes(mapSizesToProps)(FilePanel)

// PlanView

// Setup the Grid Layout with element sizing, and the PlanView edit toolbar

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withSizes from 'react-sizes'
import PlanTree from '../PlanTree'
import PlanGrid from '../PlanGrid'
import PlanToolbar from './PlanToolbar'
import appScrollbarWidth from './../../../lib/appScrollbarWidth.js'
import './styles.css'

class PlanView extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.props.handleClick
    this.windowHeight = 0 //waiting for render
    this.adjustElementHeightCount = 0 //for testing
  }

  setRenderWindowHeight(windowHeight) {
    this.windowHeight = windowHeight
    this.adjustElementHeight(windowHeight)
  }

  adjustElementHeight(windowHeight) {
    this.adjustElementHeightCount += 1
    // console.log(`adjustElementHeight(${this.adjustElementHeightCount}): height=${windowHeight} componentDidMount=${this.componentMounted}`)
    if (this.componentMounted) {
      // Use the columnCount as indicator to change toolbar design for different container sizes
      // let elem = document.getElementById('planview-container');
      // let style = window.getComputedStyle(elem);
      // let gridTemplateColumns = style.gridTemplateColumns; //note style neme's change from shiskabab to camelCase
      // let columnCount = gridTemplateColumns.split(" ").length; //use this to change toolbar design for different container sizes
      const magicnumber = 150 //this is the window height space not used by the planviewContainer

      let planviewHost = document.getElementById('planview-host')
      let planviewContainer = document.getElementById('planview-container')
      let planviewContainerHeight = windowHeight - magicnumber
      planviewHost.style.height = planviewContainerHeight - 60 + 'px'
      planviewContainer.style.height = planviewContainerHeight + 'px'
    }
  }

  componentDidMount() {
    // console.log(`componentDidMount: height=${this.windowHeight}`)
    document.body.setAttribute('style', 'padding-left:0') /*restore after Charts added padding to match right side scrollbar width*/
    this.componentMounted = true
    this.adjustElementHeight(this.windowHeight)
    this.scrollbarWidth = appScrollbarWidth()
    window.scrollTo(0, 0)
    // For testing...
    // var sw = window.screen.width;
    // var sh = window.screen.height;
    // var cw = document.body.clientWidth;
    // var ch = document.body.clientHeight;
    // var iw = window.innerWidth;
    // var ih = window.innerHeight;
    // var ow = window.outerWidth;
    // var oh = window.outerHeight;
    // const msg=(`sw=${sw} sh=${sh} iw=${iw} ih=${ih} ow=${ow} oh=${oh} cw=${cw} ch=${ch}`)
    // console.log(msg)
    // alert(msg)
    // https://stackoverflow.com/questions/16162639/difference-between-screen-and-window-property
  }

  componentDidUpdate() {
    // console.log(`componentDidUpdate: height=${this.windowHeight}`)
    this.adjustElementHeight(this.windowHeight)
  }

  render() {
    // console.log(`Render: height=${this.props.height} width=${this.props.width}`)
    // console.log("height=" + this.props.height + " width=" + this.props.width)
    this.setRenderWindowHeight(this.props.height)

    let dataStore = this.props.dataStore

    return (
      <div id="planview-host">
        <div id="planview-container">
          <div className="planview-toolbar-box">
            <div className={'planview-toolbar'}>
              <PlanToolbar dataStore={dataStore} handleClick={this.handleClick} />
            </div>
          </div>
          <div id="datatreebox" className="datatree-box">
            <PlanTree dataStore={dataStore} handleClick={this.handleClick} />
          </div>
          <div className="datagrid-box">
            <PlanGrid dataStore={dataStore} />
          </div>
        </div>
      </div>
    )
  }
}
PlanView.propTypes = {
  dataStore: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
}

const mapSizesToProps = ({ height, width }) => ({
  height: height,
  width: width,
})

// withSizes is used as a HOC to supply window demensions as a prop item to PlanView
// https://www.npmjs.com/package/react-sizes
export default withSizes(mapSizesToProps)(PlanView)

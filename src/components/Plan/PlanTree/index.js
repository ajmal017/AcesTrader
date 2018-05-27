// PlanTree

// Build the plan's tree view from the current store object model

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import uuidv4 from 'uuid/v4'
import getInstructionLabelText from './getInstructionLabelText'
import ducklogo from '../../../images/duck.svg'
import treelogo from '../../../images/treelogo.svg'
import { objectQuery } from '../../../lib/navigateBreadCrumbs'
import './styles.css'
var FOBJ = require('../../../lib/fobj') //gets the static object of constants

// ******************************
// Entry point with the state and callback
// ******************************

const PlanTree = (props) => {
  'use-strict'

  // const handleClick = (evt, flag, breadcrumbs, breadcrumbsParent) => {
  //   props.handleClick(null, flag, breadcrumbs, breadcrumbsParent)
  // }
  let handleClick = props.handleClick

  let dataStore = props.dataStore

  const examplePath = 'forecaster.meta.examplefile'
  const treeLogoPath = 'forecaster.meta.treelogotag'

  let isExamplePlan = objectQuery(examplePath, dataStore.planObject)
  let treeLogoTag = objectQuery(treeLogoPath, dataStore.planObject)

  return (
    <div id="datatree-content" className="datatree-content">
      <div id={'treelogo'}>
        <TreeLogo treelogotag={treeLogoTag} isExample={isExamplePlan} />
      </div>
      <ULRoot dataStore={dataStore} handleClick={handleClick} />
    </div>
  )
}
PlanTree.propTypes = {
  dataStore: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
}

const ULRoot = (props) => {
  let handleClick = props.handleClick
  let dataStore = props.dataStore
  let selectedTreeNode = dataStore.selectedTreeNode
  let planObject = dataStore.planObject
  let currentObject = planObject.forecaster //the current parent object

  //Create an array of component objects, one for each level0 child.
  //Return the array of child components to render their LI's
  //within a containing UL element that is established here.

  let objectKeys = Object.keys(currentObject) //keys of level0 child objects

  //This little hack is to enforce my desire to have "Plan Parameters"
  //be placed at the bottom of the plan tree view. No matter how
  //I try to organize the actual plan object model, it doesn't work.
  //So here I rearrange the list of keys that control the sequence
  //of building the plan tree nodes.
  //Also I remove the "meta" key which is not part of the plan tree nodes
  let testString = objectKeys.join('.')
  if (testString.includes('meta.')) {
    testString = testString.replace('meta.', '') //this property is not part of the plan tree view
  }
  if (testString.includes('breadcrumbs.')) {
    testString = testString.replace('breadcrumbs.', '') //this property is not part of the plan tree view
  }
  if (testString.includes('parameters.')) {
    let newstr = testString.replace('parameters.', '')
    objectKeys = newstr.split('.')
    objectKeys.push('parameters')
  }

  let outArray = objectKeys.map((key, index) => {
    if (!(typeof currentObject[key] === 'object' && key !== 'assignedsourceranks')) {
      return null //not a child object
    }
    //prepare the parameters for use by each level0 component
    let levelParameters = {
      selectedTreeNode: selectedTreeNode,
      planObject: planObject,
      handleClick: handleClick,
      nodeText: FOBJ[key], //replace with an expanded name
      breadcrumbsParent: 'forecaster',
      breadcrumbs: 'forecaster.' + key, //the path to this level0 object
      currentObject: currentObject[key], //this level0 object
      isLastChild: index === objectKeys.length - 1 ? true : null, //flags the last level0 object
    }
    //Add this child to level0
    return <CollectionObjectLevel0 key={uuidv4()} levelParameters={levelParameters} />
  })
  return (
    <ul id={'tree'} className={'xtree'}>
      {outArray}
    </ul>
  )
}
ULRoot.propTypes = {
  dataStore: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
}

// ******************************
// Render a Level0 collection object here
// using the currentObject passed in as the object.
// This object will be rendered as a LI element.
// Any children render their own container UL element.
// ******************************
class CollectionObjectLevel0 extends Component {
  constructor(props) {
    super(props)
    this.handleClick = props.levelParameters.handleClick //report back
    this.state = {
      closed: false,
    }
  }
  render() {
    const handleClick = (flag) => (evt) => {
      evt.preventDefault()
      evt.stopPropagation()
      if (flag === 'toggle') {
        // change this parent node to selected only if your child is now selected
        if (selectedTreeNode.includes(breadcrumbs)) {
          this.handleClick(null, 'selectnode', breadcrumbs, breadcrumbsParent)
        }
        this.setState((prevState, props) => ({ closed: !prevState.closed }))
      } else if (flag === 'selectnode') {
        this.handleClick(evt, flag, breadcrumbs, breadcrumbsParent)
      }
    }

    let selectedTreeNode = this.props.levelParameters.selectedTreeNode
    let planObject = this.props.levelParameters.planObject //the plan root object
    let nodeText = this.props.levelParameters.nodeText //name of this level0 child object
    let breadcrumbs = this.props.levelParameters.breadcrumbs //pointing to this level0 child object
    let breadcrumbsParent = this.props.levelParameters.breadcrumbsParent //pointing back to parent
    let currentObject = this.props.levelParameters.currentObject //this level0 child object
    let isLastChild = this.props.levelParameters.isLastChild //flags the last level0 child object

    // Get the presentation data of this currentObject
    let isClosed = this.state.closed
    let isSelected = breadcrumbs === selectedTreeNode ? true : null
    let selectedClass = isSelected ? 'curSelectedNode' : null
    let switchClass
    let ulClass
    let ownChildCount

    // Developer's test.
    if (currentObject.breadcrumbs !== breadcrumbs) {
      if (process.env.NODE_ENV === 'development') {
        debugger
      } //developer testing
    }

    // At this level0 parent object, there should be zero or one child object in the store's model plan object.
    // If one is present, it is an array of objects representing the child tree nodes.
    // For each child, construct a component to render it as a Level1 component.

    // Render this object as a Level0 component
    let theCurrentObject = currentObject //this level0 object

    let objectKeys = Object.keys(theCurrentObject) //keys of child objects
    let childKeys = objectKeys.filter(function(key) {
      //get just the tree node child object keys
      return typeof theCurrentObject[key] === 'object' && key !== 'assignedsourceranks'
    })

    let outArray //to hold the child components
    if (childKeys.length === 0) {
      ownChildCount = 0
      outArray = [] //no level1 children for this parent
    } else {
      childKeys.map((key, index) => {
        //no childKeys output array needed
        let currentObject = theCurrentObject[key] //a child object
        ownChildCount = currentObject.length
        outArray = currentObject.map((obj, index) => {
          let nodeText
          // Prepare the parameters for use by this one of multiple level1 child components
          if (breadcrumbs.includes('parameters')) {
            //special node leaf
            nodeText = 'Plan Parameters'
          } else {
            nodeText = obj.title ? obj.title : null
          }
          let levelParameters = {
            selectedTreeNode: selectedTreeNode,
            planObject: planObject,
            handleClick: this.handleClick,
            breadcrumbsParent: breadcrumbs + '.' + key,
            breadcrumbs: breadcrumbs + '.' + key + '.' + index,
            currentObject: obj,
            nodeText: nodeText,
            isLastChild: index === currentObject.length - 1 ? true : null, //flags the last level1 child object
          }

          // Add this child to the next child at level1
          return <CollectionObjectLevel1 key={uuidv4()} levelParameters={levelParameters} />
        })
        return null
      })
    }
    // Determine the CSS classNames for styling of the visual connections between tree nodes
    if (ownChildCount > 0) {
      //there is a toggle switch for this component
      if (isLastChild) {
        //use a bottom connection
        switchClass = isClosed ? 'button switch bottom_closed' : 'button switch bottom_opened'
      } else {
        switchClass = isClosed ? 'button switch center_closed' : 'button switch center_opened'
      }
    } else {
      switchClass = isLastChild ? 'button switch bottom_docu' : 'button switch center_docu'
    }
    isLastChild ? (ulClass = null) : (ulClass = 'line')

    // Build this level0 tree node plus its associated child nodes
    return (
      <div>
        <li id="tree_0" className="level-0" tabIndex="0">
          <span id="tree_0_switch" className={switchClass} onClick={handleClick('toggle')} />
          <a id="tree_0_a" className={selectedClass} onClick={handleClick('selectnode')}>
            <span id="tree_0_ico" className="button icon center_tree-cards" />
            <span id="tree_0_span" className="branchText">
              {nodeText}
            </span>
          </a>

          {!isClosed ? (
            outArray ? (
              <ul id="tree_0_ul" className={ulClass} style={{ display: 'block' }}>
                {outArray}
              </ul>
            ) : null
          ) : null}
        </li>
      </div>
    )
  }
}
CollectionObjectLevel0.propTypes = {
  levelParameters: PropTypes.object.isRequired,
}

// ******************************
// Instantiate a Level1 collection item here
// using the currentObject passed in as the object.
// This object can be a single child or one of many children of its parent.
// This object can have zero or more child objects.
// This object will be rendered as a LI element.
// Any children render their own container UL element.
// ******************************
class CollectionObjectLevel1 extends Component {
  constructor(props) {
    super(props)
    this.handleClick = props.levelParameters.handleClick //report back
    this.state = {
      closed: false,
    }
  }

  render() {
    const handleClick = (flag) => (evt) => {
      evt.preventDefault()
      evt.stopPropagation()
      if (flag === 'toggle') {
        // change selected only if your child is selected
        if (selectedTreeNode.includes(breadcrumbs)) {
          this.handleClick(null, 'selectnode', breadcrumbs, breadcrumbsParent)
        }
        this.setState((prevState, props) => ({ closed: !prevState.closed }))
      } else if (flag === 'selectnode') {
        this.handleClick(evt, flag, breadcrumbs, breadcrumbsParent) //report back
      }
    }
    let selectedTreeNode = this.props.levelParameters.selectedTreeNode
    let planObject = this.props.levelParameters.planObject //the plan root
    let breadcrumbs = this.props.levelParameters.breadcrumbs //pointing to this level1 child object
    let breadcrumbsParent = this.props.levelParameters.breadcrumbsParent //pointing back to parent
    let currentObject = this.props.levelParameters.currentObject //this level1 object
    let nodeText = this.props.levelParameters.nodeText
    let isLastChild = this.props.levelParameters.isLastChild //flags the last level1 object

    // Get the current presentation data of this currentObject
    nodeText = nodeText ? nodeText : null
    let isClosed = this.state.closed
    let isSelected = breadcrumbs === selectedTreeNode ? true : null
    let selectedClass = isSelected ? 'curSelectedNode' : null
    let switchClass
    let ulClass
    let ownChildCount

    // Render this object as a Level1 component
    let theCurrentObject = currentObject //this level1 object

    // For level1, there is one level2 child object for each instruction collection present
    let objectKeys = Object.keys(theCurrentObject) //keys of object's properties including child objects
    let childKeys = objectKeys.filter(function(key) {
      //get just the tree node child object keys
      return typeof theCurrentObject[key] === 'object' && key !== 'assignedsourceranks' && key !== 'ObjectType'
    })

    let outArray //to hold the level2 child components
    if (childKeys.length === 0) {
      ownChildCount = 0
      outArray = [] //no level2 children for this parent
    } else {
      ownChildCount = childKeys.length
      outArray = childKeys.map((key, index) => {
        let keyText = `${key.substring(0, 1).toUpperCase()}${key.substring(1)}` //capitalized key for the level2 label
        //special case key name is representing two words
        keyText = keyText.replace(/Parameterchange/i, 'Parameter Change') //handles singulat or plural
        let currentObject = theCurrentObject[key] //a child object with a property which is a named array
        //prepare the parameters for use by the level2 component
        let levelParameters = {
          selectedTreeNode: selectedTreeNode,
          planObject: planObject,
          handleClick: this.handleClick,
          breadcrumbsParent: breadcrumbs,
          breadcrumbs: breadcrumbs + '.' + key, //the path to this child object
          currentObject: currentObject, //this level2 child object
          nodeText: keyText, //use the level2 child's capitalized key for the level2 label
          // childCount: ownChildCount, //number of level2 child objects
          isLastChild: index === ownChildCount - 1 ? true : null, //flags the last level1 child object
        }
        //Add this child to the next child level at level1
        return <CollectionObjectLevel2 key={uuidv4()} levelParameters={levelParameters} />
      })
    }

    // Determine the CSS className for styling of the visual connections between tree nodes
    if (ownChildCount > 0) {
      //there is a toggle switch for this component
      if (isLastChild) {
        //use a bottom connection
        switchClass = isClosed ? 'button switch bottom_closed' : 'button switch bottom_opened'
      } else {
        switchClass = isClosed ? 'button switch center_closed' : 'button switch center_opened'
      }
    } else {
      switchClass = isLastChild ? 'button switch bottom_docu' : 'button switch center_docu'
    }
    isLastChild ? (ulClass = null) : (ulClass = 'line')

    return (
      <div>
        <li id="tree_1" className="level-1" tabIndex="0">
          <span id="tree_1_switch" className={switchClass} onClick={handleClick('toggle')} />
          <a id="tree_1_a" className={selectedClass} onClick={handleClick('selectnode')}>
            <span id="tree_1_ico" className="button icon center_tree-card" />
            <span id="tree_1_span" className="branchText">
              {nodeText}
            </span>
          </a>

          {!isClosed ? (
            outArray ? (
              <ul id="tree_1_ul" className={ulClass} style={{ display: 'block' }}>
                {outArray}
              </ul>
            ) : null
          ) : null}
        </li>
      </div>
    )
  }
}
CollectionObjectLevel1.propTypes = {
  levelParameters: PropTypes.object.isRequired,
}

// ******************************
// Instantiate a Level2 collection item here
// using the currentObject passed in as the object.
// This object can be a single child or one of many children of its parent.
// This object can have zero or more child objects.
// This object will be rendered as a LI element.
// Any children render their own container UL element.
// ******************************
class CollectionObjectLevel2 extends Component {
  constructor(props) {
    super(props)
    this.handleClick = props.levelParameters.handleClick //report back
    this.state = {
      closed: false,
    }
  }
  render() {
    const handleClick = (flag) => (evt) => {
      evt.preventDefault()
      evt.stopPropagation()
      if (flag === 'toggle') {
        // change selected only if your child is selected
        if (selectedTreeNode.includes(breadcrumbs)) {
          this.handleClick(null, 'selectnode', breadcrumbs, breadcrumbsParent)
        }
        this.setState((prevState, props) => ({ closed: !prevState.closed }))
      } else if (flag === 'selectnode') {
        this.handleClick(evt, flag, breadcrumbs, breadcrumbsParent) //report back
      }
    }

    let selectedTreeNode = this.props.levelParameters.selectedTreeNode
    let planObject = this.props.levelParameters.planObject //the plan root object
    let breadcrumbs = this.props.levelParameters.breadcrumbs //pointing to this Level2 child object
    let breadcrumbsParent = this.props.levelParameters.breadcrumbsParent //pointing back to parent
    let currentObject = this.props.levelParameters.currentObject //this Level2 object
    let nodeText = this.props.levelParameters.nodeText
    let isLastChild = this.props.levelParameters.isLastChild //flags the last Level2 object

    // Get the current presentation data of this currentObject
    nodeText = nodeText ? nodeText : null
    let isClosed = this.state.closed
    let isSelected = breadcrumbs === selectedTreeNode ? true : null
    let selectedClass = isSelected ? 'curSelectedNode' : null
    let ulClass
    let switchClass
    let ownChildCount = 1 //until updated below

    // Render this object as a Level2 component
    // For Level2, there is one child object for each instruction present
    // That child object is an array of level3 objects
    let theCurrentObject = currentObject

    let objectKeys = Object.keys(theCurrentObject) //keys of object's properties including child objects
    let childKeys = objectKeys.filter(function(key) {
      //get just the tree node child object keys
      return typeof theCurrentObject[key] === 'object' && key !== 'assignedsourceranks' && key !== 'ObjectType'
    })

    let outArray = [] //to hold the level3 child components, each being an instruction object
    if (childKeys.length === 0) {
      ownChildCount = 0
      outArray = [] //no Level3 children for this parent
    } else {
      let childKey = childKeys[0]
      let childArray = theCurrentObject[childKey] //get to the array of child objects
      ownChildCount = childArray.length
      outArray = childArray.map((obj, index) => {
        //prepare the parameters for use by the Level3 component
        let levelParameters = {
          selectedTreeNode: selectedTreeNode,
          planObject: planObject,
          handleClick: this.handleClick,
          breadcrumbsParent: breadcrumbs + '.' + childKey,
          breadcrumbs: breadcrumbs + '.' + childKey + '.' + index, //add the index into this key's child array
          currentObject: obj, //this Level3 child object
          nodeText: getInstructionLabelText(obj, obj.breadcrumbs), //get the Level3 child's label text
          isLastChild: index === ownChildCount - 1 ? true : null, //flags the last Level2 child object
        }
        //Add this child to the next child level at Level2
        return <CollectionObjectLevel3 key={uuidv4()} levelParameters={levelParameters} />
      })

      // Determine the CSS className for styling of the visual connections between tree nodes
      if (ownChildCount > 0) {
        //there is a toggle switch for this component
        if (isLastChild) {
          //use a bottom connection
          switchClass = isClosed ? 'button switch bottom_closed' : 'button switch bottom_opened'
        } else {
          switchClass = isClosed ? 'button switch center_closed' : 'button switch center_opened'
        }
      } else {
        switchClass = isLastChild ? 'button switch bottom_docu' : 'button switch center_docu'
      }
      isLastChild ? (ulClass = null) : (ulClass = 'line')

      return (
        <div>
          <li id="tree_2" className="level-2" tabIndex="0">
            <span id="tree_2_switch" className={switchClass} onClick={handleClick('toggle')} />
            <a id="tree_2_a" className={selectedClass} onClick={handleClick('selectnode')}>
              <span id="tree_2_ico" className="button icon center_tree-instructions" />
              <span id="tree_2_span" className="branchText">
                {nodeText}
              </span>
            </a>

            {!isClosed ? (
              outArray ? (
                <ul id="tree_2_ul" className={ulClass} style={{ display: 'block' }}>
                  {outArray}
                </ul>
              ) : null
            ) : null}
          </li>
        </div>
      )
    }
  }
}
CollectionObjectLevel2.propTypes = {
  levelParameters: PropTypes.object,
}

// ******************************
// Instantiate a Level3 collection item here
// using the currentObject passed in as the object.
// This object can be a single child or one of many children of its parent.
// This object has zero child objects.
// This object will be rendered as a LI element.
// ******************************
class CollectionObjectLevel3 extends Component {
  constructor(props) {
    super(props)
    this.handleClick = props.levelParameters.handleClick //report back
  }

  render() {
    const handleClick = (flag) => (evt) => {
      evt.preventDefault()
      evt.stopPropagation()
      if (flag === 'selectnode' || flag === 'toggledisable') {
        this.handleClick(evt, flag, breadcrumbs, breadcrumbsParent) //report back
      }
    }
    let currentObject = this.props.levelParameters.currentObject
    let selectedTreeNode = this.props.levelParameters.selectedTreeNode
    let breadcrumbs = this.props.levelParameters.breadcrumbs //pointing to this Level3 child object
    let breadcrumbsParent = this.props.levelParameters.breadcrumbsParent //pointing back to parent
    let nodeText = this.props.levelParameters.nodeText
    let ignoreNow = currentObject.ignorenow
    let isLastChild = this.props.levelParameters.isLastChild //flags the last Level3 child object
    // Get the current presentation data of this currentObject
    nodeText = nodeText ? nodeText : null //replace undefined
    let isSelected = breadcrumbs === selectedTreeNode ? true : null
    let selectedClass = isSelected ? 'curSelectedNode' : null
    // Determine the CSS className for styling of the visual connections between tree nodes
    let switchClass = isLastChild ? 'button switch bottom_docu' : 'button switch center_docu'
    // Determine the CSS className for styling the instrucion tree node
    let toggleClass = ignoreNow ? 'button icon tree-toggle-off' : 'button icon tree-toggle-on'
    let textClass = ignoreNow ? 'branchTextIgnore' : 'branchText'
    return (
      <div>
        <li id="tree_3" className="level-3" tabIndex="0">
          <span id="tree_3_switch" className={switchClass} onClick={handleClick('toggle')} />
          <a id="tree_3_a" className={selectedClass} onClick={handleClick('selectnode')}>
            <span id="tree_3_ico" className={toggleClass} onClick={handleClick('toggledisable')} />
            <span id="tree_3_span" className={textClass}>
              {nodeText}
            </span>
          </a>
        </li>
      </div>
    )
  }
}
CollectionObjectLevel3.propTypes = {
  levelParameters: PropTypes.object.isRequired,
}

const TreeLogo = (props) => {
  //The treeLogoTag is added to the plan's object when saved.
  //At this time the user is known by the signin parameters
  //and the information is available in the user's DB data.
  //The embedded tree view logo is added to the MoneyPlan
  //web app code after review and approval by MoneyPlan staff.
  //The tag selects which embedded tree view logo to render.

  //TODO add code support for this feature for user branding with selected logo

  let treeLogoTag = props.treeLogoTag
  let isExample = props.isExample
  treeLogoTag = treeLogoTag || 'moneyplanexample' //default result until coding done
  let treeLogoText = 'MoneyPlan' + (isExample ? ' Example' : '')

  if (treeLogoTag === 'moneyplanexample') {
    return (
      <div>
        <img id={'duck-icon'} src={ducklogo} alt={'Logo'} width={'24'} />
        <span className="logo-text">{treeLogoText}</span>
      </div>
    )
  } else {
    return (
      <div>
        <img id={'tree-icon'} src={treelogo} alt={'Logo'} width={'26'} />
        <span className="logo-text">MoneyPlan</span>
      </div>
    )
  }
}
TreeLogo.propTypes = {
  treeLogoTag: PropTypes.string,
}

export default PlanTree

// ManageSellProspects/index.jsimport React, { Component } from 'react'

import React, { Component } from 'react'
import ManageProspects from '../ManageProspects'

class ManageSellProspects extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  // handle callbacks from child components
  handleClick(flag, target) {
    if (flag === 'push') {
      this.props.history.push(target)
    }
  }

  render() {
    return <ManageProspects tradeSide={'Sells'} handleClick={this.handleClick} />
  }
}

export default ManageSellProspects

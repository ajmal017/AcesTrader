import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import './styles.css'

// class Appnav extends Component {
const Appnav = function() {
  return (
    <div>
      <Navbar className="navbar-fixed" inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to="/home">
              <NavItem eventKey={0}>
                <span className="navbar-logo">AcesTrader</span>
              </NavItem>
            </LinkContainer>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/positions">
              <NavItem eventKey={4}>Positions</NavItem>
            </LinkContainer>

            <LinkContainer to="/potentials">
              <NavItem eventKey={4}>Potentials</NavItem>
            </LinkContainer>

            <LinkContainer to="/executions">
              <NavItem eventKey={4}>Executions</NavItem>
            </LinkContainer>

            <NavDropdown eventKey={5} title="Tools" id="5-basic-nav-dropdown">
              <LinkContainer to="/managelists">
                <MenuItem eventKey={5.0}>Manage WatchList</MenuItem>
              </LinkContainer>
              <LinkContainer to="/requesttrace">
                <MenuItem eventKey={5.1}>Request Trace...</MenuItem>
              </LinkContainer>
              <LinkContainer to="/readtracelog">
                <MenuItem eventKey={5.2} disabled={true}>
                  Read Trace Log
                </MenuItem>
              </LinkContainer>
              <MenuItem divider />
              <LinkContainer to="/readerrorlog">
                <MenuItem eventKey={5.3} disabled={true}>
                  Read Error Log
                </MenuItem>
              </LinkContainer>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
export default Appnav

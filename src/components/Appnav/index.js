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
            <LinkContainer to="/alerts">
              <NavItem eventKey={3}>Alerts</NavItem>
            </LinkContainer>

            <LinkContainer to="/positions">
              <NavItem eventKey={4}>Positions</NavItem>
            </LinkContainer>

            <NavDropdown eventKey={5} title="Potentials" id="5-basic-nav-dropdown">
              <LinkContainer to="/potentialbuys">
                <MenuItem eventKey={5.1}>Buys</MenuItem>
              </LinkContainer>
              <LinkContainer to="/potentialsells">
                <MenuItem eventKey={5.2}>Sells</MenuItem>
              </LinkContainer>
            </NavDropdown>

            <LinkContainer to="/executions">
              <NavItem eventKey={6}>Executions</NavItem>
            </LinkContainer>

            <NavDropdown eventKey={7} title="Tools" id="5-basic-nav-dropdown">
              <LinkContainer to="/managelists">
                <MenuItem eventKey={7.0}>Manage WatchList</MenuItem>
              </LinkContainer>
              <LinkContainer to="/requesttrace">
                <MenuItem eventKey={7.1}>Request Trace...</MenuItem>
              </LinkContainer>
              <LinkContainer to="/readtracelog">
                <MenuItem eventKey={7.2} disabled={true}>
                  Read Trace Log
                </MenuItem>
              </LinkContainer>
              <MenuItem divider />
              <LinkContainer to="/readerrorlog">
                <MenuItem eventKey={7.3} disabled={true}>
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

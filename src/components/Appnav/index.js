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

            <LinkContainer to="/executions">
              <NavItem eventKey={4}>Executions</NavItem>
            </LinkContainer>

            <LinkContainer to="/watchlist">
              <NavItem eventKey={4}>WatchList</NavItem>
            </LinkContainer>

            {/* <LinkContainer to="/forecaster">
              <NavItem eventKey={4}>Forecaster</NavItem>
            </LinkContainer> */}

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

            <NavDropdown eventKey={6} title="Help" id="6-basic-nav-dropdown">
              <LinkContainer to="/readme">
                <MenuItem eventKey={6.3}>Read Me</MenuItem>
              </LinkContainer>
              <LinkContainer to="/docs">
                <MenuItem eventKey={6.2}>Documentation...</MenuItem>
              </LinkContainer>

              <LinkContainer to="/about">
                <MenuItem eventKey={6.4}>About AcesTrader</MenuItem>
              </LinkContainer>
            </NavDropdown>
          </Nav>

          {/* <Nav pullRight>
            <LinkContainer to="/Signin">
              <NavItem eventKey={8}>Sign In</NavItem>
            </LinkContainer>
          </Nav> */}
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
export default Appnav

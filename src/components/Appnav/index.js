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

            <NavDropdown eventKey={5} title="Prospects" id="5-basic-nav-dropdown">
              <LinkContainer to="/prospectbuys">
                <MenuItem eventKey={5.1}>Buys</MenuItem>
              </LinkContainer>
              <LinkContainer to="/prospectsells">
                <MenuItem eventKey={5.2}>Sells</MenuItem>
              </LinkContainer>
            </NavDropdown>

            <NavDropdown eventKey={4} title="Positions" id="5-basic-nav-dropdown">
              <LinkContainer to="/positionlongs">
                <MenuItem eventKey={4.1}>Longs</MenuItem>
              </LinkContainer>
              <LinkContainer to="/positionshorts">
                <MenuItem eventKey={4.2}>Shorts</MenuItem>
              </LinkContainer>
            </NavDropdown>

            <LinkContainer to="/trades">
              <NavItem eventKey={6}>Trades</NavItem>
            </LinkContainer>

            <NavDropdown eventKey={7} title="More" id="5-basic-nav-dropdown">
              <LinkContainer to="/managebuyprospects">
                <MenuItem eventKey={7.0}>Manage Buy Prospects</MenuItem>
              </LinkContainer>
              <LinkContainer to="/managesellprospects">
                <MenuItem eventKey={7.2}>Manage Sell Prospects</MenuItem>
              </LinkContainer>
              <MenuItem divider />
              <LinkContainer to="/home">
                <MenuItem eventKey={7.3}>About AcesTrader</MenuItem>
              </LinkContainer>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
export default Appnav

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
            <NavDropdown eventKey={5} title="Prospects" id="5-basic-nav-dropdown">
              <LinkContainer to="/prospectbuys">
                <MenuItem eventKey={5.1}>Trading Buys</MenuItem>
              </LinkContainer>
              <LinkContainer to="/prospectsells">
                <MenuItem eventKey={5.2}>Trading Sells</MenuItem>
              </LinkContainer>
              <LinkContainer to="/prospecttrendfollowers">
                <MenuItem eventKey={5.2}>Trend Followers</MenuItem>
              </LinkContainer>
            </NavDropdown>

            <NavDropdown eventKey={4} title="Positions" id="5-basic-nav-dropdown">
              <LinkContainer to="/positionlongs">
                <MenuItem eventKey={4.1}>Trading Longs</MenuItem>
              </LinkContainer>
              <LinkContainer to="/positionshorts">
                <MenuItem eventKey={4.2}>Trading Shorts</MenuItem>
              </LinkContainer>
              <LinkContainer to="/positiontrendfollowers">
                <MenuItem eventKey={4.6}>Trend Followers</MenuItem>
              </LinkContainer>
            </NavDropdown>

            <NavDropdown eventKey={6} title="Symbols" id="5-basic-nav-dropdown">
              <LinkContainer to="/managebuyprospects">
                <MenuItem eventKey={6.2}>Trading Buy Prospects</MenuItem>
              </LinkContainer>
              <LinkContainer to="/managesellprospects">
                <MenuItem eventKey={6.6}>Trading Sell Prospects</MenuItem>
              </LinkContainer>
              <LinkContainer to="/managetrendfollowerprospects">
                <MenuItem eventKey={7.3}>Trend Follower Prospects</MenuItem>
              </LinkContainer>
            </NavDropdown>

            <NavDropdown eventKey={7} title="More" id="5-basic-nav-dropdown">
              <LinkContainer to="/scoreboard">
                <NavItem eventKey={7.1}>ScoreBoard</NavItem>
              </LinkContainer>

              <LinkContainer to="/peek">
                <NavItem eventKey={7.2}>Peek</NavItem>
              </LinkContainer>
              <MenuItem divider />

              <LinkContainer to="/home">
                <MenuItem eventKey={7.3}>About AcesTrader</MenuItem>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to="/alerts">
              <NavItem eventKey={9}>Alerts</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
export default Appnav

import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import './styles.css'

// class Appnav extends Component {
const Appnav = function() {
  // let getResetStateMenu = function() {
  //   return process.env.NODE_ENV === 'development'
  //     ? `<MenuItem divider />
  //   <LinkContainer to="/EraseLists">
  //   <MenuItem eventKey={6.8}>** Erase All Lists **</MenuItem>
  //   </LinkContainer>`
  //     : null
  // }
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
                <MenuItem eventKey={5.1}>Buys</MenuItem>
              </LinkContainer>
              <LinkContainer to="/prospectsells">
                <MenuItem eventKey={5.2}>Short Sales</MenuItem>
              </LinkContainer>
              <LinkContainer to="/prospecttrendbuys">
                <MenuItem eventKey={5.2}>Trend Buys</MenuItem>
              </LinkContainer>
            </NavDropdown>

            <NavDropdown eventKey={4} title="Positions" id="5-basic-nav-dropdown">
              <LinkContainer to="/positionlongs">
                <MenuItem eventKey={4.1}>Longs</MenuItem>
              </LinkContainer>
              <LinkContainer to="/positionshorts">
                <MenuItem eventKey={4.2}>Shorts</MenuItem>
              </LinkContainer>
              <LinkContainer to="/positiontrendlongs">
                <MenuItem eventKey={4.6}>Trend Longs</MenuItem>
              </LinkContainer>
            </NavDropdown>

            <LinkContainer to="/results">
              <NavItem eventKey={9}>Trades</NavItem>
            </LinkContainer>

            <NavDropdown eventKey={6} title="Edits" id="5-basic-nav-dropdown">
              <LinkContainer to="/managebuyprospects">
                <MenuItem eventKey={6.2}>Buy Prospects</MenuItem>
              </LinkContainer>
              <LinkContainer to="/managesellprospects">
                <MenuItem eventKey={6.4}>Short Sale Prospects</MenuItem>
              </LinkContainer>
              <LinkContainer to="/managetrendbuyprospects">
                <MenuItem eventKey={6.7}>Trend Buy Prospects</MenuItem>
              </LinkContainer>

              {/* <MenuItem divider />
              <LinkContainer to="/EraseLists">
                <MenuItem eventKey={6.8}>** Erase All Lists **</MenuItem>
              </LinkContainer> */}
            </NavDropdown>

            <NavDropdown eventKey={7} title="More" id="5-basic-nav-dropdown">
              <LinkContainer to="/peek">
                <NavItem eventKey={7.2}>Peek</NavItem>
              </LinkContainer>
              <MenuItem divider />
              <LinkContainer to="/home">
                <MenuItem eventKey={8.3}>AcesTrader</MenuItem>
              </LinkContainer>
              <MenuItem divider />
              <LinkContainer to="/welcomeguest">
                <NavItem eventKey={7.4}>Guest Mode</NavItem>
              </LinkContainer>
              {/* {getResetStateMenu()} */}
            </NavDropdown>
            <LinkContainer to="/signout">
              <NavItem eventKey={9}>SignIn</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
export default Appnav

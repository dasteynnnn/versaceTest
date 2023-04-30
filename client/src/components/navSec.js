import React from "react";

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css'

function NavSec() {
    return(
        <Navbar bg="light" variant="light">
            <Container>
                <Navbar.Brand href="/">Dust App</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/lives">Live Selling</Nav.Link>
                    <Nav.Link href="/lottery">Lottery</Nav.Link>
                    {/* <Nav.Link href="/task/monitoring">Task Monitoring</Nav.Link> */}
                    {/* <Nav.Link href="/budget/tracker">Budget Tracker</Nav.Link>
                    <Nav.Link href="/finance/credit/card">Credit Card</Nav.Link> */}
                    <NavDropdown title="Finance Services" id="nav-dropdown">
                        <NavDropdown.Item eventKey="4.1" href="/budget/tracker">Budget Tracker</NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.2" href="/finance/credit/card">CC Calculator</NavDropdown.Item>
                        {/* <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item> */}
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavSec;
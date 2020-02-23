import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import Can from "../authentication/Can";
import { AuthConsumer } from "../authentication/authContext";

const SellerNav = ({logout}) => (
	<Navbar.Collapse id="basic-navbar-nav">
	    <Nav className="mr-auto">
	      <Nav.Link href="/seller/add">Add Product</Nav.Link>
	      <NavDropdown title="View Products" id="basic-nav-dropdown">
	        <NavDropdown.Item href="/seller/products/listed">All listed</NavDropdown.Item>
	        <NavDropdown.Item href="/seller/products/ready">Ready to dispatch</NavDropdown.Item>
	        <NavDropdown.Item href="/seller/products/dispatched">Dispatched</NavDropdown.Item>
	        <NavDropdown.Divider />
	        <NavDropdown.Item href="/seller/products/cancelled">Cancelled</NavDropdown.Item>
	      </NavDropdown>
	    </Nav>
	    <Form inline>
	      <Button variant="outline-danger" onClick={logout}>Logout</Button>
	    </Form> 
    </Navbar.Collapse>
)

const BuyerNav = ({logout, setState, search}) => (
    <Navbar.Collapse id="basic-navbar-nav">
	    <Nav className="mr-auto">
	      <Nav.Link href="/buyer/products">Store</Nav.Link>
	      <Nav.Link href="/buyer/orders">My Orders</Nav.Link>
	    </Nav>
	    <Form inline>
	      <FormControl type="text" onChange={(e) => setState(e.target.value)} placeholder="Search" className="mr-sm-2" size="sm" />
	      <Link to={search}>
		      <Button variant="outline-success" size="sm">Search</Button>
	      </Link>
	      &nbsp;&nbsp;&nbsp;&nbsp;
	      <Button variant="outline-danger" onClick={logout}>Logout</Button>
	    </Form>
	</Navbar.Collapse>
)

const VisitorNav = () => (
    <Navbar.Collapse id="basic-navbar-nav">
	    <Nav className="mr-auto">
	      <Nav.Link href="/about">About Us</Nav.Link>
	      <Nav.Link href="/contact">Contact Us</Nav.Link>
	    </Nav>
	    <Form inline>
		    <Link to="/login">
		      <Button variant="outline-light">Login</Button>
		    </Link>
		    &nbsp;
		    <Link to="/register">
		      <Button variant="outline-dark">Signup</Button>
		    </Link>
	    </Form>
	</Navbar.Collapse>
)

class NavBar extends Component {

    constructor(props) {
    	super(props)

    	this.state = {
    		search: ''
    	}

    	this.changeSearch = this.changeSearch.bind(this)
    }

    changeSearch(text) {
    	this.setState({
    		search: text
    	});
    }

    render() {
		let brand = `buBuy `
		let name = ''
		if(this.props.role !== "visitor") name = `>${this.props.name}`
		return (
           <Navbar bg="primary" expand="lg">
			  <Navbar.Brand href="/"><h4><b>{brand}</b><small>{name}</small></h4></Navbar.Brand>
			  <Navbar.Toggle aria-controls="basic-navbar-nav" />
			    <Can
			        role={this.props.role}
			        perform="navigate:seller"
			        yes={() => (
						<SellerNav logout={this.props.logout}/>
				    )}
			        no={() => (
						<BuyerNav logout={this.props.logout} setState={this.changeSearch} search={`/buyer/products/${this.state.search}`} />
			        )}
			        visitor={() => (
						<VisitorNav />
			        )}
			    />
			</Navbar>
        );
    }
}

export default props => (
	<AuthConsumer>
		{({ user, logout }) => (
	         <NavBar {...props} name={user.username} role={user.role} logout={logout} />
		)}
	</AuthConsumer>
)
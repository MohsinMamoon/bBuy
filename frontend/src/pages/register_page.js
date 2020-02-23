import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Alert } from "react-bootstrap";

import { AuthConsumer } from "../authentication/authContext";
import Can from "../authentication/Can";

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            re_password: "",
            role: "buyer",
            failed: false,
            success: false,
            error_message: ''
        };

        this.submit = this.submit.bind(this);
    }

    submit(e) {
        e.preventDefault();
        if(this.state.password !== this.state.re_password) {
			this.setState({success: false, failed: true, error_message: "Passwords do not match!"})
            return;
        }
        const user = {
            username: this.state.username,
            password: this.state.password,
            role: this.state.role
        }

        axios.post("http://localhost:5000/account/register", user)
        .then(result => {
        	console.log(result)
            if(result.status === 200) {
                this.setState({success: true, failed: false})
            }
            else {
                this.setState({success: false, failed: true, error_message: "There was an error in registration! Please try again."});
                console.log(result.data)
            }
        })
        .catch(err => this.setState({success: false, failed: true, error_message: "There was an error in registration! Please try again."}))
        
        e.target.reset();
    }

    render() {
        return (
            <div>
        	<form onSubmit={this.submit}>
                <div className="form-group">
                        <label>Enter Username: </label>
                        <input type="text"
                            className="form-control" 
                            value={this.state.username} 
                            onChange={(e) => this.setState({username: e.target.value})}/>
                </div>
                <div className="form-group">
                        <label>Enter Password: </label>
                        <input type="password" 
                            className="form-control"
                            value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
                </div>
                <div className="form-group">
                        <label>Re-Enter Password: </label>
                        <input type="password" 
                            className="form-control"
                            value={this.state.re_password} onChange={(e) => this.setState({re_password: e.target.value})}/>
                </div>
                <div className="form-group">
                        <label> Who are you: </label>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="radio"
                            value="buyer"
                            checked={this.state.role === "buyer"}
                            onChange={(e) => this.setState({role: 'buyer'})} />&nbsp;Buyer
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="radio"
                            value="seller"
                            checked={this.state.role === "seller"}
                            onChange={(e) => this.setState({role: 'seller'})} />&nbsp;Seller
                </div>
                <hr />
                <div className="form-group">
                        <Button type="submit"> Register </Button>
                </div>
            </form>
            <div>
                {this.state.failed && (
	                <Alert variant='danger'>
                        <h4><center>{this.state.error_message}</center></h4>
                    </Alert>
                )}
                {this.state.success && (
                	<Alert variant="success">
                       <h4><center>Account Created! You can log in now!</center></h4>
                       <center> 
	                       <Link to="/login">
		                       <Button variant="primary" size ="lg">Login</Button>
		                   </Link>
                       </center>
                    </Alert>
                )}
             </div>            
        </div>
        )
    }
}

export default props => (
  <AuthConsumer>
    {({ user }) => (
      <Can
        role={user.role}
        perform="register:register"
        yes={() => (
		       <Register {...props}/>
		    )}
        no={() => (
          <Alert variant="info" size="lg">
            <center><h1>You are already logged in!</h1></center>
          </Alert>
        )}
      />
    )}
  </AuthConsumer>
);

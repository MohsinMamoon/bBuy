import React, { Component } from 'react';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';

import { AuthConsumer } from "../authentication/authContext";
import { Redirect } from 'react-router-dom';
import FbLogin from '../components/socialLogin.component';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            role: "buyer",
            failed: false,
            message: 'Incorrect Username or Password!',
            referer : (props.location.state ? (props.location.state.referer ? props.location.state.referer : '/') : '/')
        };

        this.login = this.login.bind(this);
        this.handleSocialLogin = this.handleSocialLogin.bind(this);
        this.handleSocialLoginFailure = this.handleSocialLoginFailure.bind(this);
    }

    handleSocialLogin = (user) => {
        console.log(user)
        axios.post("http://localhost:5000/account/register", {
            username: user._profile.email,
            password: 'password',
            role: this.state.role
        })
        .then(result => {
        	console.log(result)
            if(result.status === 200) {
                    alert(`You have been registered with username: ${user._profile.email} and password: "password"\nPlease use these credentials to login next time!`);
                    this.setState({username: user._profile.email, password: "password"});
                    this.login();

            }
            else {
                alert(`Could not register ${user._profile.email}!\nTry login with username: ${user._profile.email} and password: "password"`)
                console.log(result.data)
            }
        })
        .catch(err => alert(`Could not register ${user._profile.email}!\nTry login with username: ${user._profile.email} and password: "password"`))
        

    }
       
    handleSocialLoginFailure = (err) => {
        console.error(err)
        this.setState({failed: true, message: "Could not login through Facebook!"});
    }

    login(e) {
        console.log("Tried");
        if(e) e.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password,
            role: this.state.role
        }

        axios.post("http://localhost:5000/account/authenticate", user)
        .then(result => {
            if(result.data.user) {
                this.props.authenticate(result.data);
                window.location = this.state.referer
            }
            else {
                this.setState({failed: true});
            }
        })
        
        if(e) e.target.reset()


        // for login with social media, 
        // if authenticated, register with username, default password, and role
        // and login with that user!!!!!!!

    }

    render() {
        return (
            <div>
        	{this.props.loggedin ? ( 
        		<Redirect to={this.state.referer} />
        		) : (
                <form onSubmit={this.login} ref="form">
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text"
                            className="form-control" 
                            value={this.state.username} 
                            onChange={(e) => this.setState({username: e.target.value})}/>
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input type="password" 
                            className="form-control"
                            value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
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
                    <center>
                        <div className="form-group">
                            <Button type="submit" variant="success">Login</Button>
                        </div>
                        <FbLogin
                        provider='facebook'
                        appId='2999490196741583'
                        onLoginSuccess={this.handleSocialLogin}
                        onLoginFailure={this.handleSocialLoginFailure}
                        >
                        Login with Facebook
                        </FbLogin>
                    </center>
                    {this.state.failed && (
						<Alert  variant='danger'>
							<h4><center>{this.state.message}</center></h4>
						</Alert>
                    ) }
                </form>
            )}
            </div>
        )
    }
}

export default props => ( <AuthConsumer>
    {({handleAuthentication, authenticated}) => {
       return <Login {...props} authenticate={handleAuthentication} loggedin={authenticated} />
    }}
  </AuthConsumer>
  );
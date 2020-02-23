import React, { Component } from "react";

import { AuthProvider } from "./authContext";

class Auth extends Component {
    
    state = {
        authenticated: false,
        user: {
            role: "visitor"
        },
        accessToken: "",
        loaded: false
    };
    
    logout = () => {
    	let pr_state = {
    		authenticated: false,
            user: {
                role: "visitor"
            },
            accessToken: ""
    	};
        this.setState(pr_state);
        console.log("Logout Succesful");
        localStorage.setItem("state", JSON.stringify(pr_state));
        window.location = '/';
    };

    handleAuthentication = (data) => {
        this.setSession(data)
    };

    componentDidMount() {
    	let saved_state = JSON.parse(localStorage.getItem("state"));
        this.setState(saved_state);
        this.setState({loaded: true});
    }

    setSession(data) {
     
        let pr_state = {
        	authenticated: true,
        	accessToken: data.accessToken,
            user: data.user,
            loaded: false
        }
        this.setState(pr_state);
        console.log("in SetSession", pr_state );
        localStorage.setItem("state", JSON.stringify(pr_state));
    }

    render() {
        const authProviderValue = {
            ...this.state,
            initiateLogin: this.initiateLogin,
            handleAuthentication: this.handleAuthentication,
            logout: this.logout
        };

        return (
            <AuthProvider value={authProviderValue}>
                {this.state.loaded ? this.props.children : null}
            </AuthProvider>
        );
    }
}

export default Auth;
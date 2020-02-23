import React , { Component }from 'react';
import { Button } from 'react-bootstrap';
import SocialLogin from 'react-social-login';
 
class FbLogin extends Component {
 
    render() {
        return (
            <Button onClick={this.props.triggerLogin} {...this.props}>
              { this.props.children }
            </Button>
        );
    }
}
 
export default SocialLogin(FbLogin);
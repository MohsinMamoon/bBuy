import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Auth from './authentication/auth'

ReactDOM.render((
	<Auth>
	   <App />
	</Auth>
	), document.getElementById('root'));

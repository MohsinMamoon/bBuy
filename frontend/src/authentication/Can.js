import React from 'react';
import { Redirect } from 'react-router-dom';
import rules from "./rules";

const check = (rules, role, action, data) => {
	
	const permissions = rules[role];
	
	if(!permissions) {
		return false
	};

	const staticPermissions = permissions.static;

	if(staticPermissions && staticPermissions.includes(action)){
		return true
	};

	const dynamicPermissions = permissions.dynamic;

	if(dynamicPermissions) {
		
		const permissionCondition = dynamicPermissions[action];
        
        if(!permissionCondition) return false;

        return permissionCondition(data);
	}

	return false;
};

const Can = props => (
check(rules, props.role, props.perform, props.data) ? props.yes() : (
	!(props.role === 'visitor') ?  props.no() : props.visitor(props))
	);

Can.defaultProps = {
	yes: () => null,
	no: ()=>null,
	visitor: ({location})=> {
		console.log("in props", location)
	return <Redirect to={{ pathname: "/login", state: { referer: location } }} />
	}
};

export default Can;

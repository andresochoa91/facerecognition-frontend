import React, { Component } from 'react';

class Navigation extends Component {

	onSubmitSignOut = () => {
		this.props.onClickSign("signout")
	}

	render() {
		return(
			<nav style={{display: "flex", justifyContent: "flex-end"}}>
				<p onClick={ this.onSubmitSignOut } 
				   className="f3 link dim black underline pa3 pointer" 
				   id="signout">
				   	Sign out
				</p>
			</nav>
		);		
	}
}

export default Navigation;
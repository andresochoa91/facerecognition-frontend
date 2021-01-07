import React from 'react';
import Tilt from 'react-tilt';
import racoon from './racoon.png';

const Logo = () => {
	return(
		<div className="mt0 center">
			<Tilt className="mb6 Tilt" 
				  options={{ max : 25 }} 
				  style={{ height: 150, width: 150 }} >
				<div className="Tilt-inner">
				 	<img src={racoon} alt="img"/> 
				</div>
			</Tilt>			
		</div>
	);
}

export default Logo;
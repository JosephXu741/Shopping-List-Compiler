import React from 'react';
import './popup.css';

export default function Popup ( {search, popUp, closePopUp} ) {

	return (
		<div className="pop-up"
			 style = {{
				 opacity: popUp ? '1' : '0'
			 }}>
			<div className="pop-up-upper">
				<p>You searched...</p>
				<span className="close-button-x" onClick={closePopUp}>x</span>
			</div>
			<div className="pop-up-inner">
				<div className="pop-up-body"></div>
					{search}
				<div className="pop-up-footer">
					<button className="close-button-cancel" onClick={closePopUp} >close</button>
				</div>
			</div>
		</div>

	)
}

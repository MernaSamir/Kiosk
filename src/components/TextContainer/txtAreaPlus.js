import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class TxtAreaPlus extends Component {
    render() {
        const { title, placeholder, style } = this.props
        return (
            <div className="notes">
                <div className="txtAreaPlusContainer" style={{ ...style }}>
                
                <p className="title"> {title}</p>
                <div className="container2"   >
                <textarea className="areaForTxt" placeholder={placeholder}/>
        

                    <button className="btnPlus" type="button">
                        <FontAwesomeIcon icon="plus" className="icon" />
                    </button>
                
                </div>

            </div>
            <p className="notes-and-suggestion">El edificio al lado de el banco que esta al lado de</p>
            </div>
        )
    }
}

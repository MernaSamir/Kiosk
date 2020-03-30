import React, { Component } from 'react';
import './newStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
class txtInputPlus extends Component {
    render() {
        const { title, placeholder, style } = this.props

        return (
            <div className="txtInputPlusContainer"  >
                <p className="title"> {title}</p>
                <div className="container2"  >
                    <input className="txtInputPlus" style={{ ...style }}  placeholder={placeholder} />
        

                    <button className="btnPlus" type="button">
                        <FontAwesomeIcon icon="plus" className="icon" />
                    </button>
                </div>
            </div>
        );
    }
}
export default txtInputPlus
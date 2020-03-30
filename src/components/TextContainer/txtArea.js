import React, { Component } from 'react';
import  './newStyle.css';

class txtArea extends Component {
    render() {
        const {title,placeholder,style}=this.props
       
        return (
            <div className="txtAreaContainer" style={{ ...style }}>
            <p className="title"> {title}</p>
            <textarea className="areaForTxt" placeholder={placeholder} />
            </div>
        );
    }
}
export default txtArea
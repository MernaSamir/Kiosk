import React, { Component } from 'react';
import  './newStyle.css';

class txtInput extends Component {
    render() {
        const {title,placeholder,style}=this.props
       
        return (
            <div className="txtInputContainer" style={{ ...style }}>
            <p className="title"> {title}</p>
            <input className="txtInput" placeholder={placeholder} />
            </div>
        );
    }
}
export default txtInput
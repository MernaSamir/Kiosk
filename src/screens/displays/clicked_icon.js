import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class ClickedIocn extends Component {
    render() {
        const { name, onClick, size, className } = this.props
        return (
            <div onClick={onClick}>
                <FontAwesomeIcon icon={name} size={size || "lg"} className={`btn-icon ${className}`} />
            </div>
        )
    }
}

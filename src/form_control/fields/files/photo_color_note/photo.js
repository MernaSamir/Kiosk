import React, { Component } from 'react'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class photo extends Component {
    state = {
    }
    render() {
        
        return (
                <div className="cameraBox">
                    <FontAwesomeIcon icon="camera" size="3x" color="#b7b7b7" />
                </div>
    
        )
    }
}

 export default photo
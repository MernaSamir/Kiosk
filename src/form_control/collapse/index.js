import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
class Collapse extends Component {

    state = {
        expand: false,
        transform: 'rorate(0deg)',
        transitionDuration: '0.4s',
        selectall: false,
        activeall: false
    }

    activeCollapse = () => {
        if (this.state.expand == false) {
            this.setState({
                expand: true,
                transform: 'rotate(180deg)',
            })
        }
        else {
            this.setState({
                expand: false,
                transform: 'rotate(0deg)',
            })
        }
    }

    render() {
        const { label, radio } = this.props

        return (<div >
            <p style={{ margin: '0 10%' }}>{label ? label : ''}</p>
            <FontAwesomeIcon
                icon="chevron-down"
                className="icon"
                onClick={() => this.activeCollapse()}
                style={
                    {
                        transform: this.state.transform,
                        transitionDuration: this.state.transitionDuration,
                        float: 'right'
                    }
                }
            />
        </div>
        )
    }
}

export default Collapse
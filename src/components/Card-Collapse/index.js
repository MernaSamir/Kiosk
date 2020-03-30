import React, { Component } from 'react'
import './card-collapse.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class CardCollapse extends Component {
    state = {
        // active: false,
        display: "none",
        transform: "rotate(180deg)",
        transitionDuration: ".4s",
    }

    active = () => {
        if (this.state.display == "none") {
            this.setState({
                display: 'block',
                transform: 'rotate(0deg)'
            })
        }

        else {
            this.setState({
                display: 'none',
                transform: 'rotate(180deg)'
            })
        }
    }

    render() {
        const { style, name, children } = this.props
        const { display } = this.state;
        return (
            <div className="card-collapse-container" style={{ ...style }}>

                <div className="card-collapse-header" onClick={() => this.active()}>

                    <p className="title">{name}</p>
                    <FontAwesomeIcon icon="chevron-down" className="icon" style={{ transform: this.state.transform, transitionDuration: this.state.transitionDuration }} />

                </div>

                <div className="card-collapse-body">
                    {
                        typeof children === "function" ?
                            children(display == "block")
                            : children
                    }
                </div>

            </div>
        )
    }
}

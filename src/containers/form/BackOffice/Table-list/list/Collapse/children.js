import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Row from './row';

export default class Children extends Component {

    render() {
        const { display , content } = this.props
        return (
            <div style={{ display: display}} >
                {/* <Row name="Cheese Burger" />
                <Row name="Tacos" backgroundColor="#fbfbfb" /> */}
                {content}
            </div>
        )
    }
}

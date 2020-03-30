import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import {filter} from 'lodash'

export class Collapse extends Component {

    state = {
        display: 'none',
        transform: "rotate(180deg)",
        transitionDuration: ".4s",
    }

    handleCollapseClick = () => {
        if (this.state.display == 'none') {
            this.setState({
                display: 'block',
                transform: "rotate(0deg)",

            })
        }
        else {
            this.setState({
                display: 'none',
                transform: "rotate(180deg)",
            })
        }
    }
    render() {
        return (<>
            <button className={classes.flex} onClick={this.handleCollapseClick.bind(this)}>
                <FontAwesomeIcon
                    style={{
                        transform: this.state.transform,
                        transitionDuration: this.state.transitionDuration
                    }}
                    className={classes.collapse_icon}
                    icon="caret-down"
                />
            </button>
            <div style={{ display: this.state.display }}>
                {this.props.children}
            </div>
        </>
        )
    }
}

const mapStateToProps = (state, props) => ({
    get receipts() { return filter(state.orders__receipt.data, { order: props.order.id }) },
})



export default connect(mapStateToProps, mapDispatchToProps)(Collapse)

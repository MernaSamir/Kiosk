import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash';
import mapDispatchToProps from 'helpers/actions/main';
import classes from '../style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Pagination extends Component {

    handelPageClick = (op) => {
        const { receipts, receipt, changeActive } = this.props
        let active = receipts.indexOf(receipt)
        let maxLength = receipts.length
        let current = active + 1
        if (!(current <= 1 && op == -1) && !(current >= maxLength && op == 1)) {
            changeActive((current + op))
        }
    }
    render() {
        const { receipts, receipt } = this.props
        let len = receipts.length
        let current = receipts.indexOf(receipt) + 1
        return (
            <div className={classes.pagination}>
                <button type="button" onClick={this.handelPageClick.bind(this, -1)}>
                    <FontAwesomeIcon icon="caret-left" className={classes.icon} />
                </button>

                <p>{`${current} of ${len}`}</p>

                <button type="button" onClick={this.handelPageClick.bind(this, 1)}>
                    <FontAwesomeIcon icon="caret-right" className={classes.icon} />
                </button>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    receipts: get(state.popup, 'popup.receipts', {}),
    get receipt() { return get(this.receipts, `[${props.active}]`, {}) },
})
export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get, filter } from 'lodash';

class MoveItem extends Component {

    activeMove = () => {
        const { setMain, activeAction } = this.props
        if (activeAction != 'move') {
            setMain('actions', { active: 'move' })
        }
        else {
            setMain('actions', { active: '' })
        }
    }

    renderStyle = () => {
        const { activeAction } = this.props
        if (activeAction == 'move') {
            return classes.active_moveitem_btn
        }
        return classes.moveitem_btn
    }

    render() {
        return (
            <div className={classes.moveitem_div}>
                <button type='button' className={this.renderStyle()} onClick={this.activeMove.bind()}>
                    <FontAwesomeIcon icon='arrows-alt' className={classes.icon} />
                    <p>Move</p>
                </button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    activeAction: state.actions.active,
    base_sales_cat: get(state.items__base_sales_cat, 'active', ''),
    clicks: get(state.items__sales_items, 'clicks', []),
    get sales_items() { return filter(state.items__sales_items.data, { base_sales_cat: this.base_sales_cat }) }
})

export default connect(mapStateToProps, mapDispatchToProps)(MoveItem)
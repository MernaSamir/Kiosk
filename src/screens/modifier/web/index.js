import React, { Component, lazy } from 'react'
import { connect } from 'react-redux'
import { get, toArray } from 'lodash'
import classes from './style.less'
import Helpers from 'help_component'

const NormalItem = lazy(() => import('./normal_item'))
class Body extends Component {

    rendering = () => {
        const { item } = this.props
            return <NormalItem />
    }

    render() {
        const { activeDetail}= this.props
        return (
            <div className={classes.container}>
                <div className={classes.above}>
                    <p className={classes.header}>{activeDetail.name}-{activeDetail.size}</p>
                </div>
                {this.rendering()}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    item: get(state.items__sales_items.data, state.items__sales_items.active, {}),
    details: get(state.form_actions, 'details', {}),
    activeDetail: get(state.form_actions.details, state.form_actions.active),

})

export default connect(mapStateToProps, null)(Body)
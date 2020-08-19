import React, { Component, lazy } from 'react'
import { connect } from 'react-redux'
import { get, toArray, isEmpty } from 'lodash'
import classes from './style.less'
import Helpers from 'help_component'
import { withRouter } from 'react-router-dom';

const NormalItem = lazy(() => import('./normal_item'))
const ComboItem = lazy(() => import('../../combo_item'))
// const SsbItem = lazy(()=> import('./ssb_item'))
class Body extends Component {

    rendering = () => {
        const { item } = this.props
        // if (item._type == 'ss') {
        //     return <ComboItem />
        // }
        // else if (item._type == 'ssb'){
        //     return <SsbItem />
        // }
        // else {
            return <NormalItem />
        // }
    }

    render() {
        const {details, activeDetail, history}= this.props
        if(isEmpty(details)){
            history.push('/order')

        }
        else{
        return (
            <div className={classes.container}>
                <div className={classes.above}>
                    {/* <button onClick={history.goBack.bind(this)}>
            <FontAwesomeIcon icon="arrow-left" className={classes.icon} />
          </button> */}
                    <p className={classes.header}>{activeDetail.name}-{activeDetail.size}</p>
                </div>
                {this.rendering()}
            </div>
        )
        }
    }
}
const mapStateToProps = (state) => ({
    item: get(state.items__sales_items.data, state.items__sales_items.active, {}),
    details: get(state.form_actions, 'details', {}),
    activeDetail: get(state.form_actions.details, state.form_actions.active),

})

export default withRouter(connect(mapStateToProps, null)(Body))
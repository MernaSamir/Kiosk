import React, { Component } from 'react'
import classes from './styles.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'
import { get } from 'lodash';

class CancelOrder extends Component {

    tackAction = () => {
        const { onClick } = this.props
        get(this, onClick, () => { })()
    }

    Delete = () => {
        const { setMain, title, singleitem } = this.props
        const popup = {
            type: 'CancelCustomer', visable: true, width: "50%",
            childProps: {
                Title: title,
                first_msg: `Are you sure you want to Delete the ${singleitem}?`,
                pressYes: this.delete
            }
        }
        setMain('popup', { popup })
    }

    delete = () => {
        const { item, setMain, reduxName } = this.props
        setMain(reduxName, {
            item: {
                ...item, end_time: new Date(), action: 'update',
                // onSuccess: this.afterDelete
            }
        })
    }

    afterDelete = (elment) => {
        return [
            { type: 'set_main_orders__main', data: { active: '' } },
            { type: 'set_path_orders__main', path: `data.${elment.id}.end_time`, data: elment.end_time },
        ]
    }

    render() {
        return (
            <div>
                <button type="button" className={classes.actions} onClick={this.tackAction}>
                    <FontAwesomeIcon icon={['far', 'trash-alt']} />
                </button>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    data: get(state.orders__main, 'data', {})
})

export default connect(mapStateToProps, mapDispatchToProps)(CancelOrder)
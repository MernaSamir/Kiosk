import React, { Component } from 'react'
import classes from './styles.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'
import { get } from 'lodash';

class RecycleBin extends Component {

    tackAction = () => {
        const { onClick, onAction } = this.props
        if (onAction) {
            onAction()
        }
        else {
            get(this, onClick, () => { })()
        }
    }

    Delete = () => {
        console.log("here",this.props)
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
        setMain(reduxName, { item: { ...item, deleted: true, action: 'delete',  onSuccess() {
            return [{
              type: `set_main_${reduxName}`,
              data: { active: '' }
            }]
          } } })
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

export default connect(null, mapDispatchToProps)(RecycleBin)
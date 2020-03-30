import React, { Component } from 'react'
import { connect } from 'react-redux';
import classes from './style.less'
import { get } from 'lodash';
import mapDispatchToProps from 'helpers/actions/main'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Note extends Component {

    openNote = () => {
        const { order, setMain } = this.props
        const popup = {
            type: 'AddNote',
            childProps: {
                note: get(order, 'note', ''),
                onClick: this.addNote,
                type: 'Order Note',
                mode: true
            }
        }
        setMain('popup', { popup })

    }
    addNote = (note) => {
        const { setMain, order } = this.props
        setMain('orders__main', { item: { id: order.id, note, action: 'update' } })
    }
    render() {
        const { order, style, t } = this.props
        const classNote = style ? style : classes.note
        return (
            <button className={get(order, 'note', false) ? `${classes.marked} ${classNote}` : classes.note} onClick={this.openNote}>
                <FontAwesomeIcon className={classes.icon} icon={['far', 'sticky-note']}></FontAwesomeIcon>
                {/* {t('Note')}{order.note&& `*`} */}
            </button>

        )
    }
}

export default connect(null, mapDispatchToProps)(Note)

import React, { Component } from 'react'
import clasess from './styles.less'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { filter } from 'lodash';
import mapDispatchToProps from 'helpers/actions/main'

class Note extends Component {

  showNote = () => {
    const { setMain, reservation, Notes } = this.props
    const popup = {
      type: 'Note', visable: true, width: "50%",
      childProps: {
        Title: reservation.name,
        Notes: Notes,
        btnName: "Add New Note"
      }
    }
    setMain('popup', { popup })
  }
  render() {
    const { Notes } = this.props;
    return (
      <button type="button" className={ Notes.length > 0? `${clasess.actions} active` : clasess.actions} disabled={!(Notes.length > 0)}  onClick={this.showNote.bind()}>
        <FontAwesomeIcon icon={['far', 'sticky-note']} />
      </button>
    )
  }
}
const mapStateToProps = (state, props) => ({
  Notes: filter(state.parties__reservation_notes.data, { reservation: props.reservation.id }),

})
export default connect(mapStateToProps, mapDispatchToProps)(Note)

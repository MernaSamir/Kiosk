import React, { Component } from 'react'
import Agenda  from 'components/agenda'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import moment from 'moment';
import {  filter } from 'lodash'

 class AgendaView extends Component {
  render() {
      const {reservationList} = this.props
    return (
      <div>
          <Agenda  list = {reservationList}/>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
    item: state.item,
    params: {
        date: (state.parties__reservation.selectedDate || moment()).format("YYYY-MM-DD"),
    },
    reservationList: filter(state.parties__reservation.data, { _type: "t" }),
    get filters() { return this.params },

})
export default connect(mapStateToProps, mapDispatchToProps)(AgendaView)
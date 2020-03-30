import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './../style.less'
import PopUp from 'components/Popup'
import SearchPopUp from 'screens/ordering/orderList/orderList-header/search-popUp'
import PageShift from './page_shift'
export default class HeaderSearch extends Component {

    state = {
        ModalVisible: false,
        CashierSettlement: false,
      }
    
      _openModal = () => {
        this.setState({ ModalVisible: true })
      }
    
      closeModal = () => {
        this.setState({
          ModalVisible: false,
          CashierSettlement: false
        })
      }
    render() {
        return (
            <div className={classes.pag_search_div}>
                <PopUp
                    visable={this.state.ModalVisible}
                    onCancel={this.closeModal}
                    width="90%">
                    <SearchPopUp />
                </PopUp>
                <button type="button" className={classes.search_btn} onClick={()=> this._openModal()}>
                    <FontAwesomeIcon icon="search" />
                </button>

                <PageShift/>
            </div>
        )
    }
}

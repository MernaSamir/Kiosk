import React, { Component } from 'react'
import PopUp from './../../components/Popup/index'
import SyncPopUp from './SaveToStorage-popUp'
import './style.css'
export class Sync extends Component {
  state = {
    ModalVisible: false,
  };
    reload = ()=>{
        window.localStorage.removeItem('tk')
        window.location.reload()
  }
  _openModal = () => {
    this.setState({ ModalVisible: true })
  }

  _closeModal = () => {
    this.setState({ ModalVisible: false })
  }
  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-center' }}>
        <button className="SyncBtn" onClick={this.reload}>Sync</button>
        <button className="SyncBtn" onClick={this._openModal}>Connect</button>
        <PopUp
          visable={this.state.ModalVisible}
          onCancel={this._closeModal}
          width="40%">
          <SyncPopUp />
        </PopUp>
      </div>
    )
  }
}
export default Sync

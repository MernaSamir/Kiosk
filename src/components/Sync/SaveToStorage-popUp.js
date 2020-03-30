import React, { Component } from 'react'
import './style.css'
class SaveToStorage extends Component {
    state = {
        IPvalue: ''
    };
    updateInputValue = (event) => {
        this.setState({
            IPvalue: event.target.value
        });
    }
    cancelClick = () => {
        this.props.onCancel();
        this.setState({ IPvalue: '' });
    }

    // handelLogin = () => {
    //     const { IPvalue } = this.state;
    //     return axios
    //         .post(`http://192.168.100.131:8000/api/v1/api-token-auth/`, { IPvalue })
    //         .then(({ data }) => {
    //             localStorage.setItem('tk', data.token);
    //             return data.token
    //         })

    // }


    SaveToLocalStorage = () => {
        const { IPvalue } = this.state;
        localStorage.setItem('ip_address', IPvalue)
        this.props.onCancel();
        this.setState({ IPvalue: '' });
    }
    render() {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'flex-center', textAlign: 'center' }}>
                    <input className="SyncInput"
                        value={this.state.IPvalue}
                        onChange={this.updateInputValue}
                    ></input>
                </div>

                <div className="SyncDiv">
                    <button className="SyncCancel" onClick={() => this.cancelClick()}>Cancel</button>
                    <button className="SyncSave" onClick={() => this.SaveToLocalStorage()}>Save</button>
                </div>
            </div>
        )
    }
}
export default SaveToStorage

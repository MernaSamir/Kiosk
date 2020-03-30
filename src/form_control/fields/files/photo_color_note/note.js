import React, { Component } from 'react'
import './style.css'
import { Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormControls from 'form_control'


export class note extends Component {
    state = {
        visible: false,
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }


    renderInput = () => {
        const {field} = this.props
        const textFiled = {...field,'type':'text'}
        return <FormControls  {...textFiled}/>
    }




    render() {
        const { visible } = this.state
        return (
            <div>
                <div className="PC_comment" onClick={this.showModal}>
                    <FontAwesomeIcon icon="comment-alt" size="2x" color="#b7b7b7" />
                </div>
                <Modal
                    title="COlor"
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={null}
                    closable={this.handleCancel}
                    mask={true}
                    maskClosable={true}
                >
                    <div className="PC_flexBox">
                        {this.renderInput()}
                    </div>
                </Modal>
            </div>
        )
    }
}

export default note

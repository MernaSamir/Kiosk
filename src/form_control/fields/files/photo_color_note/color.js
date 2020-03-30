import React, { Component } from 'react'
import './style.css'
import { Modal } from 'antd';


export class color extends Component {
    state = {
        visible: false,
        pickedColor: ""
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


    renderColors = () => {
        const colors = [
            '#fd94b8',
            '#fcd8f2',
            '#fff0fb',
            '#97c5ff',
            '#addeff',
            '#d6efff',
            '#79d3e9',
            '#93e6fa',
            '#b1fcff',
            '#ffe2ad',
            '#fff2b8',
            '#fdf6d6',
            '#f0f5fc'
        ]
        return (colors || []).map((d, index) => {
            return <div
                className="colors"
                style={{ backgroundColor: d }}
                key={index}
                onClick={() => this.changeColor(d)}
            >
            </div>
        })
    }

    changeColor = (color) => {
        const { field } = this.props;
        field.onChange({
            target: {
                name: field.name,
                value: color
            }
        })
        this.setState({
            visible: false,
            pickedColor: color
        });
    }


    componentWillReceiveProps() {
        const { value } = this.props
        this.setState({ pickedColor: value })
    }


    render() {
        const { field } = this.props
        const { visible } = this.state
        return (
            <div>
                <div
                    className="ColorPicker"
                    style={{ backgroundColor: field.value }}
                    onClick={this.showModal}>
                </div>

                <Modal
                    title="Pick Color"
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={null}
                    closable={this.handleCancel}
                    mask={true}
                    maskClosable={true}

                >
                    <div className="PC_flexBox">
                        {this.renderColors()}
                    </div>
                </Modal>

            </div>

        )
    }
}

export default color

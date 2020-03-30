import React from 'react';
import { Modal } from 'antd';
class popup extends React.Component {
    render() {

        return (
            <div>
                <Modal
                    title=""
                    visible={this.props.visable}
            
                    onCancel={this.props.onCancel}
                    footer={null}
                    centered={true}
                    width={this.props.width || '70%'}

                    bodyStyle={{
                        border: '1px solid  #e73a3c',
                        height:'100%'
                    }}
                >
                    {this.props.lable ? <div className="popup_text">{this.props.lable}</div> : undefined}
                    {this.props.visable ?React.cloneElement(this.props.children, { ...this.props }):undefined}
                </Modal>
            </div>
        );
    }
}
export default popup;
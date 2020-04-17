import React, {Suspense} from 'react';
import './Popup_Mode.css';
import { Modal } from 'antd';
import './style.css'
import { connect } from 'react-redux'
import { get } from 'lodash'
import * as popups from './types'
import mapDispatchToProps from 'helpers/actions/main';
class popup extends React.Component {
    constructor(props) {
        super(props);
    }
    onCancel = () => {
        const { setMain } = this.props;
        setMain('popup', { popup: {} })
    }
    render() {
        const { type, Component = get(popups, type), childProps, visable = type, ...props } = this.props
        const ChildComponent = Component && <Component {...childProps} onCancel={this.onCancel} />
        return (
            <div>
                <Modal
                    title=""
                    visible={Boolean(visable)}
                    onCancel={this.onCancel}
                    footer={null}
                    centered={true}
                    width={props.width || '50%'}
                    bodyStyle={{
                        // border: props.border||'1px solid  #d73f7c',
                        height: props.height || '100%',
                        boxShadow: '0 1.5px 3px 0 rgba(0, 0, 0, 0.16)',
                        borderRadius: '15px',
                        backgroundColor: '#ffffff'
 
                    }}
                >
                    <>
                    {props.lable && <div className="popup_text">{props.lable}</div>}
                    <Suspense fallback={<div></div>}>
                        {visable && ChildComponent}
                    </Suspense>
                    </>
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    ...get(state.popup, 'popup', {})

})
export default connect(mapStateToProps, mapDispatchToProps)(popup);

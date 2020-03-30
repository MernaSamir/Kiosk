import { Drawer } from 'antd';
import React, { Component } from "react";
import { get } from 'lodash'
import Keyboard from 'imports/field/components/keyboard'
import Numpad from 'imports/field/components/calc'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from "./style.less"
import ClickOutSide from 'helpers/components/click';
import Title from './title'
const components = {
    keyboard: { Component: Keyboard },
    numpad: { Component: Numpad }
}
class DrawerComponent extends Component {
    onClose = () => {
        const { resetAll } = this.props
        resetAll('bottom_sheet', {})
    };
    render() {
        const { type } = this.props
        const Component = get(components, type, '')
        const reset = [{
            type: 'reset_all_bottom_sheet',
            data: {}
        }]
        if (!window.cordova) {
            return (
                <div>
                    {Component && <ClickOutSide select_class={`.${classes.drawer}>.ant-drawer-content-wrapper`} reset={reset}>
                        <Drawer
                        className={classes.drawer}
                        title={<Title {...this.props.sheet}></Title>}
                        placement="bottom"
                        closable={true}
                        maskClosable={true}
                        mask={false}
                        destroyOnClose={true}
                        onClose={this.onClose}
                        visible={type ? true : false}
                        // height="50vh"
                    >

                        <Component.Component
                            {...this.props.sheet}
                            num={[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'D']}
                            clear={['C']}
                            remove={['D']}
                            className={classes.numpad}
                        />
                    </Drawer>
                    </ClickOutSide>
                    }
                </div>
            );

        }
        return <></>
    }
}
const mapStateToProps = (state, props) => ({
    sheet: state.bottom_sheet,
    type: state.bottom_sheet.type
})
export default connect(mapStateToProps, mapDispatchToProps)(DrawerComponent)
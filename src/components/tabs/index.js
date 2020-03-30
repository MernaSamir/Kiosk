import React, { Component } from 'react'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane;

export default class TabsC extends Component {



    // .Rectangle-1560 {
    //     width: 69.5px;
    //     height: 28.2px;
    //     box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.16);
    //     background-color: red;
    //   }

    callback = (key) => {
        // console.log(key);
    }
    render() {
        return (
            <Tabs defaultActiveKey="1" onChange={this.callback}>
                <TabPane tab={<div style={{
                     width: '69.5px',
                     height: '28.2px',
                    // : '0 1px 1px 0 rgba(0, 0, 0, 0.16)',
                    backgroundColor: 'red'

                }}>tab 1</div>} key="1">Content of Tab Pane 1</TabPane>
                <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
            </Tabs>
        )
    }
}

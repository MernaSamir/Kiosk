import React, { Component } from 'react'
import { Collapse } from 'antd';
import { map } from 'lodash'
import style from './style.less'
import FormControls from 'form_control'
import { withTranslation } from 'react-i18next';

const Panel = Collapse.Panel;

export class collapse_group extends Component {

    renderPanels = () => {
        const { panels, t } = this.props
        return map(panels, (panel, i) => {
            return <Panel header={t(Object.keys(panel))} key={i} className={style.customPanelStyle}>
                <p>{this.renderItems(Object.values(panel))}</p>
            </Panel>
        })
    }

    renderItems = (panel) => {
        const { onChange } = this.props
        return map(panel[0], (item, i) => {
            return <FormControls
                {...item}
                values={this.state}
                onChange={onChange}
            />
        })
    }

    render() {
        return (
            <Collapse accordion>
                {this.renderPanels()}
            </Collapse>
        )
    }
}

export default withTranslation()(collapse_group)

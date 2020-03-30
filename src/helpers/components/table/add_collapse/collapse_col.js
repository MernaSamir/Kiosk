import React, { Component } from 'react'
import { map } from 'lodash';
import TCell from './cell';
import Extra from './extra';
import { Collapse } from 'antd';
import {get} from 'lodash'
const Panel = Collapse.Panel;
export class Collapse_col extends Component {
    renderCols(part) {
        const { fields, index, mainValues } = this.props;
        const renderFileds = get(fields, part,{})
        return map(renderFileds, (f, k) => {
            return <TCell key={k} index={index} mainValues={mainValues} f={f} name={this.getFieldName(f)} />
        })
    }
    getFieldName = (f) => {
        const { field = {}, index } = this.props;
        return [field.name, index, f.name].filter(d => d).join('.')
    }
    renderExtra() {
        const { extras, data } = this.props;
        return map(extras, (button, index) => {
            return <td key={index}>
                <Extra button={{ text: index, ...button }} index={index} key={index} data={data} />
            </td>
        })
    }
    render() {
        return <Collapse accordion>
            <Panel header={this.renderCols('header')} >
                {this.renderCols('body')}
                {this.renderExtra()}
            </Panel>
        </Collapse >

    }
}

export class TColName extends Component {
    render() {
        return <>
            {this.renderCols('body')}
            {this.renderExtra()}
        </>
    }

}

export default Collapse_col

import React, { Component } from 'react'
import {map} from 'lodash';
import TCell from './cell';
import Extra from './extra';
export class TCol extends Component {
    renderCols(){
        const {fields, index, mainValues} = this.props;
        return map(fields, (f, k)=>{
            return <TCell key={k} index={index} mainValues={mainValues} f={f} name={this.getFieldName(f)} />
        })
    }
    getFieldName = (f)=>{
        const {field={}, index} = this.props;
        return [field.name, index, f.name].filter(d=>d).join('.')
    }
    renderExtra(){
        const {extras, data} = this.props;
        // console.log(extras)
        return map(extras, (button, index)=>{
            return <td key={index}>
                <Extra button={{text: index, ...button}} index={index} key={index} data={data} />
            </td>
        })
    }
    render () {
        return <>
            {this.renderCols()}
            {this.renderExtra()}
            </>
    }
}

export class TColName extends Component {
    render () {
        return <>
            {this.renderCols()}
            {this.renderExtra()}
        </> 
    }

}

export default TCol

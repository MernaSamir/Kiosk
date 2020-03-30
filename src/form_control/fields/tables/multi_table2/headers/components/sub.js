import React, { Component } from 'react';
import {map, get} from 'lodash';
import style from './style.less'
export class Main extends Component {
    constructor(props) {
        super(props);
    }
    renderHeader(d){
        const {fields} = this.props;
        return map(fields, (d, index)=>(
            <th key={index} className={style.subhead_td}>{d.head}</th>
        ))
    }
    renderHeaderCols(){
        const {colsList, settings} = this.props;
        const data = get(colsList, settings.reduxName)
        return map(data, (d)=>(this.renderHeader(d)))
    }
    renderTopLevel(){
    }
    render() {
        return <thead>
            <tr>
                {this.renderHeaderCols()}
            </tr>
        </thead>;
    }
}

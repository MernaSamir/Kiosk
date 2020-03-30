import React, { Component } from 'react';
import {map, get} from 'lodash';
import style from './style.less'
import { withTranslation } from 'react-i18next';
class MainClass extends Component {
    constructor(props) {
        super(props);
    }
    renderHeader(d){
        const {fields, t} = this.props;
        return map(fields, (d, index)=>(
            <th key={index} className={style.subhead_td}>{t(d.head)}</th>
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

export const Main = withTranslation()(MainClass)
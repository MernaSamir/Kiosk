import React from 'react';
import applyFilters from 'helpers/functions/filters';
import { map, filter, get, round, pick } from 'lodash'
import classes from './style.less'
export default class Items extends React.Component {
    renderCols(r){
        const {data} = this.props;
        return map(data.fields, (d, key)=>{
            return <td key={key}>{round(get(r, key), 2)}</td>
        })
    }
    renderHeaders(){
        const {data} = this.props;
        return map(data.fields, (d, key)=>{
            return <td key={key}>{d.title}</td>
        })
    }
    renderData() {
        const { data } = this.props;
        return map(data.report, (d, key) => {
            return <tr key={key}>
                    <td className={classes.depName}>{d.key || key}</td>
                    {this.renderCols(d)}
                </tr>
        })
    }
    render() {
        return (
            <table className={classes.table}>
                <thead>
                    <th></th>
                    {this.renderHeaders()}

                </thead>
                <tbody>
                    {this.renderData()}
                </tbody>
            </table>
        );
    }
}

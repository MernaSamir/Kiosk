import React, { Component } from 'react'
import Edit from 'components/edit_action'
import Delete from 'components/recycle_bin'
import classes from './style.less';
import { map , get, omit , set } from 'lodash'
import * as ShowFields from 'helpers/functions/show_field/'


 class table extends Component {
    // state={
    //     values:{
    //         currency:'',
    //         amount:'',
    //         depositer:'',
    //         date:'',
    //     }
    // }
    renderRowData = () => {
        const {row, fields  } = this.props
        return map(fields, (field, index) => {
            const data = get(row,field.name|| field.show)

            return <td key={index} className={classes.name}>
            {get(ShowFields, field.type, (d=>d))(data, row, field, this.props)}
            </td>
        })
    }
    EditDeposite =()=>{
        const {change, row} = this.props;
        change(row)

    }
    removeItem = (row,index)=>{
        const {field: {value: fValue, onChange, name}} = this.props
        if(row.created_at)
        {
            let value = {...fValue};
            set(value, `${index}.remove`, true)
            onChange({target: {name, value}})
        }
        else{
            onChange({target: {name, value: omit(fValue, [index])}})

        }

    }
    renderRowActions = () => {
        const { row, index} = this.props
            return <>
                <td  className={classes.note}> <Edit onAction={this.EditDeposite.bind(this)}/></td>
                <td  className={classes.note}><Delete  onAction={this.removeItem.bind(this , row, index)}  nopop="true"/> </td>
            </>
        // })
    }
    
    render() {

        return (
            <table className={classes.table}>
                <tbody>
                    <tr>
                        {this.renderRowData()}
                        {this.renderRowActions()}
                        </tr>
                </tbody>
            </table>
        )
    }
}
export default table
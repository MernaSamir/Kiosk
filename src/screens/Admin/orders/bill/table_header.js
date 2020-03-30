import React, { Component } from 'react'
import classes from './style.less'
export default class table_header extends Component {
    render() {
        const { receiptItem, t } = this.props
        return (
            <thead>
                <tr  >
                    
                    {receiptItem&&<th></th>}
                    <th >{t('Qty')}</th>
                    <th className={classes.bigCell}>{t('Item')}</th>
                    <th >{t('Size')}</th>
                    <th >{t('Each')}</th>
                    <th >{t('Total')}</th>
                </tr>
            </thead>
        )
    }
}

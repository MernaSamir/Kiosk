import React, { Component } from 'react'

export default class Table_header extends Component {
    render() {
        const {t} =  this.props

        return (
            <thead>
                <tr >
                    <th ></th>
                    <th ></th>
                    <th >{t('Order Number')}</th>
                    <th >{t('Receipt Number')}</th>
                    <th >{t('Gross Sales')}</th>
                </tr>
            </thead>
        )
    }
}

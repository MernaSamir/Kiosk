import React, { Component } from 'react'
import {map} from "lodash"
import applyFilters from 'helpers/functions/filters'
import classes from "./style.less"
import Table from './table'
import Order from './order'
import { withTranslation } from 'react-i18next';
import Header from 'components/header_back'


class Confirmation extends Component {
    renderHeaders = () => {
        const {t} = this.props
        return map(Table(), (d, index) => {
            return <th key={index} className={d.class}>{t(d.head)}</th>
        })
    }
    
      
  render() {
      const {t} = this.props
    const list = applyFilters({
        key: 'Filter',
        path: "orders__main",
        params: {
            status:'nc'
        }
      })
    return (
        <div className={classes.container}>
            {/* <p>Orders To Confirm</p> */}
            <Header name={t("Orders To Confirm")} />
        <table className={classes.reserv_list}>
                    <thead>
                        <tr  >{this.renderHeaders()}</tr>
                    </thead>
                    <tbody>
                        {map(list, (d, key) => (
                            <Order key={key} d={d} />
                        ))}
                    </tbody>
                </table>
                </div>

    )
  }
}
export default withTranslation()(Confirmation)


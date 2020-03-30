import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, map, pickBy, filter } from 'lodash'
import classes from './../style.less';
import Row from './row';
import { withTranslation } from 'react-i18next';

class Table extends Component {

  renderheader = () => {
        const { t } = this.props

    return <tr>
      <th className={classes.small}>{t("Qty")}</th>
      <th className={classes.big}>{t("Item")}</th>
      <th className={classes.small}>{t("Size")}</th>
      <th className={classes.small}>{t("Each")}</th>
      <th className={classes.midum}>{t("Total")}</th>
    </tr>
  }

  renderbody = () => {
    const { list } = this.props
    return map(pickBy(list, { parent: null }), (orderItem, index) => (
      <>
        <Row key={index} orderItem={orderItem}
          modifiers={filter(list, { parent: orderItem.id })} />
        <div className={classes.border}></div>
      </>
    ))
  }
  render() {
    return (
      <div className={classes.table}>
        <table>

          <thead>{this.renderheader()}</thead>

          <tbody>
            {this.renderbody()}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  list: get(state.orders__details, 'data', {})
})

export default connect(mapStateToProps)(withTranslation()(Table))

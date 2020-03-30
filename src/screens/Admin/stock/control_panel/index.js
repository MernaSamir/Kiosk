import React, { Component } from 'react'
import classes from './../style.less'
import { map } from 'lodash'
import { withRouter } from 'react-router-dom'
import Header from 'components/header_back'
import {withTranslation} from 'react-i18next'
class Stock extends Component {

  constructor(props) {
    super(props)
    this.buttons = {
      WasteOrder: {
        title: 'Waste Order',
        url: 'waste-order-inter-summary',
      },
      ReturnOrder: {
        title: 'Return Order', 
        url: 'return-order-inter-summary',
      },
      ManufactureOrder:{
        title:"Manufacture Order",
        url: "manufacture_cwh",
      },
      StockAudits:{
        title:'Audits',
        url:'audit-summary'
      },
      StockCount: {
        title: 'Stock Count',
        url: 'stock-count-summary',
      },

      Recieving:{
        title :"Recieving",
        url :"recieving"
      },
      RecieveOpen:{
        title: "Recive open",
        url:"recieve_open"
      }
      
    };
  }


  goTo = (d) => {
    const { history } = this.props;
    history.push("/app/" + d.url)
  }

  renderOptions = () => {
    const { history ,t} = this.props;

    return map(this.buttons, (d, key) => (
      <button key={key} className={classes.options_btn} onClick={this.goTo.bind(this, d)}>
        {t(d.title)}
      </button>
    ))

  }

  render() {
    const {t} = this.props
    return (
      <div className={classes.all}>
        <Header name= {t("Stock")}/>
        <div className={classes.options_div}>
          {this.renderOptions()}
        </div>
      </div>
    )
  }
}

export default withRouter(withTranslation()(Stock))

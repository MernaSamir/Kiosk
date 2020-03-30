import React, { Component } from 'react'
import './table.css'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router-dom'
import { get, filter, reject, head } from 'lodash'
import Counter from 'components/counter'
import classes from './style.less'
import { getSize } from 'helpers/index';
import applyFilter from 'helpers/permissions'


class TableRectancle extends Component {
  status = {
    allPrinted: {
      permissions: {
        table: {
          check: 'active',
        },
        order: {
          checkAllPrinted: { list: "receipts" }
        }
      },
      status: 'allPrinted',
      img: ['allPrinted', 'printedServed'],
      class: 'printed'
    },
    halfPrinted: {
      permissions: {
        table: {
          check: 'active'
        },
        order: {
          checkHalfPrinted: { list: "receipts" }
        }

      },
      status: 'halfPrinted',
      img: ['halfPrinted', 'partPrintedServed'],
      class: 'printed'
    },
    allServed: {
      permissions: {
        table: {
          check: 'active',
          check_all_list: { key: 'status', list: "orderDetails" },
        }

      },
      status: 'allServed',
      img: ['allServed'],
      class: 'served'
    },
    partServed: {
      permissions: {
        table: {
          check: 'active',
          check_half_list: { key: 'status', list: "orderDetails" },
        }

      },
      status: 'halfServed',
      img: ['halfServed'],
      class: 'served'
    },
    allFired: {
      permissions: {
        table: {
          check: 'active',
          check_all_list: { key: 'fired_time', list: "orderDetails" },
        }

      },
      status: 'allFired',
      img: ['allFired'],
      class: 'fired'
    },
    partFired: {
      permissions: {
        table: {
          check: 'active',
          check_half_list: { key: 'fired_time', list: "orderDetails" },
        }

      },
      status: 'halfFired',
      img: ['halfFired'],
      class: 'fired'
    },
    orderd: {
      permissions: {
        table: {
          check: 'active',
          check_length_list: { list: "orderDetails" }
        }
      },
      status: 'orderd',
      img: ['orderd'],
      class: 'orderd'
    },
    opened: {
      permissions: {
        table: {
          check: 'active',
          check_not_length: { list: "orderDetails" }
        }
      },
      status: 'opend',
      img: ['opend'],
      class: 'opend'
    },
    free: {
      permissions: {
        table: {
          check_not: 'active'
        }
      },
      status: 'free',
      img: ['opend'],
      class: 'free'
    },
  }
  constructor(props) {
    super(props);
    this.images = this.importAll(require.context('./../../../../assets/images', false, /\.(png|jpe?g|svg)$/));
    this.state = {};
  }
  importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  button = {
    separate: {
      title: 'separate',
      permissions: {
        table: {
          check_not: 'active',
          check: 'combined'
        }
      }
    }
  }
  separate = () => {
    const { table, setMain } = this.props
    setMain('dinin__tables', { item: { id: table.id, action: 'update'} })
  }

  renderStatus = () => {
    const { order, t } = this.props
    const status = this.main_status;
    if (status.status == 'free')
      return <span>{t('Free')}</span>
    else
      return <>
        <span><Counter start={order.start_time} /></span>
        {status.img.map((d, idx) => (<img key={idx} src={this.images[d + '.svg']} />))}
      </>


  }
  getStatus = () => {
    const { table, order, orderDetails, receipts } = this.props
    const status = filter((this.status), applyFilter(table, "permissions.table", { receipts, orderDetails })).filter(
      applyFilter(order, 'permissions.order', { orderDetails, receipts }))
    return head(status)
  }
  renderGuests = () => {
    const { order } = this.props
    if (order.guests_num)
      return <span  >G: {order.guests_num}</span>
  }
  renderBtn = () => {
    const { table } = this.props
    // const btn = find((this.button), applyFilter(table, "permissions.table"))
    if (table.combined) {
      return <button className={classes.btn}>{this.button.separate.title}</button>
    }

  }





  render() {

    const { table, unit, openModal, editTable } = this.props
    const size = getSize(table.shape, table.size, unit)
    this.main_status = this.getStatus()

    return (
      <div onClick={openModal.bind(this)} onContextMenu={editTable.bind(this)}
        className={`${get(classes, table.shape, {})} ${get(classes, this.main_status.class)}`}
        style={{ width: `${size.width}vw`, height: `${size.height}vw` }}>

        <div className={classes.start}>
          <div className={classes.tableTitle} >{table.name}</div>
          {this.renderGuests()}
        </div>
        {this.renderBtn()}
        <div className={classes.status}>
          {this.renderStatus()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  order: get(state.orders__main.data, ownProps.table.active, {}),
  orderDetails: reject(filter(state.orders__details.data, { order: ownProps.table.active, parent:null }), { deleted: true }),
  receipts: filter(state.orders__receipt.data, { order: ownProps.table.active })
})

const wrapper = connect(mapStateToProps, mapDispatchToProps)(TableRectancle)

export default withRouter(wrapper)

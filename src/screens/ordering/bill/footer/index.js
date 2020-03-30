import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { get, pickBy, head, every, map, filter, xor } from "lodash";
import mapDispatchToProps from "helpers/actions/main";
import classes from "./style.less";
import { Modes as urls } from 'config';
import applyFilter from 'helpers/permissions'
import applyFilters from 'helpers/functions/filters'
import { message } from 'antd';

const actions = {
  hold: {
    title: "Hold Order",
    icon: "clock",
    action: {
      name: "hold",
    },
  },

  cancel: {
    title: "Cancel Order",
    icon: "times",
    show: {
      key: 'checkStationType',
      not: true,
      type: 'sma_w'
    },
    action: {
      name: "cancelOrder",
      params: {
        type: 'Cancel'
      }
    },
    authorize: ["cancel_order"],
    permissions: {
      order: {
        check_not_fired: { key: 'fired_time', list: "orderDetails" }
      }
    }
  },

  void: {
    title: "Void Order",
    icon: "times",
    action: {
      name: "cancelOrder",
      params: {
        type: 'Void'
      }
    },
    authorize: ["void_item"],
    permissions: {
      order: {
        void_order: {}
      }
    }
  },

  discount: {
    title: "Discount Order",
    icon: "percent",
    show: {
      key: 'checkStationType',
      not: true,
      type: 'sma_w'
    },
    authorize: ["discount_order"],
    action: {
      name: "discountOrder"
    }
  },

  print: {
    title: "Print Order",
    icon: "print",
    authorize: ["print"],
    action: {
      name: "printOrder"
    },
    permissions: {
      order: {
        check_print: { key: 'id', list: "receipts" }
      }
    }
  },

  reprint: {
    title: "Reprint Order",
    icon: "print",
    authorize: ["reprint"],
    show: {
      key: 'checkStationType',
      not: true,
      type: 'sma_w'
    },
    action: {
      name: "reprint"
    },
    permissions: {
      order: {
        check_reprint: { key: 'id', list: "receipts" },
      }
    }
  },

  // comp: {
  //   title: "COMP",
  //   icon: "gift",
  //   action: "comp"
  // },

  pay: {
    show: {
      key: 'checkStationType',
      not: true,
      type: 'sma_w'
    },
    title: "Pay",
    authorize: ["pay"],
    icon: "dollar-sign",
    action: {
      name: "payOrder"
    }
  },

  pay_di: {
    show: {
      key: 'checkStationType',
      not: true,
      type: 'sma_w'
    },
    authorize: ["pay"],
    title: "Pay",
    icon: "dollar-sign",
    action: {
      name: "payDinInOrder"
    }
  },

  send_to_location: {
    show: {
      key: 'checkStationType',
      not: true,
      type: 'sma_w'
    },
    title: "Send",
    icon: "share-square",
    action: {
      name: "sendToLoc"
    }
  },

  confirm: {
    show: {
      key: 'checkStationType',
      not: true,
      type: 'sma_w'
    },
    title: "Confirm",
    icon: "check",
    action: {
      name: "needToConfirm"
    }
  },

  done: {
    show: {
      key: 'checkStationType',
      not: true,
      type: 'sma_w'
    },
    title: "Done",
    icon: "check",
    action: {
      name: "DoneMenu"
    }
  },
};

class BillFooter extends Component {
  state = {
    ModalVisible: false,
    values: {}
  };

  Actions = {
    TW: [actions.cancel, actions.discount, actions.hold, actions.pay],
    CC: [actions.cancel, actions.discount, actions.confirm, actions.send_to_location],
    DL: [actions.cancel, actions.discount, actions.hold, actions.pay],
    EV: [actions.done],
    DI: [actions.cancel, actions.void, actions.discount, actions.print, actions.reprint, actions.pay_di],
    CT: [actions.done],

  };

  comp = () => {
    const { setMain } = this.props
    setMain('popup', { type: 'Complimentary', visable: true, width: "50%" })
  }

  payOrder = () => {
    const { history } = this.props;
    history.push("/Home/payment");
  };

  calculateBill = (receipt) => {
    const orderDetails = applyFilters({
      key: 'Filter',
      path: 'orders__details',
      params: {
        order: receipt.order
      }
    })
    const items = applyFilters({
      key: 'Filter',
      path: 'orders__receipt_items',
      params: {
        receipt: receipt.id
      }
    })
    const calc = applyFilters({
      key: 'calculateReceipts',
      path: 'orders__receipt',
    }, orderDetails, undefined, { receipt: receipt.id, seatsNum: receipt.seats, combine: true })

    const one = map(items, d=>(d.id))
    const two = map(head(calc).items, d=>d.id)
    const diff = xor(one, two)
    return head(calc).net_total == receipt.net_total && !diff.length
  }

  payDinInOrder = () => {
    const { setMain, activeOrder, history } = this.props
    let receipts = applyFilters({
      key: 'Filter',
      path: 'orders__receipt',
      params: {
        order: activeOrder.id
      }
    })
    receipts = receipts.filter(d => !d.invoice)
    if (receipts.length == 1) {
      const pay = this.calculateBill(head(receipts))
      if (pay) {

        setMain("orders__receipt", { active: head(receipts).id });
        history.push('/Home/payment');
      }
      else {
        message.warning('You Have To Reprint')
      }
    }
    else {
      const popup = {
        type: 'PayReceipt', visable: true, width: "50%"
      }
      setMain('popup', { popup })
    }
  }

  takeAction = (action) => {
    get(this, action.name, () => { })(get(action, 'params', ''))
  };

  reprint = () => {
    const { setMain, order, t } = this.props
    const details = applyFilters({
      key: 'Filter',
      path: 'orders__details',
      params: {
        order,
        parent: null
      },
      then: {
        key: 'Reject',
        params: {
          deleted: true
        }
      }
    })
    const allFired = every(details, 'fired_time')
    if (allFired) {
      const popup = {
        type: 'ReprintReceipt', visable: true, width: "50%"
      }
      setMain('popup', { popup })
    }
    else {
      message.warning(t('You Have To Fire All Items Before Reprint'))
    }
  }

  printOrder = () => {
    const { setMain } = this.props
    const popup = {
      type: 'PrintOrder', visable: true, width: "50%",
      childProps: {
        onClick: this.print
      }
    }
    setMain('popup', { popup })
  }

  print = () => {
    const { reset } = this.props;
    reset('Printing', { print: { active: 'Receipt' } })
  }

  discountOrder = () => {
    const { history, setMain, order } = this.props;

    if (history.location.pathname == "/Home/discount") {
      history.push('/home')
    } else {
      setMain('orders__orders_discount', {
        item: {
          order
        }
      })
      history.push("/Home/discount");
    }
  };
  cancelOrder = (params) => {
    const { setMain, order } = this.props;

    const popup = {
      type: 'CancelCustomer', visable: true, width: "50%",
      childProps: {
        Title: `${params.type} Order`,
        first_msg: `Are You Sure You Want To ${params.type} This Order ?`,
        pressYes: () => {
          setMain("orders__main", {
            item: {
              canceled_time: new Date(),
              end_time: new Date(),
              id: order,
              action: 'update',
              onSuccess: this.goHome
            }
          })
        }
      }
    }
    setMain('popup', { popup })
  }

  cancelOrder = () => {
    const { setMain, order } = this.props;
    const popup = {
      type: 'CancelCustomer', visable: true, width: "50%",
      childProps: {
        Title: 'Cancel Order',
        first_msg: `Are you sure you want to Cancel this Order ?`,
        pressYes: () => {
          setMain("orders__main", {
            item: {
              canceled_time: new Date(),
              end_time: new Date(),
              id: order,
              action: 'update',
              onSuccess: this.goHome
            }
          })
        }
      }
    }
    setMain('popup', { popup })
  }

  // cancelOrder = () => {
  //   const { order, setMain } = this.props;
  //   setMain("orders__main", {
  //     item: {
  //       canceled_time: new Date(),
  //       end_time: new Date(),
  //       id: order,
  //       action: 'update',
  //       onSuccess: this.goHome
  //     }
  //   });
  // };

  goHome = () => {
    const { history, mode, table } = this.props;
    let dis = [
      { type: 'set_main_dinin__tables', data: { active: '' } },
      { type: 'set_main_orders__main', data: { active: '' } },
      { type: 'set_main_popup', data: { active: '' } },
    ]
    if (table) {
      dis.push({ type: 'set_path_dinin__tables', path: `data.${table}.active`, data: null })
    }
    history.push(urls[mode.key]);
    return dis
  }

  okClick = (Note) => {
    const { activeOrder, setMain } = this.props
    setMain("orders__main", {
      active: activeOrder.id,
      item: {
        id: activeOrder.id,
        hold_time: new Date(),
        call_name: Note,
        action: 'update',
        onSuccess: this.finishUpdate
      }
    })
  }

  onSubmit = (values) => {
    const { order, setMain } = this.props
    setMain('orders__main', {
      item: {
        id: order,
        confirm_reason: values.reason,
        status: "nc",
        action: 'update',
        onSuccess: this.save.bind(this, "nc")

      }
    })
  }

  finishUpdate = (order) => {
    // this.cancelClick()
    return [{
      type: 'set_main_orders__main',
      data: { active: '' }
    },
    {
      type: 'set_path_orders__main',
      data: { item: order }
    },

    ]
  }

  hold = () => {
    const { setMain } = this.props
    setMain('popup', {
      popup: {
        type: "AddNote",
        childProps: {
          title: 'Hold Order',
          sub: "Call name or Notes:",
          onClick: this.okClick
        }
      }
    })
  }

  sendToLoc = () => {
    const { setMain, activeOrder, order } = this.props
    const location = applyFilters({
      key: 'chain',
      selectors: {
        "parties__address": "address",
        "geographies__street": "street",
        "geographies__area": 'area',
        "licensing__location": 'location',
      },
      // display: "full_name"
    }, activeOrder) ||
      applyFilters({
        key: 'chain',
        selectors: {
          "licensing__location": 'pick_location'
        }
      }, activeOrder)

    setMain('orders__main', {
      item: {
        id: order,
        status: "stl",
        served_location: location.id,
        action: 'update',
        onSuccess: this.save.bind(this, "stl", location.full_name)
      }
    })
  }

  needToConfirm = () => {
    const { setMain } = this.props
    const popup = {
      type: 'SelectOnly', visable: true, width: "50%",
      childProps: {
        onClick: this.onSubmit
      }

    }
    setMain('popup', { popup })
  }

  save = (status, location) => {
    const { mode, history, order } = this.props;
    const popup = {
      type: 'Save', visable: true, width: "50%",
      childProps: {
        msg: status == 'nc' ? "Order Sent to Confirmer" : `Order Sent to ${location}`,
        only: true
      }
    }
    history.push(get(urls, mode.key))
    const filters = {fired_time__isnull: true, deleted: false, parent__isnull: true, order}
    return [{
      type: 'set_main_popup',
      data: { popup }
    }, {
      type: 'set_main_orders__main',
      data: { active: '' }
    },
    {
      type: 'set_main_orders__details',
      data: { item: {
        filter: filters,
        exclude: {
            deleted: true
        },
        data: {
            fired_time: new Date()
        },
        action: 'manyEdit',
        
    } }
    }
  ]
  }
  printKitchen = (items) => {
    const { order, history, mode = {} } = this.props;

    let out = [{
      type: 'set_main_orders__details',
      data: {
        item: {
          seat_num: this.active_seat
        }
      }
    }, {
      type: 'set_main_orders__main',
      data: { active: '' }
    }, {
      type: 'set_main_Printing',
      data: {
        print: {
          active: 'Kitchen',
          order: order.id,
          items: map(items, d => d.id),
        }
      }
    }]
    history.push(get(urls, mode.key))
    return out
  }

  DoneMenu = () => {
    
    const { setMain , order, values ,history} = this.props
    setMain('orders__main', {
      item: {
        id:order, 
        sub_mode: values.basic.order_type, 
        action:'update', }
        
    })
    history.goBack()
    }

  render() {
    const { mode = {}, activeOrder, receipts, orderDetails, history, calc, t } = this.props;

    const receipt_items = applyFilters({
      key: 'Includes',
      path: 'orders__receipt_items',
      pick: 'id',
      select: 'receipt',

    }, undefined, undefined, { data: filter(receipts, d => d.invoice) })
    const Actions = get(this.Actions, mode.key, []);
    const show = !history.location.pathname.includes('payment')
    if (show) {
      return (
        <div className={classes.bill_footer}>
          {Actions.filter(d => (applyFilters(d.show || { key: 'true' }, {}))).filter(
            applyFilter(activeOrder, 'permissions.order', { receipts, orderDetails, calc, receipt_items }))
            .map((d, k) => (
              <button key={k} className={classes.footer_btn}
                disabled={!applyFilters({
                  key: 'authorize',
                  compare: d.authorize,
                })}
                onClick={this.takeAction.bind(this, d.action)}>
                <div><FontAwesomeIcon icon={d.icon} className={classes.footerIcon} /></div>
                <span >{t(d.title)}</span>
              </button>
            ))}
        </div>
      );
    }
    return <></>
  }
}

const mapStateToProps = (state, props) => ({
  mode: get(state.settings__mode, `data.${state.settings__mode.active}`, {}),
  table: state.dinin__tables.active,
  order: state.orders__main.active,
  // chain: get(state.licensing__chain, `data.${get(state.licensing__chain, 'active', '')}`, {}),
  // show: !props.history.location.pathname.includes('payment'),
  activeOrder: get(state.orders__main.data, state.orders__main.active),
  get receipts() { return pickBy(state.orders__receipt.data, { order: this.order }) },
  get orderDetails() { return pickBy(state.orders__details.data, { order: this.order, deleted: false }) },
  values: get(state,'form.event.values')

});

export default withRouter(connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(BillFooter))
import React from 'react'
import RenderdropDown from 'helpers/functions/drop_down'
import Actions from './actions'
import classes from "./style.less"
import Clock from 'helpers/components/clock'
import {Cal_Order} from 'components/order_value'
import SelectRow from 'components/select_row'

export default (row = {},status , fun) => (
    [
      { head: '', Component: <SelectRow row={row} onClick='activeOrder' />, class: classes.empty },

      { head: 'Number', view: 'num' , class: classes.name },
  
      {
        head: 'Customer', class: classes.name,
        Component: <RenderdropDown appName="parties__customer" show="name"
          filter={[row.customer]} filterKey='id' />,
      }, 
      {
        head: 'DSP', class: classes.name,
        Component: <RenderdropDown appName="delivery_service" show="name"
          filter={[row.sp]} filterKey='id' type='dropDown' />,
      },

      { head: 'Phone', Component: <RenderdropDown appName="parties__customer_contacts" show="contact"
      filter={[row.customer]} type='dropDown' filterKey='customer' />, class: classes.phone },
  
      { head: 'Time', Component: <Clock format="HH:mm" select={row} fun={fun} />, class: classes.date },
  
      { head: 'Value', Component:<Cal_Order order={row}/> , class: classes.table },
      
      
      {
        head: 'Reason', class: classes.name,
        Component: <RenderdropDown appName="dropdowns__reasons" show="name"
          filter={[row.confirm_reason]} filterKey='id' />,
      },  

      { head: 'Status', class: classes.date, Component: <button className={classes.normal}>{status}</button> },
  
      {
        head: 'Action', class: classes.icons,
        Component: <Actions className={classes.actions} order={row} />,
      }
    ])
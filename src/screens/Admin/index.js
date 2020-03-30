import React, { Component, Suspense, lazy } from 'react'
const PanelControl = lazy(()=>import('./panel_control'));
const OrderAdmin = lazy(()=>import('./orders'));
const OrdersPanel = lazy(()=>import('./orders_panel'));
const CashFlow = lazy(()=>import('./cash_flow'));
const ChashierSettlement = lazy(()=>import('./cash_settlement/cashier_settlement'));
const PosSettings = lazy(()=>import('./pos_settings'));
const DayShift = lazy(()=>import('./day_shift'));
const PayInOut = lazy(()=>import('./pay_all'));
const Report = lazy(()=>import('./reports'));
const Station = lazy(()=>import('./station'));
const Stock = lazy(()=>import('./stock'));
const SafeDrop = lazy(()=>import('./safe_drop'));
const ChangeTablesWaiter = lazy(()=>import('./change_tables_waiter'));
const Control = lazy(()=>import('./control'));
const WaitingConfirmation = lazy(()=>import('./waiting_confirmation'));
const Floorplan = lazy(()=>import('./floorplan'));
import { Route } from 'react-router-dom';
import {connect} from 'react-redux'
import {get} from 'lodash'
import StockCWH from './stock_cwh';

class Admin extends Component {
    render() {
        const { match, station } = this.props
        const StockComponent = (station._type == "cwh") ? StockCWH:Stock
        return (
            <div style={{ height: '91%' }}>
                <Suspense fallback={<></>}>
                    <Route exact path={`${match.url}/`} component={PanelControl} />
                    <Route path={`${match.url}/admin_orders`} component={OrderAdmin} />
                    <Route path={`${match.url}/orders`} component={OrdersPanel} />
                    <Route path={`${match.url}/floorplan`} component={Floorplan} />
                    <Route path={`${match.url}/cashier_flow`} component={CashFlow} />
                    <Route path={`${match.url}/cashier_settlement`} component={ChashierSettlement} />
                    <Route path={`${match.url}/pos_settings`} component={PosSettings} />
                    <Route path={`${match.url}/day_shift`} component={DayShift} />
                    <Route path={`${match.url}/pay_all`} component={PayInOut} />
                    <Route path={`${match.url}/safe_drop`} component={SafeDrop} />
                    <Route path={`${match.url}/report`} component={Report} />
                    <Route path={`${match.url}/add_station`} component={Station} />
                    <Route path={`${match.url}/change_tables_waiter`} component={ChangeTablesWaiter} />
                    <Route path={`${match.url}/stock`} component={StockComponent} />
                    <Route path={`${match.url}/control`} component={Control} />
                    <Route path={`${match.url}/confirm`} component={WaitingConfirmation} />
                    {/* <Route path={`${match.url}/attendance`} component={Attendance} /> */}


                </Suspense>

            </div>
        )
    }
}

export default connect((state)=>({
    station: get(state.licensing__station.data, state.licensing__station.active, {})
}))(Admin)
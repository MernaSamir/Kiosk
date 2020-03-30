import React, { Component, Suspense, lazy } from 'react'
import { Route } from 'react-router-dom';
// import loadable from '@loadable/component'
import Loading from "helpers/components/loading";
import loadable from '@loadable/component'
// import Home from 'containers/app-container'
// import Home from 'containers/app-container'
const Home = lazy(() => import('containers/app'))
const Station = lazy(()=>import('screens/Station'))
// const Header = lazy(()=>import('containers/Header'))
const Hold_Order = lazy(() => import('screens/Hold_Order'))
const FloorPlanner = lazy(() => import('screens/DineIn'))
const TablesPlanner = lazy(() => import('screens/DineIn/tables'))

const CustomerInformation = loadable(() => import('screens/Customer/info'), {
    fallback: <Loading />,
})
const Header = loadable(() => import('containers/Header'), {
    fallback: <Loading />,
})
const Setting = loadable(() => import('screens/setting'), {
    fallback: <Loading />,
})

// const CustomerInformation = lazy(()=>import('screens/Customer/info'))
const CustomerEdit = lazy(()=>import('screens/Customer/info/edit'))
// const CustomerInformation = lazy(() => import('screens/Customer/info'), {
//     fallback: <Loading />,
// })
const CustomerSummery = lazy(() => import('screens/Customer/CustomerSummary'))
const CustomerList = lazy(() => import('screens/Customer/CustomerList'))
// import Admin from 'containers/admin-app-container';
const Admin = lazy(() => import('containers/admin'))
const SplitCheck = lazy(() => import('screens/split_check'))
const Delivery = lazy(() => import('screens/Delivery'))
const Counter = lazy(() => import('components/counter'))

import errorMsg from 'screens/errors'
const Packing = lazy(() => import('screens/displays/Packing'))
const Kitchen = lazy(() => import('screens/displays/Kitchen'))
const DeliveryDispatcher = lazy(() => import('screens/displays/delivery'))
const Reservations = lazy(() => import('screens/Reservations/'))
const NewReservation = lazy(()=> import('screens/Reservations/new_reservation'))
const ReservationEdit = lazy(()=> import('screens/Reservations/new_reservation/edit'))
const AssignTables = lazy(()=> import('screens/Reservations/assign_tables'))
const Events = lazy(()=>import('screens/events'))
const NewEvent = lazy(()=> import('screens/events/new_event'))
const EditEvent = lazy(()=> import('screens/events/new_event/edit'))
// const TodayEvents = lazy(()=> import('screens/events/events_of_today'))
const GroupDif = lazy(()=> import('screens/displays/delivery/group_dif'))
// const CallCenter = lazy('screens/call_center')
const EventTabs = lazy(()=>import('screens/events/tabs'))
const Catering = lazy(()=>import('screens/catering/order_status'))
const NewCatering = lazy(()=>import('screens/catering/new_catering'))
const EditCatring = lazy(()=> import('screens/catering/new_catering/edit'))

const CateringList = lazy(()=>import('screens/catering/order_status'))
const CallCenterList = lazy(()=>import('screens/call_center/chain_list/order_status'))
const FormContainer = lazy(()=>import('containers/form'))
const Popup = lazy(()=>import('components/popups'))
const CallCenter = lazy(()=>import('screens/call_center'))
const TodayEvents = lazy(()=>import('screens/events/events_of_today'))
const Staff = lazy(()=>import('screens/staff_meal'))
const Start_screen =lazy(()=>import('screens/start'))
import classes from './style.less'
import { connect } from 'react-redux'


import mapDispatchToProps from 'helpers/actions/main'

const Routes = (props) => (

<>
    <Suspense fallback={<Loading />}>
        <Route exact path ="/" component={Start_screen}/>
        <Header />
        <Route exact path ="/setting" component={Setting}/>
        {/* <Route exact path="/lock" component={errorMsg} />
        <Route path="/admin" component={Admin} />
        <Route path="/Home" component={Home}/>
        <Route path="/customer-summary" component={CustomerSummery} />
        <Route path="/new/:type" component={CustomerInformation} />
        <Route path="/edit/:id" component={CustomerEdit} />
        <Route path="/list" component={CustomerList} />
        <Route path="/station" component={Station} />
        <Route path="/holdorder" component={Hold_Order} />
        <Route path="/floor-plan" component={FloorPlanner} />
        <Route path="/tables-planner" component={TablesPlanner} />
        <Route path="/split-check" component={SplitCheck} />
        <Route path="/call_center" component={CallCenter} />
        <Route path="/delivery" component={Delivery} />
        <Route path="/Counter" component={Counter} />
        <Route path="/group_Dif" component={GroupDif} />
        <Route path="/kitchen" component={Kitchen} />
        <Route path="/packing" component={Packing} />
        <Route path="/dispatcher" component={DeliveryDispatcher} />
        <Route path="/reservations" component={Reservations} />
        <Route path="/assign_tables" component={AssignTables} />
        <Route path="/new_reservation" component={NewReservation} />
        <Route path="/edit_rese/:id" component={ReservationEdit} />
        <Route path="/edit_event/:id" component={EditEvent} />
        <Route path="/event_list" component={Events} />
        <Route path="/new_event" component={NewEvent} />
        <Route path="/events" component={TodayEvents} />
        <Route path="/event_tabs" component={EventTabs} />
        <Route path="/catering" component={Catering} />
        <Route path="/new_cat" component={NewCatering} />
        <Route path="/edit_catring/:id" component={EditCatring} />

        <Route path="/catring_list" component={CateringList} />
        <Route path="/call_center_list" component={CallCenterList} />
        <Route path="/staff" component={Staff} />
        <Route path="/app" component={FormContainer} />
        <Popup /> */}
    </Suspense>
</>)


class AppRouting extends Component {
    render() {
        return (
                <div className={classes.app_container}>
                    <Routes /> 
                </div>
         
        )
    }
}

export default connect((state) => ({
    shift: state.orders__shifts.active
}), mapDispatchToProps)(AppRouting)

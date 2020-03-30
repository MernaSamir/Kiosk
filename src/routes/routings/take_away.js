import React from 'react'
import { Route } from 'react-router-dom';
import loadable from '@loadable/component'
import Loading from "helpers/components/loading";

// import Home from 'containers/app-container'
const Home = loadable(() => import('containers/app-container'), {
    fallback: <Loading />,
})
import Station from 'screens/Station'

const Hold_Order = loadable(() => import('screens/Hold_Order'), {
    fallback: <Loading />,
})
const FloorPlanner = loadable(() => import('screens/DineIn'), {
    fallback: <Loading />,
})
import TablesPlanner from 'screens/DineIn/tables'


import CustomerInformation, { CustomerEdit } from 'screens/Customer/info';
// const CustomerInformation = loadable(() => import('screens/Customer/info'), {
//     fallback: <Loading />,
// })
const CustomerSummery = loadable(() => import('screens/Customer/CustomerSummary'), {
    fallback: <Loading />,
})
const CustomerList = loadable(() => import('screens/Customer/CustomerList'), {
    fallback: <Loading />,
})
// import Admin from 'containers/admin-app-container';
const Admin = loadable(() => import('containers/admin-app-container'), {
    fallback: <Loading />,
})
const SplitCheck = loadable(() => import('screens/split_check'), {
    fallback: <Loading />,
})
const Delivery = loadable(() => import('screens/Delivery'), {
    fallback: <Loading />,
})
const Counter = loadable(() => import('components/counter'), {
    fallback: <Loading />,
})
const Tests = loadable(() => import('components/stop-watch'), {
    fallback: <Loading />,
})
const Quntity = loadable(() => import('screens/Quntity'), {
    fallback: <Loading />,
})
import NewReservation, { ReservationEdit } from 'screens/Reservations/new_reservation'

const Packing = loadable(() => import('screens/displays/Packing'), {
    fallback: <Loading />,
})
const Kitchen = loadable(() => import('screens/displays/Kitchen'), {
    fallback: <Loading />,
})
const DeliveryDispatcher = loadable(() => import('screens/displays/delivery'), {
    fallback: <Loading />,
})
const Reservations = loadable(() => import('screens/Reservations/'), {
    fallback: <Loading />,
})
const NewReservation = React.lazy('screens/Reservations/new_reservation')
import AssignTables from 'screens/Reservations/assign_tables'
import Events from 'screens/events'
import NewEvent, { EditEvent } from 'screens/events/new_event'
import TodayEvents from 'screens/events/events_of_today'
import Popup from 'components/popups'
import GroupDif from 'screens/displays/delivery/group_dif';
import CallCenter from 'screens/call_center';
import EventTabs from 'screens/events/tabs'
import Catering from 'screens/catering';

const Routes = (props)=>(<>
    <Route path="/admin" component={Admin} />
    <Route path="/Home" component={Home} />
    <Route path="/station" component={Station} />
    <Route path="/holdorder" component={Hold_Order} />
    <Route path="/floor-plan" component={FloorPlanner} />
    <Route path="/tables-planner" component={TablesPlanner} />
    <Route path="/split-check" component={SplitCheck} />
    <Route path="/call_center" component={CallCenter} />
    <Route path="/delivery" component={Delivery} />
    <Route path="/Counter" component={Counter} />
    <Route path="/customer-summary" component={CustomerSummery} />
    <Route path="/new/:type" component={CustomerInformation} />
    <Route path="/edit/:id" component={CustomerEdit} />
    <Route path="/list" component={CustomerList} />
    <Route path="/Test" component={Tests} />
    <Route path="/quntity" component={Quntity} />
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
</>)

export default Routes

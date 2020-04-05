import React, { Component, Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import Loading from "helpers/components/loading";
import loadable from "@loadable/component";

const Home = lazy(() => import("screens/Home"), {
  fallback: <Loading />
});
const Header = loadable(() => import("containers/Header"), {
  fallback: <Loading />
});
const Setting = loadable(() => import("screens/setting"), {
  fallback: <Loading />
});
const Order = loadable(() => import("screens/order"), {
  fallback: <Loading />
});

const Payment = loadable(() => import("screens/PaymentLocation"), {
  fallback: <Loading />
});

const Final = loadable(() => import("screens/final"), {
  fallback: <Loading />
});

const modifier = loadable(() => import("screens/modifier"), {
    fallback: <Loading />
  });

const Start_screen = lazy(() => import("screens/start"));
import classes from "./style.less";
import { connect } from "react-redux";

import mapDispatchToProps from "helpers/actions/main";

const Routes = props => (
  <>
    <Suspense fallback={<Loading />}>
      <Route exact path="/" component={Start_screen} />
      <Header />
      <Route exact path="/setting" component={Setting} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/order" component={Order} />
      <Route exact path="/payment" component={Payment} />
      <Route exact path="/final" component={Final} />
      <Route exact path="/modifier" component={modifier} />

    </Suspense>
  </>
);

class AppRouting extends Component {
  render() {
    return (
      <div className={classes.app_container}>
        <Routes />
      </div>
    );
  }
}

export default connect(
  state => ({
    shift: state.orders__shifts.active
  }),
  mapDispatchToProps
)(AppRouting);

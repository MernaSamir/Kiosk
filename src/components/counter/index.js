import React, { Component } from 'react'

import moment from 'moment';

export default class Counter extends Component {
  constructor(props) {
    super(props);
    const { start = '' } = this.props;
    const data = moment().set({ hours: 0, minute: 0, seconds: 0 }).add(moment().diff(moment(new Date(start))))
    this.state = { seconds: data };
  }

  tick() {
    this.setState(prevState => ({
      seconds: prevState.seconds.add(1, 'm')
    }));
  }

  componentDidMount() {
    // this.interval = setInterval(() => this.tick(), 60 * 1000);
  }

  componentWillUnmount() {
    // clearInterval(this.interval);
  }

  render() {

    return (
      moment(this.state.seconds).format('HH:mm')
    );
  }
}

import React, { Component } from 'react'
import classes from '../style.less'
import { withRouter } from 'react-router'
import Header from './header';
import Footer from './footer';
import Body from './body';

class LeftComponent extends Component {

    state = {
        obj: {}
    }

    getFinalSettings = (obj) => {
        this.setState({
            obj: obj
        })
    }

    componentDidMount() {
        this.setState({ obj: {} })
    }

    render() {
        return (
            <div className={classes.pos_container}>
                <Header />
                <Body getFinalSettings={this.getFinalSettings} />
                <Footer obj={this.state.obj} getFinalSettings={this.getFinalSettings} />
            </div>
        )
    }
}

export default withRouter(LeftComponent)
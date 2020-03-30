import React, { Component } from 'react'
import classes from './style.less';
import Header from './header';
import Title from './title';
import Table from './table';
import Footer from './footer';

class LeftPart extends Component {

    render() {
        return (
            <div className={classes.split_payment_container}>
                <Header />
                <Title />
                <Table />
                <Footer />
            </div>
        )
    }
}

export default LeftPart
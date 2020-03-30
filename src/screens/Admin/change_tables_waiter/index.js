import React, { Component } from 'react'
import { connect } from 'react-redux';
import { get, pickBy } from 'lodash';
import Header from './header';
import Body from './body';
import Footer from './footer';
import classes from './style.less'
import {withTranslation} from 'react-i18next' 
class ChangeTablesWaiter extends Component {

    state = {
        page: 1,
        enableclick: false,
        assigntables: [],
    }

    click = (op) => {
        this.setState({
            page: this.state.page + op
        })
    }

    enableClick = () => {
        this.setState({
            enableclick: !(this.state.enableclick)
        })
    }

    assignTables = (id) => {
        const tmp = [...this.state.assigntables]
        if (tmp.includes(id)) {
            tmp.pop(id)
        }
        else {
            tmp.push(id)
        }
        this.setState({
            assigntables: tmp
        })
    }

    render() {
        const { page, enableclick, assigntables } = this.state
        const { waiters, t } = this.props
        let maxPage = Math.ceil(Object.keys(waiters).length / 4)
        return (
            <div className={classes.container}>
                <div className={classes.inner}>
                    <Header page={page} maxPage={maxPage} enableClick={this.enableClick}
                        click={this.click} enableclick={enableclick} t={t}/>
                    <Body page={page} waiters={waiters} enableclick={enableclick}
                        assigntables={assigntables} assignTables={this.assignTables} t={t}/>
                    <Footer t={t}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    waiters: pickBy(get(state.auths__user, 'data', {}), { is_waiter: true })
})

export default connect(mapStateToProps)( withTranslation()(ChangeTablesWaiter )) ;
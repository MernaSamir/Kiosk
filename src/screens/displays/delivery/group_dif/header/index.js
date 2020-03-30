import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import classes from './style.less'
import Back_Button from 'components/Back_Button';
import Buttons from './button';
import Paging from 'helpers/components/paging'

class Header extends Component {
state={
    page: 1
}
    back = () => {
        const { history } = this.props
        history.push('/dispatcher')
    }

    render() {
        return (
            <div className={classes.header}>
                <Back_Button marginLeft="0" onClick={this.back} />
                <p>Group Definition</p>
                <div className={classes.btns}>
                    <Buttons />
                    <Paging  page={this.state.page}/>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
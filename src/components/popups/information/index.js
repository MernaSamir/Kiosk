import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { get, map } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import classes from './style.less'
import Dropdown from "components/dropdown"

class Information extends Component {

    state = {
        currentBranch: ''
    }

    setCurrentBranch = (currentBranch) => {
        this.setState({
            currentBranch: currentBranch
        })
    }

    renderTitle = () => {
        return <div className={classes.title}>
            <p>Information</p>
        </div>
    }

    renderDropdown = () => {
        const { active } = this.props
        const data = applyFilters({
            key: 'Filter',
            path: 'licensing__location',
            params: {
                chain: active
            }
        })
        return <div className={classes.dropdown}>
            <Dropdown data={data}
                btnClass={classes.btn}
                clickedclass={classes.btn}
                onChange={this.setCurrentBranch}
                value={this.state.currentBranch}
            />
        </div>
    }


    renderDetails = () => {
        return <div className={classes.details}>
            <div className={classes.left}>
                {this.renderContent("Address", ["Heliopolis Street, Local 155, Cairo, Egypt"])}
                {this.renderContent("Phone", ["+20 0111 9646 32", "+20 0111 9646 32"])}

            </div>
            <div className={classes.right}>
                {this.renderContent("Working Hours", ["S-T: 8:00 - 5:00", "F-S: 10:00 - 4:00"])}
                {this.renderContent("Other information", ["Here"])}
            </div>
        </div>
    }

    renderContent = (title, list) => {
        return <div className={classes.address}>
            <p className={classes.head}>{title}</p>
            {this.mapping(list)}
        </div>
    }

    mapping = (list) => {
        return map(list, d => (
            <p>{d}</p>)
        )
    }

    renderCloseBtn = () => {
        return <div className={classes.close}>
            <button type="button" onClick={this.close.bind()} >Close</button>
        </div>
    }

    close = () => {
        const { setMain } = this.props
        setMain('popup', { popup: '' })
    }

    render() {
        return (
            <div className={classes.container}>
                {this.renderTitle()}
                {this.renderDropdown()}
                {this.renderDetails()}
                {this.renderCloseBtn()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    active: get(state.licensing__chain, 'active', ''),
})

export default connect(mapStateToProps, mapDispatchToProps)(Information)
import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less'
import { get, map } from 'lodash';
import {withTranslation} from 'react-i18next'

class Doneness extends Component {

    renderTitle = () => {
        const { title , t } = this.props
        return <div className={classes.title}>
            <p>{`${t("Doneness of")} ${title}`}</p>
        </div>
    }

    renderBtns = () => {
        const { doneness } = this.props
        return map(doneness, d => (
            <button type='button' onClick={this.addDoneness.bind(this, d)}>
                {d.name}
            </button>
        ))
    }

    addDoneness = (element) => {
        const { onClick, setMain } = this.props
        onClick(element.id)
        setMain('popup', {
            popup: {}
        })
    }

    render() {
        return (
            <div className={classes.container}>
                {this.renderTitle()}
                <div className={classes.btns}>
                    {this.renderBtns()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    doneness: get(state.dropdowns__doneness, 'data', {}),
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Doneness))
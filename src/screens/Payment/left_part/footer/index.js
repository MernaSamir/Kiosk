import React, { Component } from 'react'
import { connect } from 'react-redux'
import classes from './../style.less';
import Calculation from './calculations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mapDispatchToProps from "helpers/actions/main";
import { withTranslation } from 'react-i18next';

class Footer extends Component {

    state = {
        num_guest: 0
    }

    split = () => {
        const { setMain } = this.props
        setMain('popup', {
            popup: {
                type: "SplitOrder", visable: true, width: '50vw',
                childProps: {
                    onClick: this.onClick, gnum: this.state.num_guest
                }
            }
        })
    }

    onClick = (value) => {
        const { setMain } = this.props
        this.setState({
            num_guest: value
        })
        setMain('popup', { popup: {} })
    }


    renderBtn = () => {
        const {t} = this.props
        return <button type="button" className={classes.btn} onClick={this.split.bind()} >
            <FontAwesomeIcon icon="columns" className={classes.icon} />
            <div className={classes.title}>
                <p>{t("Split Order")}</p>
            </div>
        </button>
    }

    render() {
        const { num_guest } = this.state
        return (
            <div className={classes.footer_container}>
                <Calculation num_guest={num_guest} />
                <div className={classes.split_div}>
                    {this.renderBtn()}
                </div>
            </div>
        )
    }
}



export default connect(undefined, mapDispatchToProps)(withTranslation()(Footer))
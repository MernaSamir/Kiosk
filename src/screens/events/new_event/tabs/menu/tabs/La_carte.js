import React, { Component } from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

const controls = [
    {
        name: 'basic.min_charge', label: "Minimum Charge", type: 'NumberField', className: classes.first,
        validates: { noSpecialChar: '', maxLength: '20', number: '' },
    },
]
const oneReceipt = [
    {
        name: 'basic.max_limit', label: "Max Limit", type: 'NumberField', className: classes.first,

        validates: { noSpecialChar: '', maxLength: '20', number: '' }
    },
    { name: 'basic.check_invitations', type: 'CheckBoxHighlight', labeling: "Check Invitations" },
    { name: 'basic.multi_tabs', type: 'CheckBoxHighlight', labeling: "Multi Tabs" },

]
const multiReceipt = [
    {
        name: 'basic.entrance_fee', label: "Entrance Fee", type: 'NumberField', className: classes.first,
        validates: { noSpecialChar: '', maxLength: '20', number: '' },


    },
]

class LaCar extends Component {
    state = {
        activeType: ""
    }
    setActive = (d) => {
        this.setState({ activeType: d.name }, () => {
        })
    }
    renderLaCarTypes = () => {
        const { activeType } = this.state
        if (activeType == 'All In One Receipt') {
            return Render(oneReceipt, { onClick: this.props.selectInput })
        }
        else {
            return Render(multiReceipt, { onClick: this.props.selectInput })
        }

    }
    renderTabs = () => {
        return Render([{
            name: "basic.lacarte_type",
            type: 'selectButtons',
            className: classes.inputButton,
            options: [
                { id: 'one', name: 'All In One Receipt' },
                { id: 'multi', name: 'Multi Receipts' },
            ],
            onClick: this.setActive,
            selectFirst: true,


        }])
    }
    render() {
        const {t} = this.props
        return (
            <div className={classes.container}>
                <p className={classes.p}>{t("Menu A La Carte")}</p>
                <div className={classes.form}>
                    {Render(controls, { onClick: this.props.selectInput })}
                </div >
                <div className={classes.form} style={{marginBottom:'1%'}}>
                    {this.renderTabs()}
                </div>
                <div className={classes.form} >
                    {this.renderLaCarTypes()}
                </div>
            </div>
        )
    }
}
export default connect(null, mapDispatchToProps)(withTranslation()(LaCar))
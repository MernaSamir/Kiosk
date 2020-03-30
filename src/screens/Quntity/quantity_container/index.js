import React, { Component } from 'react';
import Red_Square_Button from 'components/Red_Square_Button'
import Red_Rectangle_Button from 'components/Red_Rectangle_Button'
import { map, isEqual, pick, round, get } from 'lodash'
import { withRouter } from 'react-router-dom'
// import '../style.css';
import classes from './style.less'
import { message } from 'antd'
import { withTranslation } from 'react-i18next';


class QuantityContainer extends Component {

    state = {
        quantity: '',
        pad: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        padFloat: [{ name: '1/2', value: '.5' },
        { name: '1/8', value: '.125' },
        { name: '1/3', value: '.33' },
        { name: '2/3', value: '.66' },
        { name: '1/4', value: '.25' },
        { name: '3/4', value: '.75' }]
    }
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['active']
        const su = !isEqual(pick(nextProps, compare), pick(this.props, compare))
        if (su) {
            this.state.quantity = ''
        }
        return !isEqual({ state: nextState, props: nextProps }, { state: this.state, props: this.props })
    }

    updateValue = (value, frac = false) => {
        const { quantity } = this.state
        let valueStr = value.toString()
        // console.log(quantity)
        if (quantity.toString().includes(".") && (value == '.' || frac)) {
            return
        }
        let newVal = quantity + '' + valueStr
        this.handleChange('quantity', newVal);
    }
    handleChange(name, val) {
        this.setState({ [name]: String(val) })
    }
    resetValue = () => {
        const { setMain, active } = this.props
        this.setState
        setMain('orders__details', { item: { quantity: '', id: active.id } })
    }

    deleteLastValue = () => {
        const { quantity } = this.state
        if (!quantity)
            return
        else {
            // console.log("object ", quantity.toString())
            let newVal = quantity.toString().slice(0, -1)
            this.handleChange('quantity', newVal);
        }
    }

    plusOne = (opr) => {
        const { active = {} } = this.props
        let { quantity } = this.state;
        quantity = Number(quantity || active.quantity);

        if (opr == '+' && quantity) {
            quantity++;
        }
        else if (opr == '-' && quantity > 1) {
            quantity--;
        }
        this.setState({ quantity })
    }

    applyClick = () => {
        const { active, setMain, history, t } = this.props
        const { quantity } = this.state;
        if (!active.id) {
            message.warning(t("no item selected"))
            return
        }
        if (Number(quantity) == 0) {
            history.push('/home')
            return
        }
        if (active.id != '0') {
            setMain('orders__details', {
                item: {
                    action: 'update',
                    id: active.id,
                    quantity,
                    onSuccess() {
                        history.push('/home')
                        return [
                            { type: 'set_main_orders__details', data: { active: '' } }
                        ]
                    }
                }
            })
        }
    }

    renderPad = () => {
        const { pad } = this.state
        return map(pad, element => {
            return <Red_Square_Button name={element} width='11vh'
                onClick={() => this.updateValue(element)} />
        })
    }

    renderPadFloat = (float) => {
        const { padFloat } = this.state
        if (float) {
            return map(padFloat, element => {
                return <Red_Square_Button name={element.name} width='11vh' fontSize="2.3vh"
                    onClick={() => this.updateValue(element.value, true)} />
            })

        }
        else {
            return map(padFloat, element => {
                return <div className={classes.dummy}></div>
            })
        }
    }


    render() {
        const { active = {}, unit } = this.props
        const { quantity } = this.state;
        return (
            <div>
                <div className={classes.Quantity_Change_number}>
                    <div className={classes.Quantity_Change_number_element}>
                        <Red_Square_Button name='-' width='4vw' onClick={() => this.plusOne('-')} />
                    </div>
                    <button className={classes.Quantity_Change_number_box}>{round(quantity || get(active, 'quantity', 0), 14)}</button>
                    <Red_Square_Button name='+' width='4vw' onClick={() => this.plusOne('+')} />
                </div>

                <div className={classes.quantityContainer}>

                    <div  >
                        {this.renderPad()}
                        <Red_Square_Button name='.' disable={!unit.sales_enable_fraction} width='11vh' onClick={() => this.updateValue('.')} />
                        <Red_Square_Button name={0} width='11vh' onClick={() => this.updateValue(0)} />
                        <Red_Square_Button name='D' width='11vh' onClick={this.deleteLastValue} />

                    </div>

                    <div >
                        {this.renderPadFloat(unit.sales_enable_fraction)}
                        <div className={classes.area}>
                            <Red_Rectangle_Button name='Ok' width="23vh" height="11vh" color="#ffffff"
                                backgroundColor='linear-gradient(to bottom, #d73f7c, #d73f7c)'
                                padding="4% 2%" onClick={this.applyClick} />
                        </div>

                        {
                            /* <div className="Quantity_Change_pad_divider2down">
                            <Red_Rectangle_Button name='Ok' width="22vh" height="11vh" color="#ffffff"
                                backgroundColor='linear-gradient(to bottom, #d73f7c, #d73f7c)'
                                padding="4% 2%" onClick={this.applyClick} />
        </div> */
        }
                    </div>

                </div>
            </div>
        )
    }
}

export default withRouter(withTranslation()( QuantityContainer))
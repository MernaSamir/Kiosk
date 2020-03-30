import React, { Component } from 'react'
// import './paytype.css'
import Rec from './../../components/rect_gray_btn/gray_button'
import Red_Square_Button from '../../components/Red_Square_Button';
import Options from './options/index';
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux';
import { get } from 'lodash';
// import { get } from "lodash";
// const paymentTypes = ['Cash', 'Other', 'Manual Cash', 'Other', 'Credit Card', 'Other', 'Points', 'Other']
const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, "D", 0, "."]

class PayTypes extends Component {

    state = {
        activeForm: false,
        paymentTypes: [],
        tableStyle: { backgroundImage: 'linear-gradient(to bottom, #ffffff, #f2f2f2)', color: '#707070' },
        shoppingStyle: { backgroundImage: 'linear-gradient(to bottom, #ffffff, #f2f2f2)', color: '#707070' },
        tableImage: 'table-grey',
        shoppingImage: 'shopping-bag-grey',
    }

    activeShopping = () => {
        this.setState({
            activeForm: false,
            shoppingStyle: { backgroundImage: 'linear-gradient(to bottom, #fe534c, #fe534c)', color: '#ffffff' },
            shoppingImage: 'shopping-bag-white',
            tableStyle: { backgroundImage: 'linear-gradient(to bottom, #ffffff, #f2f2f2)', color: '#707070' },
            tableImage: 'table-grey',
        })
    }

    activeTable = () => {
        this.setState({
            activeForm: true,
            tableStyle: { backgroundImage: 'linear-gradient(to bottom, #fe534c, #fe534c)', color: '#ffffff' },
            tableImage: 'table-white',
            shoppingStyle: { backgroundImage: 'linear-gradient(to bottom, #ffffff, #f2f2f2)', color: '#707070' },
            shoppingImage: 'shopping-bag-grey',
        })

    }

    handelInput = (value) => {
        const { setPath, payment, activePayment } = this.props

        if (String(get(payment, activePayment)).includes('.') && value == '.') {
            return
        }
        else {
            if (value == "D") {
                setPath("payment", `item.${activePayment}`, (String(get(payment, activePayment) || '0')).slice(0, -1))
            }
            else {
                setPath("payment", `item.${activePayment}`, ([get(payment, activePayment), String(value)].filter(d => d)).join(""))
            }
        }

    }

    rendercal = () => {
        return num.map((d, key) => {
            return <Red_Square_Button
                key={key}
                width="28%"
                margin="1% 2%"
                name={d}
                onClick={() => this.handelInput(d)}
            />
        })
    }


    handelClickDone = () => {
    }

    render() {

        const { setCurrentPaymentValue, currentPayment } = this.props
        const { shoppingStyle, tableStyle, shoppingImage, tableImage } = this.state

        return (
            <div className='paymentT'>
                <div className='Takeaway-options'>

                    <div className="upbtns">
                        <Rec name='To Go'
                            backgroundImage={shoppingStyle.backgroundImage} color={shoppingStyle.color}
                            onClick={() => this.activeShopping()} image={shoppingImage} />
                        <Rec name='Eat In'
                            backgroundImage={tableStyle.backgroundImage} color={tableStyle.color}
                            image={tableImage} onClick={() => this.activeTable()} />

                    </div>

                    {
                        this.state.activeForm ?

                            <div className="eatIn" onClick={() => setCurrentPaymentValue("active", 'table')}>
                                <p>Table Number</p>
                                <input value={currentPayment.table} />
                            </div>
                            : undefined

                    }

                </div>

                <div className='options-numeric'>
                    <div className='leftpay'>
                        <div className='options-paym'>
                            <p className='headers' id='titlep'>Payment Options</p>
                            <div className="payTypesbts">
                                <Options />
                            </div>
                        </div>

                        <input type="checkbox" id="fruit1" defaultChecked={true} />
                        <label htmlFor="fruit1"
                            style={{
                                color: '#fe534c',
                                fontFamily: 'NunitoSans',
                                fontWeight: "bold",
                                fontSize: '0.7rem',
                                marginLeft: '5%'
                            }}>Print Check</label>


                    </div>


                    <div className='nump-done'>
                        <div>

                            {this.rendercal()}

                        </div>

                        <div className='done'>
                            <Rec
                                name='Done'
                                backgroundImage='linear-gradient(to bottom, #fe534c, #fe534c)'
                                color='#ffffff' width='88%' height='100%'
                                onClick={this.handelClickDone}
                            />
                        </div>
                    </div>

                </div>

            </div>
        )
    }

}


const mapStateToProps = (state) => ({
    payment: get(state, 'payment.item', {}),
    activePayment: get(state, 'payment.editing', 'net_total'),

})



export default connect(mapStateToProps, mapDispatchToProps)(PayTypes)

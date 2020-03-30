import React, { Component } from 'react'
import ComboItem from './Combo-Item/index'

import './receipt.css'

export default class Receipt extends Component {
    render() {
        return (
            <div className="receipt">
                <p className="mode">Mode: Dine In and Take Awy (eat in)</p>
                <div className="all">
                    <div className="logo">
                        <div>
                            <p>LOGO</p>
                        </div>
                    </div>
                    <div className="details">
                        <div className="left">
                            <div><p id="bold">Location</p> <p>Waleema</p></div>
                            <div><p id="bold">Order</p> <p>#51</p></div>
                            <div><p id="bold">Server</p> <p>Ahmed</p></div>
                            <div><p id="bold">Date</p> <p>02/10/2018</p></div>
                        </div>
                        <div className="right">
                            <div><p id="bold">Mode</p> <p>Dine In</p></div>
                            <div><p id="bold">Invoice</p> <p>#51</p></div>
                            <div><p id="bold">Station</p> <p>1</p></div>
                            <div><p id="bold">Time</p> <p>10:49 AM</p></div>
                        </div>
                    </div>

                    <table>
                        <tr className="table-header">
                            <td className="q-table"><span >Q</span></td>
                            <td className="item-table"><span>Item</span></td>
                            <td className="size-table"><span ></span></td>
                            <td className="each-table"><span></span></td>
                            <td className="total-table"><span >Total</span></td>
                        </tr>
                        <ComboItem q="1" item="*Burger Combo" total="10.00" border="none"/>
                        <ComboItem item="Burger" size="R" each="0" border="none"/>
                        <ComboItem item="Pepsi" size="M" each="0" border="1px solid #eeeced"/>

                        <tr className="table-row">
                            <td className="q-table"><span >1</span></td>
                            <td className="item-table"><span>Soup</span></td>
                            <td className="size-table"><span >R</span></td>
                            <td className="each-table"><span>10.00</span></td>
                            <td className="total-table"><span >10.00</span></td>
                        </tr>

                        <ComboItem q="1" item="*Burger Combo" total="10.00" border="none"/>
                        <ComboItem item="Fries" size="M" each="0" border="none"/>
                        <ComboItem item="Pepsi" size="M" each="0" border="1px solid #eeeced"/>
                        {/* <tr className="table-row">
                            <td className="q-table"><span >1</span></td>
                            <td className="item-table">
                                <ComboItem />
                            </td>
                            <td className="size-table"><span >R</span></td>
                            <td className="each-table"><span>10.00</span></td>
                            <td className="total-table"><span >10.00</span></td>
                        </tr> */}

                        <ComboItem q="1" item="*Burger Combo" total="10.00" border="none"/>
                        <ComboItem item="Burger" size="R" each="0" border="none"/>
                        <ComboItem item="Fries" size="M" each="0" border="none"/>
                        <ComboItem item="Pepsi" size="M" each="0" border="1px solid #eeeced"/>

                        <tr className="table-row">
                            <td className="q-table"><span >1</span></td>
                            <td className="item-table"><span>Soup</span></td>
                            <td className="size-table"><span >R</span></td>
                            <td className="each-table"><span>10.00</span></td>
                            <td className="total-table"><span >10.00</span></td>
                        </tr>

                        <ComboItem q="1" item="*Burger Combo" total="10.00" border="none"/>
                        <ComboItem item="Burger" size="R" each="0" border="none"/>
                        <ComboItem item="Fries" size="M" each="0" border="none"/>
                        <ComboItem item="Pepsi" size="M" each="0" border="1px solid #eeeced"/>

                        <tr className="table-row">
                            <td className="q-table"><span >1</span></td>
                            <td className="item-table"><span>Soup</span></td>
                            <td className="size-table"><span >R</span></td>
                            <td className="each-table"><span>10.00</span></td>
                            <td className="total-table"><span >10.00</span></td>
                        </tr>

                        <ComboItem q="1" item="*Burger Combo" total="10.00" border="none"/>
                        <ComboItem item="Burger" size="R" each="0" border="none"/>
                        <ComboItem item="Fries" size="M" each="0" border="none"/>
                        <ComboItem item="Pepsi" size="M" each="0" border="1px solid #eeeced"/>

                        <tr className="table-row">
                            <td className="q-table"><span >1</span></td>
                            <td className="item-table"><span>Soup</span></td>
                            <td className="size-table"><span >R</span></td>
                            <td className="each-table"><span>10.00</span></td>
                            <td className="total-table"><span >10.00</span></td>
                        </tr>

                        <ComboItem q="1" item="*Burger Combo" total="10.00" border="none"/>
                        <ComboItem item="Burger" size="R" each="0" border="none"/>
                        <ComboItem item="Fries" size="M" each="0" border="none"/>
                        <ComboItem item="Pepsi" size="M" each="0" border="1px solid #eeeced"/>

                        <tr className="table-row">
                            <td className="q-table"><span >1</span></td>
                            <td className="item-table"><span>Soup</span></td>
                            <td className="size-table"><span >R</span></td>
                            <td className="each-table"><span>10.00</span></td>
                            <td className="total-table"><span >10.00</span></td>
                        </tr>
                    </table>

                    <div className="bill-receipt">
                        <div className="left-bill">
                            <div><p id="bold">Subtotal</p> <p>222.00</p></div>
                            <div><p id="bold">Discount</p> <p>(22.00)</p></div>
                            <div><p id="bold">Service Charges 12%</p> <p>(20.00)</p></div>
                            <div><p id="bold">Tax</p> <p>(2.00)</p></div>
                        </div>

                        <div className="right-bill">
                            <div className="total-squre">
                                <h3>Net Total</h3><h3>300.00</h3>
                            </div>
                        </div>
                    </div>

                    <div className="cash">
                        <div><p id="bold">Cash</p> <p>150.00</p></div>
                        <div><p id="bold">Credit Card</p> <p>10.00</p></div>
                    </div>

                    <div className="qr">
                        <div><p>QR</p></div>
                    </div>

                    <div className="greeting">
                        <p>Chain Greeting</p>
                        <p>Branch Greeting</p>
                    </div>



                </div>

            </div>

        )
    }
}

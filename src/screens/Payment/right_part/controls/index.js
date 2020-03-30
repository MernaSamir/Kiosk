/* eslint-disable class-methods-use-this */
import React, { Component } from 'react'
import classes from './styles.less'


const controls = [
    {
        name: 'due', label: "Due", type: 'Label', className: classes.due
    },
    {
        name: 'paid', label: "Paid", type: 'TextBox', no_keyboard: true,
        validates: { required: true, number: true }
    },
    {
        name: 'tips', label: "Tips", type: 'TextBox', no_keyboard: true,
    },
    {
        name: 'change', label: "Change", type: 'LabelCalc', className: classes.change,
        func(d) { return (round(max([Number(d.paid || '') - Number(d.tips || '') - Number(d.due), 0]), 2)) }
    }
]

export default class Controls extends Component {

    selectInput = (field) => {
        const { resetForm, values } = this.props
        if (field.name == 'paid')
            resetForm({ ...values, paid: '' });
        if (['tips', 'paid'].includes(field.name)) {


            this.setState({
                calcName: ''
            }, () => {
                this.setState({ calcName: field.name })
            })
        }
    }

    // eslint-disable-next-line react/display-name
    

   

    render() {
        const {Render} = this.props
        console.log('hhhahahahgahahahahhhahh')
        return (
     
                <div className={classes.header}>

                    {Render(controls, { onClick: this.selectInput })}
                </div>



             
        )
    }
}




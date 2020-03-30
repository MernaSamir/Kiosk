import React, { Component } from 'react'
import FormControls from 'form_control'
import InputComponent from "helpers/components/input"
import style from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map, concat } from 'lodash'

export default class Type extends InputComponent {

    handelChangeItem = (value) => {
        this.onChange(value)
        console.log(this.props)
    }

    handleAdd =() =>{
        const { typeData } = this.props;
        // concat(typeData,)
        console.log('add')
    }



    renderData = () => {
        const { typeData } = this.props;
        return map(typeData, (e, index) => {
            return e.contact
            // <FormControls
            //     type='text'
            //     name={`[${index}].contact`}
            // />
        })
    }

    render() {
        const {  field, type } = this.props;
        console.log('type', this.props)
        return (
            <div>
                {type.name}
                <div className={style.add_row}>
                    <FormControls
                        type='text'
                        onChange={this.handelChangeItem}
                        name={type.id}
                    />
                    <FontAwesomeIcon icon="plus-circle" className={style.PlusIcon} onClick={this.handleAdd} />
                    {() => this.handleChangeInput(this.state.contact)}
                </div>
                {this.renderData()}
            </div>

        )
    }
}

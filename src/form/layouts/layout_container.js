import React, { Component } from 'react'
import style from './style.less'
import { get } from 'lodash';
import LayoutMain from 'helpers/components/layout';
import Header from './header'
import {Button} from 'antd'
import Dialog from './dialog'
import * as dialogFunctions from './dialog_functions'
import {array_to_obj} from 'helpers/functions/array_to_object'

const layouts = {
    Layout_1: { body: style.layout1_grid_container },
    Layout_2: { body: style.layout2_grid_container },
    Layout_3: { body: style.layout3_grid_container },
    Layout_4: { body: style.layout4_grid_container },
    Layout_5: { body: style.layout5_grid_container },
}
export class LayoutClass extends Component {
    state = {
        visible:false,
    }

    showDialog() {
        const {layout={}, values} = this.props
        const {extraSubmitButton={}} = layout

        this.initialValues = array_to_obj( get(dialogFunctions,get(extraSubmitButton, "func"),() => {return {}} )(values, get(extraSubmitButton, "func_params")))
        this.setState({
            ...this.state,
            visible:true
        })
    }

    closeDialog(){
        this.setState({
            ...this.state,
            visible:false
        })
    }
    render() {
        const { values, layout, submitFullForm } = this.props; const {visible} = this.state
        const extraButton = get(layout, "extraSubmitButton")
        const current = get(layouts, layout.type);
        return (
            <div className={style.FB_Main}>
                {
                    layout.layoutName ?
                        <>
                            <div className={style.FB_header}><Header layout={layout} /></div>
                            <div className={style.FB_HeaderBr} />
                        </>
                        : undefined
                }

                <div className={current.body}>
                    {
                        this.props.renderControls()
                    }
                </div>
                { extraButton &&
                    <div >
                        <Button 
                            onClick={get(dialogFunctions, extraButton.apply, this.showDialog).bind(this) } > 
                            {get(extraButton, "title", "")} 
                        </Button>
                    </div>
                }
                {visible && <Dialog
                    initialValues={this.initialValues}
                    formvalues={values}
                    visible={visible}
                    submitFullForm={submitFullForm}
                    closeDialog={this.closeDialog.bind(this)}    
                    {...extraButton} />
                }
            </div>
        )
    }
}

export default LayoutMain(LayoutClass);

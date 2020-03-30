import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import Nav_Location from 'components/Nav_Location'
import { get } from 'lodash'
import Button_Rectangle from "components/Button_Rectangle";
import Back from 'components/Back_Button'
export class index extends Component {
    state = {}
    static getDerivedStateFromProps(props, state) {
        if (props.activeItem != state.activeItem) {
            props.resetForm({})
        }
        return {
            activeItem: props.activeItem
        }
    }
    renderAlert(){
        return 
    }
    save = ()=>{
        this.props.setDraft(false)
        this.props.handleSubmit()
    }
    saveDraft = ()=>{
        this.props.setDraft(true)
        this.props.handleSubmit()
    }

    render() {
        const { appSettings={}, handelCancel } = this.props
        // console.log('HEADER',this.props)
        return (
            <div className={style.body}>
                <Back></Back>
                <Nav_Location />
                {/* {appSettings ? appSettings.name : ""} */}
                {/* <div className={style.buttonBox}>
                </div> */}
                {!appSettings.hide_actions && <div className={style.buttonBox}>
                    {!appSettings.noCancel &&<Button_Rectangle
                        name='Cancel'
                        styleprops='cancel'
                        onClick={handelCancel} />}
                   { !appSettings.noSaveDraft &&<Button_Rectangle
                        name='Save Draft'
                        styleprops='save_draft'
                        onClick={this.saveDraft} />}
                    {!appSettings.noSave && <Button_Rectangle
                        onClick={this.save}
                        name='Save'
                        styleprops='save' />}
                </div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const appSettings = get(state, 'apps.active', {})
    return {
        appSettings,
        activeItem: get(state, `${appSettings.reduxName}.active`, ''),
    }

}


export default connect(mapStateToProps, mapDispatchToProps)(index)

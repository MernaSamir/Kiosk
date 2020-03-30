import React, { Component } from 'react'
import { Popover } from 'antd';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import style from './style.less'
import {withTranslation} from 'react-i18next'
import { get } from 'lodash';
export class user extends Component {

    constructor(props) {
        super(props)
        const {t} = props
        this.content = (
          <div className={style.dropdown_row}>
            <div onClick={this.ChangeLang}>{t("Change Language")}</div>
            <div onClick={this.Logout}>{t("Log Out")}</div>
          </div>
        );
      }
      ChangeLang = ()=>{
        const {setMain} = this.props;
        setMain('popup', {
          popup: {type: 'lang'}
        })
      }
      Logout = () => {
        const { setMain, history } = this.props;
        localStorage.removeItem('tk');
        setMain({ current: '' })
        history.push('/')
      }
      
    render() {
      const {username} = this.props
        return (
            <Popover placement="bottom" content={this.content} trigger="click">
                <button className={style.user_btn}>
                  {username.charAt(0).toUpperCase() + username.charAt(1).toUpperCase()}
                </button>
            </Popover>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
  username: get(state.main.current, 'username', '')
})

const wrapper = connect(mapStateToProps, mapDispatchToProps)(user)
export default withRouter(withTranslation()(wrapper))
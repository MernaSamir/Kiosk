import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import attachApp from 'helpers/app'
import { get } from 'lodash';
import AppClass from 'helpers/app/components'
class Favorite extends AppClass {
    afterFetch = (data)=>{
        const {SetMain} = this.props;
        SetMain({
            active: get(data, '[0].id', '')
        });
    }
    activeFavorite = () => {
        const { SetMain, reset, activeAction, user, active } = this.props
        if (!activeAction) {
            reset('actions', { active: 'star' })
            if(!active){
                SetMain({
                    item: {
                        action: 'add',
                        user
                    }
                })
            }
        }
        else {
           
            reset('actions', { active: '' })
        }
    }
    render() {
        const { activeAction } = this.props
        return (
            <button className={activeAction == 'star' ? "active-action" : 'fav-btn'} onClick={() => this.activeFavorite()}>
                <FontAwesomeIcon icon='star' />
            </button >
        )
    }
}

const app = {
    name: 'favorites',
    settings: {
        url: 'items/favorite/'
    },
    extraState: (state) => ({
        action: state.actions.active,
        user: get(state, 'main.current.id', '')
    })
}

const mapStateToProps = (state) => ({
    activeAction: state.action,
    list: state.data,
    item: state.item,
    user: state.user,
    active: state.active,
    params: {user: state.user}
})

export default attachApp(app, mapStateToProps, Favorite)


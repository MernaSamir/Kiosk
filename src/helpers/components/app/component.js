import { Component } from 'react';
import { isEqual, get, omit, pick } from 'lodash'

export default class MainComponent extends Component {
    time = 0
    resetItem = (data = {}) => {
        const { SetPath } = this.props
        SetPath('item.action', '')

    }
    setActivity = (data = {}) => {
        let out = []
        this.time = 0
        const { app, active, item, afterAction } = this.props;
        const dis = [...afterAction(data), ...get(item, 'onSuccess', () => ([]))(data)]
        // if(data.id){
            if (item.not_active) {
                out.unshift({type: `set_main_${app}`, data: { item: {} }})
            } else {
                // const main_active = find(dis, d=>(d.type == `set_main_${app}` && get(d, 'data.active')))
                // if(!main_active){
                out.unshift({type: `set_main_${app}`, data: { active: active || data.id, item: {} }})
                // }
            }
        // }
        // console.log(out, dis)
        out = [...out, ...dis]
        return out;
    }
    takeAction = (nextProps) => {
        const { item = {} } = nextProps;
        get(this, item.action, () => { })(nextProps)
    }
    add = (nextProps) => {
        const { CreateApp, item, app } = nextProps;
        CreateApp(omit(item, ['action']), this.setActivity, this.resetItem, app)
    }
    bulkAdd = (nextProps) => {
        const { CreateBulkApp, item, app } = nextProps;
        CreateBulkApp(item, this.setActivity, this.resetItem, app)
    }
    updateModel = (nextProps)=>{
        const {UpdateModels, item} = nextProps;
        UpdateModels(item, this.setActivity, this.resetItem)
    }
    bulkEdit = (nextProps) => {
        const { UpdateBulkApp, item, app } = nextProps
        UpdateBulkApp(item, this.setActivity, this.resetItem, app)
    }
    manyEdit = (nextProps) => {
        const { UpdateManyApp, item, exclude, app } = nextProps
        UpdateManyApp({ exclude, ...item }, this.setActivity, this.resetItem, app)
    }
    manyDelete = (nextProps) => {
        const { DeleteManyApp, item, exclude, app } = nextProps
        DeleteManyApp({ exclude, ...item }, this.setActivity, this.resetItem, app)
    }
    update = (nextProps) => {
        const { UpdateApp, active, item, app } = nextProps
        UpdateApp({ id: active, ...item }, this.setActivity, this.resetItem, app)
    }
    resetItem = (data) => {
        if(this.time == 3){
            const { app, setAll } = this.props;
            // const dis = get(item, 'onSuccess', () => ([]))(data)
            return setAll([{type: `set_main_${app}`, data: { active: '', item: {} }}])
        }
        setTimeout(()=>{
            this.takeAction(this.props)
        }, 100)
        this.time++
    }
    delete = (nextProps) => {
        const { DeleteApp, active, item, app } = nextProps
        DeleteApp({ id: active, ...item }, this.setActivity, this.resetItem, app)
    }
    checkItemAction = (prevProps) => {
        if (!isEqual(pick(this.props, ['item.action']), pick(prevProps, ['item.action']))) {
            this.takeAction()
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['item.action']
        const su = !isEqual(pick(nextProps, compare), pick(this.props, compare));
        if (su && nextProps.item.action) {
            this.takeAction(nextProps);
        }
        return su
    }
    afterFetch = (data) => {
        const { item = {} } = this.props;
        if (this.state.loading === false) {
            this.setState({ loading: true })
        }
        if (item.action) {
            this.takeAction();
        }
    }
    render() {
        return (
            this.props.children
        );
    }
}

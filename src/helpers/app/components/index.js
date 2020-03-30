import { Component } from 'react'
import { isEmpty, isEqual, get, omit, pick } from 'lodash'
class ActionsComponent extends Component {
    params = { active: 1 }
    state = {}
    componentDidMount() {
        const { list, item={} } = this.props;
        if (isEmpty(list) || !this.state.loading) {
            this.getData()
        }else{
            this.afterFetch(list)
        }
        if(item.action){
            this.takeAction()
        }
    }
    resetItem = (data={}) => {
        const { SetPath}= this.props
        SetPath('item.action', '')

    }
    setActivity = (data={}) => {
        const { SetMain, active, item } = this.props;
        if(item.not_active){
            SetMain({ item: {} })
        }else{
            SetMain({ active: data.id || active, item: {} })
        }
        this.afterAction(data)
        get(item, 'onSuccess', () => { })(data)
    }
    afterAction = (data) => { }
    getData = () => {
        const { Fetch, params = this.params } = this.props;
        Fetch(params, this.afterFetch)
    }
    takeAction = () => {
        const { item = {} } = this.props;
        get(this, item.action, () => { })()
    }
    add = () => {
        const { Create, item } = this.props;
        console.log(this.props)
        Create(omit(item, ['action']), this.setActivity,this.resetItem )
    }
    bulkAdd = () => {
        const { CreateBulk, item } = this.props;
        CreateBulk(item, this.setActivity)
    }
    bulkEdit = () => {
        const { UpdateBulk, item } = this.props;
        console.log(this.props)
        UpdateBulk(item, this.setActivity)
    }
    manyEdit = () =>{
        const { UpdateMany, item, exclude } = this.props;
        UpdateMany({exclude, ...item}, this.setActivity)
    }
    manyDelete = () =>{
        const { DeleteMany, item, exclude } = this.props;
        DeleteMany({exclude, ...item}, this.setActivity)
    }
    update = () => {
        const { Update, active, item } = this.props;
        console.log(this.props)
        Update({ id: active, ...item }, this.setActivity)
    }
    resetItem = (data)=>{
        const { SetMain, item } = this.props;
        SetMain({item: {}})
        get(item, 'onSuccess', () => { })(data)
    }
    delete = () => {
        const { Delete, active, item } = this.props;
        Delete({ id: active, ...item }, this.setActivity, this.resetItem)
    }
    checkItemAction = (prevProps) => {

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
    checkFilter = (prevProps)=>{
        if(!isEqual(this.props.filters, prevProps.filters)){
            this.getData()
        }
    }
    componentDidUpdate(prevProps) {
        this.checkItemAction(prevProps);
        this.checkFilter(prevProps);
    }

}

export default ActionsComponent


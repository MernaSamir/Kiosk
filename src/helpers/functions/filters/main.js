import {gt, gte, lt, lte, eq, range, get, every, some, last, omit, toArray, filter, first,
    reject, mapValues, isEqual, pick, set, reduce, map, includes, keys as lKeys, 
    max, min, flattenDeep,has,omitBy,concat,
    flatten, uniqBy, find, pickBy, isEmpty, sumBy, sum, isObject, lowerCase, groupBy} from 'lodash';
export * from './bill';
export * from './reports';
export * from './authorize';
import moment from 'moment'
import {Parser} from 'expr-eval';

const compareKeys = { gt, gte, lt, lte, eq }


export const compare = (params, data, state, props)=>{
    return filter(data, d=>(get(compareKeys, params.compare)(params.val, get(d, params.to))))
}

export const First = (params, data, state, props)=>{
    const select = first(toArray(data))
    return get(select, params.display, (props.default != undefined) ? props.default:select)
}

export function mapSelect(params, data, state, props={}){
    return mapValues(params.select, d=>(get(props.data || data, d, get(state, d, d))))
}
export const mapParams = (params, data, state, props={})=>{
    return mapValues(params.params, d=>(get(props.data || state, d, d)))
}
export const Selector = (params, data, state)=>{
    return get(data, get(state, params.path), {});
}
export const GetDataSelector = (params, data, state, props={})=>{
    const {trans=true} = params;
    if(trans && params.show=='name'){
        const lang = (get(state.dropdowns__lang.data, state.dropdowns__lang.active, {show: 'n'}))
        const out = get(data || props.data, lang.show, '')
        if(out){
            return out
        }
    }
    return get(data || props.data, params.show, '');
}
export const StateSelector = (params, data, state) => {
    return get(state, params.path, '');
}
export const PartialSelector = (params, data, state, props = {})=>{
    return pick(get(data, get(state, params.path), {}), props.names || props.fields.map(d=>d.name));
}
export const List = (params, data, state)=>{
    return filter(data, mapSelect(params, data, state))
}
export const Match = (params, data, state)=>{
    return find(data, mapSelect(params, data, state)) || {}
}
export const FindFromState = (params, data, state)=>{
    return find(data, mapSelect(params, data, state))
}
export const Filter = (params, data, state) => {
    return filter(data, mapParams(params, data, state))
}

export const mapSearch = (data, key, value, props)=>{
        return filter(data, d=>includes(lowerCase(get(d, key,'')), lowerCase(value)))
}
export const Search = (params, data, state, props) => {
    let res =[]
     reduce(params.params, (result, value, key) =>(
       res = [...res, ...mapSearch(params.data||data, key, value, props)]
        ), {});
    return uniqBy(res, params.unify||'id')
  
}
export const mapChainaingSearch = (data, key, value, props)=>{
        const search_out =  props.applyFilters({
        key:'Search',
            path:value.path,
            params:{
                ...value.params
            }
        })
        const list = map(search_out,d=>(get(d, value.key , '')) )
        return filter (data,d => includes(list, get(d, key, '') ) )
        // return mapChainaingSearch ()
        // return map (pick(data,map(search_out, (d)=>(get(d, key, '')))) , d=>(d))
    
}
export const deepSearch = (params, data, state, props)=>{
    return filter(data, d=>{
        const f_data = props.applyFilters(params.search, d, state, props);
        return some(f_data, d=>(includes(lowerCase(d|| ''), lowerCase(params.value))))
    })
}
export const chaining_search =(params, data, state, props) => {
    let res =[]
     reduce(params.params, (result, value, key) =>(
       res = [...res, ...isObject(value)?mapChainaingSearch(params.data||data, key, value, props):
        mapSearch(params.data||data, key, value, props)]
        ), {});
    return uniqBy(res, params.unify||'id')
  
}
export const pickingBy = (params, data, state) => {
    return pickBy(data, mapParams(params, data, state))
}
export const Last = (params, data, state) => {
    return last(toArray(data), params.params)
}
export const ListIncludes = (params, data)=>{
    return pickBy(data, d => params.selector.includes(get(d, params.match,'')))
}
export const RejectList = (params, data, state)=>{
    return reject(data, mapSelect(params, data, state))
}
export const Reject = (params, data, state)=>{
    return reject(data, mapParams(params, data, state))
}
export const FindOne = (params, data, state, props)=>{
    return find(data, mapSelect(params, data, state, props))
}
export const Find = (params, data, state)=>{
    return find(data, mapParams(params, data, state))
}

export const keys = (params, data, state)=>{
    return reduce(data, (o, v)=>{
        set(o, `${map(params.levels, d=>(get(v, d, ''))).join('.')}`, get(v, params.select, v));
        return o
    }, {})
}
export const mapObjectToArray = (params, data, state, index=0, end=params.length-1, extra={})=>{
    return map(data, (d, k)=>(
        index < end ? [...mapObjectToArray(params, d, state, index+1, end, {[params[index]]: k, ...extra})]:{...d, [params[index]]: k, ...extra})
    )
}
export const ToArray = (params, data, state, props)=>{
    return toArray(data)
}
export const reverseKeys = (params, data, state)=>{
    const keys = params.levels;
    return flattenDeep(mapObjectToArray(keys, data, state));
}
export const selectFromState = (params, data, state, ks=lKeys(params), index=0, end=ks.length) =>{
    if(end == index){
        return data;
    }
    const key = ks[index];
    index = index+1;
    const selected = get(params, `${key}.select`, params[key]);
    const s_data = get(state, `${key}.data.${get(data || state, selected, '')}`, selected.params ? find(get(state, `${key}.data`), mapParams(selected, data, data)):'')
    return selectFromState(params, s_data, state, ks, index, end);

}
export const selectMultiFromState = (params, data, state, ks=lKeys(params), index=0, end=ks.length, out) =>{
    if(end == index){
        return out;
    }
    const key = ks[index];
    index = index+1;
    const d = get(state, `${key}.data.${get(data, get(params, `${key}.select`, params[key]), '')}`)
    return selectMultiFromState(params, d , state, ks, index, end, {...out, [key]: d});

}
export function chain(params, data, state){
    const out = selectFromState(params.selectors, data, state)
    return get(out, params.display, out)
}
export function chainMulti(params, data, state){
    const out = selectMultiFromState(params.selectors, data, state)
    return out
}
export const ListInside = (params, data, state, props)=>{
    return filter(data, d=>{
        return isEqual(get(props.data || state, params.compare, params.compare), get(chain(params, d, state), params.select, 'id'))
    })
}
export const ListFind = (params, data, state, props)=>{
    return filter(data, d=>{
        return props.applyFilters(params.fun, undefined, state, {...props, data: d})
    })
}
export const pickChain = (params, data, state, props)=>{
    return map(data, d=>{
        const selected_data = chain(params, d, state)
        return get(selected_data, params.select, selected_data)
    })
}
export const ListSelector = (params, data, state, props)=>{
    return filter(data, d=>{
        return chain(params, d, state)
    })
}

export const Includes = (params, data, state, props)=>{
    const i_data = map(props.data || get(state, params.compare, []), d=>(get(d, params.pick, d)))
    return filter(data, d=>{
        return includes(i_data, get(d, params.select))
    })
}
export const DataIncludes = (params, data, state, props)=>{
    return filter(data, d=>{
        return includes(get(d, params.select), get(state, params.pick, get(props.data, params.pick, '')))
    })
}
export const IncludesOne = (params, data, state, props)=>{
    return filter(data, d=>{
        return every(mapValues(params.params, (v, k)=>(get(d, k, []).includes(v))))
    })
}

export const childData = (params, data, state)=>{
    const list = get(state, `${params.redux}.data`, {})
    return filter(list, mapSelect(params, data, state))
}

export const joining = (params, data, state, props)=>{
    return params.select.map(d=>props.applyFilters(d, data, state, props)).join(' - ')
}

export const anding = (params, data, state, props)=>{
    const apps = reduce(toArray(params.funs), (o, d, i)=>{
        const path = range(0, i).map(d=>"then").join('.');
        if(!path){
            return d
        }
        set(o, path, {path: params.path, ...d})
        return o
    }, {})
    return props.applyFilters(apps, data, state, props)
}
export const oring = (params, data, state, props)=>{
    const out = flatten(map(params.funs, (fun)=>(props.applyFilters(fun, data, state, props))));
    if (params.list){
        return out
    } 
    return uniqBy(out, params.unify || 'id')
}
export const multiData = (params, data, state, props)=>{
    return reduce(params.cols, (o, d, index)=>({
        ...o,
        [index]: props.applyFilters(d, get(state, `${d.reduxName || index}.data`, {}), state, {...props, extra: o})
    }), {})
}
export const includeAny = (params, data, state, props)=>{
    let listData = get(state, `${params.reduxName}.data`, props.data)
    listData = filter(listData, params.filters)
    return some(params.func, d=>(someData(d, listData, state, props)) )
}

const getChainedData = (cols={}, data, state, props, out={}) => {
    const key = cols.reduxName;
    out = {...out, [key]: props.applyFilters(cols, get(state, `${key}.data`, {}), state, props)}
    if(cols.child){
        return getChainedData(cols.child, data, state, props, out)
    }
    return out
}
export const chainChildData = (params, data, state, props)=>{
    return getChainedData(params.cols, data, state, props);
}

export const everyFilter = (params, data, state, props)=>{
    return every(params.func, (d)=>(!!props.applyFilters(d, data, state, props)))
}
export const everyData = (params, data, state, props)=>{
    return every(data, (d)=>(!!props.applyFilters(params.func, d, state, props)))
}

export const someData = (params, data, state, props)=>{
    return some(data, (d)=>(!!props.applyFilters(params.func, d, state, props)))
}
export const anyFilter = (params, data, state, props)=>{
    return some(params.func, (d)=>(!!props.applyFilters(d, data, state, props)))
}
export const pickingState = (params, data, state, props)=>{
    const ids = map(data, d=>(get(d, params.select, d)))
    const state_data = get(state, `${params.path}.data`, data)
    return pick(state_data, ids)
}
export const picking = (params, data, state, props)=>{
    const ids = map(flatten([get(state, params.pick, toArray(props.data || data))]), d=>(get(d, params.select, d)))
    return pick(get(state, `${params.reduxName}.data`, data), ids)
    // return pick(get(state, `${params.reduxName}.data`, data), map(props.data || data, d=>(get(d, params.select, d))))
}
export const pickingFromData = (params, data, state, props)=>{
    return map(data, d=>pick(get(props, params.dPath, data), get(d, params.pick, [])))
    // return pick(get(state, `${params.reduxName}.data`, data), map(props.data || data, d=>(get(d, params.select, d))))
}
export const Array = (params, data, state, props)=>{
    return toArray(data) || []
}
export const pickMax = (params, data, state, props)=>{
    return max(map(data, d=>(get(d, params.select))))
}

export const pickMin = (params, data, state, props)=>{
    return min(map(data, d=>(get(d, params.select))))
}

export const DateBetween = (params, data, state, props)=>{
    return filter(data, d => moment(get(d, params.compare)).isBetween(params.date.start, params.date.end))
}

export const sameDate = (params, data, state)=>{
    return filter(data, d=>(isEqual(moment(get(state, params.compare, params.date)).format(params.format), moment(get(d, params.select)).format(params.format))))
}

export const dateRanged = (params, data, state)=>{
    const start = moment(params.start).isValid() ? moment(params.start).format(params.format):(get(state, params.start) ? moment(get(state, params.start)).format(params.format):'')
    const end = moment(params.end).isValid() ? moment(params.end).format(params.format):(get(state, params.end) ? moment(get(state, params.end)).format(params.format):start)
    return filter(data, d=>{
        const mainDate = moment(get(d, params.select)).format(params.format);
        return mainDate >= start && mainDate <= end
    })
}

export const dateBetween = (params, data, state)=>{
    const date = moment(params.date).format(params.format);
    return filter(data, d=>{
        const from = moment(get(d, params.from)).format(params.format);
        const to = moment(get(d, params.to)).format(params.format);
        return date >= from && date <= to
    })
}
export const dataBetween = (params, data, state)=>{
    const date = params.date;
    return filter(data, d=>{
        const from = get(d, params.from);
        const to = get(d, params.to);
        return date >= from && date <= to
    })
}

export const ShowBUOM = (params, data, state, props)=>{
    const d = get(props, `data.${params.select}`, '')
    let UOM = get(data, d, {});
    if(UOM.is_universal){
        UOM = find(data, {_type: UOM._type, is_base: true})
    }
    return get(UOM, params.show, '')
}

export const UOMConvert = (params, data, state, props={})=>{
    const s_u = get(props.data, 'stock_unit', '')
    const item = get(state.stock__items, `data.${get(props.data, 'item', '')}`)
    const r_u = get(item, 'recipe_unit_default', '')
    return `${get(data, `${s_u}.${params.show}`, '??')} = ${get(props.data, 'recipe_unit_ratio', '??')} x ${get(data, `${r_u}.${params.show}`, '??')}`
}

export const checkStationType = (params, data, state, props={})=>{
    const station = get(state.licensing__station.data, state.licensing__station.active, {})
    if(params.not){
        return params.type != station._type;
    }
    return params.type == station._type
}


export const matchDifferent = (params, data, state, props={})=>{

    const fullData = get(state, `${params.fullData}.data`, {});
    let picker = get(state, `${params.path}.data`)

    if(params.filter) {
        let filtered = get(state, `${params.filter}`, params.filter)
        
        if(params.get_keys){
            filtered = lKeys(omitBy(filtered, f => {console.log(f, params.get_keys); return(!f[params.get_keys])}))
        } else {
            filtered = concat([], filtered)
        }
        picker = !isEmpty(filtered) ? pickBy(picker, p => filtered.includes(get(p, params.filter_key, p.id))) : {}
    }
    const filteredData = map(picker, f => get(f, params.pick))    
    return pick(fullData, filteredData)
    
    
}
export const notIncludeParent = (params, data, state, props={})=>{
    
    const fullData = get(state, `${params.fullData}.data`, data);
    let picker = get(state, `${params.path}.data`)
    let filteredData = fullData
    if(!isEmpty(fullData) && params.filter_key) {
        map(picker, v => {
             //    if(has(fullData, `${v[params.pick]}`) && has(fullData, `${v[params.filter_key]}`)) {
                //         filteredData = omit({...filteredData}, `${v[params.pick]}`)
                //    } 
                
            if(has(fullData, `${v[params.pick]}`)) {
                //if full data has the item and its parent remove the item
               if( has(fullData, `${v[params.filter_key]}`)) {
                    filteredData = omit({...filteredData}, `${v[params.pick]}`)
               } else if(params.add_table_parent_id) {
                   filteredData[v[params.pick]] = {
                       ...filteredData[v[params.pick]], 
                       table_parent_id: v[params.filter_key]}
               }
           }
        })
    }
    return filteredData   
}

export const notMatchDifferent = (params, data, state, props={})=>{
    
    let fullData = get(state, `${params.fullData}.data`, {});
    let filteredData = map(get(state, `${params.path}.data`), f => get(f, params.pick))
    
    return omit(fullData, filteredData)
    
    
}
export const selectRequested = (params, data, state, props={})=>{
    const item = get(props.data, 'id');
    const pr = get(state, params.redux_path);
    const detail = find(state.stock__product_requisition_detail.data, {transaction: pr, item}) || {}
    return detail.quantity
}

export const selectTo = (params, data, state, props={})=>{
    const item = get(props.data, 'id');
    const to = get(state, params.redux_path, '');
    const to_data = get(state.stock__transaction_tr.data, to, {})
    const detail = find(state.stock__product_requisition_detail.data, {transaction: to_data.pr, item}) || {}
    return detail.quantity
}
export const selectTransfer = (params, data, state, props={})=>{
    const item = get(props.data, 'id');
    const to = get(state, params.redux_path, '');
    const detail = find(state.stock__transaction_tr_detail.data, {transaction: to, item_variant: item}) || {}
    return detail.allocated || detail.to_transfer
}
export const selectPurchase = (params, data, state, props={})=>{
    const item = get(props.data, 'id');
    const to = get(state, params.redux_path, '');
    const detail = find(state.stock__purchase_orders_detail.data, {transaction: to, item_variant: item}) || {}
    return detail.allocated
}

export const packItemStatus = (params, data, state, props)=>{
    const late = get(params, 'late', 10);
    if(params.voided){
        return 'voided'
    }
    const from = moment(params.time);
    const to = moment(params.to)
    const diff = from.diff(to, 'minutes')
    if(diff >= late){
        return 'late'
    }
    return 'normal'
}

export const Eval = (params, data, state, props={})=>{
    if(isEmpty(data)){
        return 0
    }
    const parser = new Parser()
    const expr = parser.parse(params.eq);
    if(params.defaults){
        map(params.defaults, (v,k)=> get(data,k) ? null : data[k] = v )
    }
    try{
        return expr.evaluate(data);
    }catch(ev){
        return 0
    }
}

function getDates(startDate, endDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(endDate);
    while (currentDate <= stopDate) {
        const date = moment(currentDate).format('DD-MM-YYYY')
        dateArray.push( {name: date, id:date  })
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}
export const getDatesInBetween = (params, data, state, props={})=>{ 
    const {from_date, to_date} = params
    const startDate = get(props, from_date)
    const endDate = get(props, to_date)
    return (startDate || endDate) ? getDates(startDate, endDate) :[]
}

export const SumBy = (params, data, state, props)=>{
    return params.col ? sumBy(data, params.col):sum(data)
}

export const IfItems = (params, data, state, props)=>{
    return filter(data, (d)=>{
        const details = pick(get(props, params.dPath), get(d, params.pick))
        const val = sum(toArray(details))
        return get(compareKeys, params.compare)(val, get(d, params.val, params.val))
    })
}

export const Grouping = (params, data, state, props)=>(
    groupBy(data, params.levels)
)

export const storeFilter = (params, data, state, props)=>{
    const s_data = get(state, params.d_path, {})
    return filter(s_data, mapValues(params.params, d=>get(data, d, d)))
}
export const dataPick = (params, data, state, props)=>{
    return map(data, d=>get(d, params.select))
}

export const multiApply = (params, data, state, props)=>{
    return mapValues(params.apps, (d, k)=>(props.applyFilters(d, get(data, k, data), state, props)))
}
export const not = (params, data, state, props)=>{
    return !props.applyFilters(params.fun, data, state,props)
}
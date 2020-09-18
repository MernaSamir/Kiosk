import store from 'store'
import {get, set, cloneDeep, isEmpty} from 'lodash'
import indexDB, {getData} from 'config/index_db'

export const printAction = (params, data, state=store.getState(), props)=>{
  const printing = get(state, 'Printing.print')
  if (!isEmpty(printing)) {
    setTimeout(()=>{
      printAction(params, data, undefined, props)
    }, 300)
  } else {
    if (data.type) {
      getData(indexDB.location, {store: 'prints'}, get(data, 'data.print.id'), 'id').then((d)=>{
        // console.log('c')
        if (d) {
          return data.data.print.afterPrint()
        }
        store.dispatch(data)
      })
    } else {
      //  console.log("data", data)
      if (data.afterPrint) {
        data.afterPrint()
      }
    }
  }
}
export const PrintAll = (params, data, state, props={})=>{
  // console.log(data)
  // if(!props.printed){
  //     props.printed = map(data, d=>(get(d, 'data.print.id', '')))
  // const datas = (await queryDB(indexDB.location, {store: 'prints'}, (key)=>((props.printed.includes(key))))).map(d=>d.timestamp)
  // console.log(props.printed)
  //     data = filter(data, d=>(!datas.includes(get(d, 'data.print.id', ''))))
  // }
  const {key=0} = props;
  const print = cloneDeep(get(data, key))
  const {afterPrint=()=>{}} = params
  //  console.log(data, key, print)
  if (!isEmpty(print)) {
    set(print, 'data.print.afterPrint', ()=>{
      PrintAll(params, data, state, {...props, key: key+1})
      return Promise.resolve()
    })
    printAction(params, print, undefined, props)
  } else {
    afterPrint();
  }
}

export const CopytoClip = (params, data, state, props)=>{
  // Create an auxiliary hidden input
  const aux = document.createElement('input');

  // Get the text from the element passed into the input
  aux.setAttribute('value', JSON.stringify(data));

  // Append the aux input to the body
  document.body.appendChild(aux);

  // Highlight the content
  aux.select();

  // Execute the copy command
  document.execCommand('copy');

  // Remove the input from the body
  document.body.removeChild(aux);
  return true
}

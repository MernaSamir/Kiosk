/* eslint-disable no-undef */
// self.onmessage = function(e){
//     this.console.log('iam hererrere in inshh')
//     if(e.data.addThis !== this.undefined){
//         this.postMessage({result: e.data.addThis.num1 + e.data.addThis.num2})
//     }
// }
import {includes, filter, lowerCase} from 'lodash'


self.onmessage = function(e) {
  const data = e.data.data
  const params = e.data.params
  const out = filter( data, (d)=>includes( lowerCase(d.name), lowerCase(params.params.search) ) )
  console.log('fffinh ', e.data.finalres)
  self.postMessage({result: out, finalres: e.data.finalres});
}

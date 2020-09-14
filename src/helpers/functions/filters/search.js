/* eslint-disable no-undef */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
// import SWorker from 'simple-web-worker'
// import {includes, filter, get, lowerCase, flatten} from 'lodash'
// import Worker from 'worker-loader!./worker.js';
// import cons from 'gun';

let outp = []; let w=4
export const search = (data) => {
//    outp.push(...data)
//    console.log('data in search', data)
}
export const WorkerSearch = (params, data, state, props) => {
  console.log('ww', w)
  if (window.Worker) {
    const NUM_WORKERS = 4

    const portion = Math.ceil(get(data, 'length', 0) / NUM_WORKERS);
    // let out = [] ,res=[]
    for (let i = 1; i <= NUM_WORKERS; i++) {
      const p_data = data.slice((i - 1) * portion, (i * portion))
      let myWorker = new Worker()
      w -=1
      myWorker.onmessage = function(e) {
        if (e.data.result.length) {
          console.log('iam in res ', i, ' ', e.data.result )
          const temp = e.data.finalres?e.data.finalres:[]
          console.log('final ', e.data.finalres)
          myWorker.postMessage({finalres: [...temp, ...e.data.result]});
          // search(e.data.result)
          // myWorker.terminate()
        }
        // return out
        // console.log('out', out)
        // console.log(`worker num${i}`, e.data.result);
      }
      myWorker.postMessage({data: p_data, params});


      // console.log('in worker',res,'')
      //   const p_data =
    }
    console.log('hereeeeee')
    if (w == 0) {
      return outp
    }


    // console.log('finl res', outp)
  }
  // return 'hffhsdfj'
}


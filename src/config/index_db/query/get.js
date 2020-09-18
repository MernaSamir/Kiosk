import {get} from 'lodash'
export function queryDB(db, settings, query=()=>true, cb=()=>{}) {
  if (db) {
    return new Promise((resolve, reject)=>{
      const out = []
      const tx = db.transaction([settings.store], 'readwrite');
      const store = tx.objectStore(settings.store);
      const request = store.openCursor();

      request.onerror = function(event) {
        reject(event)
        // console.err("error fetching data");
      };
      request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          if (query(cursor.primaryKey, cursor.value)) {
            out.push(cursor.value)
          }
          cursor.continue();
        } else {
          resolve(out)
        }
      };
    })
  }
  return Promise.resolve([])
}

export const getData = (db, settings, key, path='data')=>{
  if (db) {
    return new Promise((resolve, reject)=>{
      const tx = db.transaction([settings.store], 'readwrite');
      const store = tx.objectStore(settings.store);
      const request = store.get(key);
      request.onsuccess = (event) => {
        // console.log(event.target.result, request)
        resolve(get(event.target.result, path, event.target.result))
      }
    })
  }
  return Promise.resolve({})
}

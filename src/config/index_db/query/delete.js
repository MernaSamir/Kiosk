export function deleteAll(db, settings, query=()=>true, cb=()=>{}) {
  if (db) {
    return new Promise((resolve, reject)=>{
      const tx = db.transaction([settings.store], 'readwrite');
      const store = tx.objectStore(settings.store);
      const request = store.openCursor();

      request.onerror = function(event) {
        reject(event)
        console.log('error fetching data');
      };
      request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          if (query(cursor.primaryKey, cursor.value)) {
            //  console.log('deleting', cursor.primaryKey)
            cursor.delete();
            cursor.continue();
          }
        } else {
          resolve(true)
        }
      };
    })
  }
  return Promise.resolve(true)
}
export function clearAll(db, settings, query=()=>true, cb=()=>{}) {
  if (db) {
    return new Promise((resolve, reject)=>{
      const tx = db.transaction([settings.store], 'readwrite');
      const store = tx.objectStore(settings.store);
      const request = store.clear();

      request.onerror = function(event) {
        reject(event)
        // console.err("error fetching data");
      };
      request.onsuccess = function(event) {
        resolve(true)
      };
    })
  }
  return Promise.resolve(true)
}

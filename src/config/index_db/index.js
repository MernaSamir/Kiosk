export * from './query'
const indexDB = {}
if (window.indexedDB) {
  const dbReq = window.indexedDB.open('Sync_DB', 5);
  const store_names = ['location', 'syncs', 'new_syncs', 'logs', 'sync_data', 'prints'];
  dbReq.onupgradeneeded = function(event) {
    // Set the db variable to our database so we can use it!
    const db = event.target.result
    const names = db.objectStoreNames
    // Create an object store named notes. Object stores
    // in databases are where data are stored.
    store_names.map((d)=>{
      if (!names.contains(d)) {
        db.createObjectStore(d, {keyPath: 'timestamp'});
      }
    })
  }
  dbReq.onsuccess = function(event) {
    const db = event.target.result
    indexDB.location = db
  }
}

export default indexDB

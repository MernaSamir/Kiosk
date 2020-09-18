/* eslint-disable no-async-promise-executor */
import getTimeStamp from './common'
import moment from 'moment'
export function addToIndexDB(db, message, settings, timestamp) {
  if (db) {
    return new Promise(async (resolve, reject)=>{
      if (!timestamp) {
        const locationTrans = db.transaction(['location'], 'readwrite');
        const l_store = locationTrans.objectStore('location');
        timestamp = (await getTimeStamp(l_store)).timestamp
      }
      const tx = db.transaction([settings.store], 'readwrite');
      const store = tx.objectStore(settings.store);
      // Put the sticky note into the object store
      const sync = {data: JSON.parse(JSON.stringify(message)), timestamp: timestamp};
      store.put(sync);
      // Wait for the database transaction to complete
      tx.oncomplete = function() {
        return resolve(sync)
      }
      tx.onerror = function(event) {
        return reject(event.target.errorCode)
      }
    })
    // Start a database transaction and get the notes object store
  } else {
    return Promise.resolve()
  }
}
export function addFlatIndexDB(db, message, settings, id) {
  if (db) {
    return new Promise(async (resolve, reject)=>{
      const tx = db.transaction([settings.store], 'readwrite');
      const store = tx.objectStore(settings.store);
      // Put the sticky note into the object store
      const sync = {...JSON.parse(JSON.stringify(message)), timestamp: message.timestamp || message.id};
      store.put(sync);
      // Wait for the database transaction to complete
      tx.oncomplete = function() {
        return resolve(sync)
      }
      tx.onerror = function(event) {
        return reject(event.target.errorCode)
      }
    })
    // Start a database transaction and get the notes object store
  } else {
    return Promise.resolve()
  }
}
export function addBulkToIndexDB(db, message, settings, timestamp) {
  if (db) {
    return new Promise(async (resolve, reject)=>{
      const locationTrans = db.transaction(['location'], 'readwrite');
      const l_store = locationTrans.objectStore('location');
      const {diff} = await getTimeStamp(l_store)
      message.map((d)=>{
        let {timestamp} = d;
        if (!timestamp) {
          timestamp = String(moment().add(diff, 'seconds').format('x'))
        }
      })
      if (!timestamp) {
        timestamp = await getTimeStamp(l_store)
      }
      const tx = db.transaction([settings.store], 'readwrite');
      const store = tx.objectStore(settings.store);
      // Put the sticky note into the object store
      const sync = {data: JSON.parse(JSON.stringify(message)), timestamp: timestamp};
      store.put(sync);
      // Wait for the database transaction to complete
      tx.oncomplete = function() {
        return resolve(sync)
      }
      tx.onerror = function(event) {
        return reject(event.target.errorCode)
      }
    })
    // Start a database transaction and get the notes object store
  } else {
    return Promise.resolve()
  }
}

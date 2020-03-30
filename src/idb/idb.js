import idb from 'idb';

const dbPromise = idb.open('idb-store', 1, upgradeDB => {
    upgradeDB.createObjectStore('holdOrder');
});
export const idbHO = {
    get(key) {
        return dbPromise.then(db => {
            return db.transaction('holdOrder')
                .objectStore('holdOrder').get(key);
        });
    },
    set(key, val) {
        return dbPromise.then(db => {
            const tx = db.transaction('holdOrder', 'readwrite');
            tx.objectStore('holdOrder').put(val, key);
            return tx.complete;
        });
    },
    delete(key) {
        return dbPromise.then(db => {
            const tx = db.transaction('holdOrder', 'readwrite');
            tx.objectStore('holdOrder').delete(key);
            return tx.complete;
        });
    },
    clear() {
        return dbPromise.then(db => {
            const tx = db.transaction('holdOrder', 'readwrite');
            tx.objectStore('holdOrder').clear();
            return tx.complete;
        });
    },
    keys() {
        return dbPromise.then(db => {
            const tx = db.transaction('holdOrder');
            const keys = [];
            const store = tx.objectStore('holdOrder');

            // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
            // openKeyCursor isn't supported by Safari, so we fall back
            (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
                if (!cursor) return;
                keys.push(cursor.key);
                cursor.continue();
            });

            return tx.complete.then(() => keys);
        });
    }
};

// idbHO.set('foo', { hello: 'world' });

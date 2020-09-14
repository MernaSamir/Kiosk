import {get} from 'lodash'
import indexDB, {addToIndexDB} from 'config/index_db'

export const sendToHq = (params={}, data, state) => {
  const socket = get(state, `sockets.location`);
  if (socket) {
    const {channel='sendThisToHq'} = params
    addToIndexDB(indexDB.location, data, {store: 'new_syncs'})
    socket.emit(channel, data)
  }
}

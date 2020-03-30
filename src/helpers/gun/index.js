import Gun from 'gun'
import {GUN_SERVER, SERVER_Licensing} from 'config'

// export const gun_hq = Gun(`${SERVER}`)
export const gun_all = Gun(`${GUN_SERVER}`)
export const gun_licensing = Gun(SERVER_Licensing)

window.gun = gun_all
window.gun_lic = gun_licensing

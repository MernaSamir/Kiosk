export const API_URL = '/api/v1/'
export const GUN_SERVER = "http://localhost:3000/gun"
export const SERVER_Licensing = "http://192.168.100.56:8000/api/v1"
export const SERVER_URL = localStorage.getItem('ip_address') || `http://${window.location.hostname || 'localhost'}:8000`;

export const Modes = {
    'TW': '/home',
    'DI': '/floor-plan',
    'DL': '/delivery',
    'CC': '/call_center',
    'EV': '/events',
    'CT': '/catering'
}


export const SocketConfig = {
    'reconnection': true,
    'reconnectionDelay': 1000,
    'reconnectionDelayMax' : 10000,
}

export const isMobile = ()=>{
    return Boolean(window.cordova)
}

export const isDesktop = ()=>{
    return Boolean(window.electron)
}

export const activeModes = ['pos', 'sma_w']

export const MINIMUM_MS = 60 * 1000;
export const Items = {
    'ss': '/home/combo',
    'cm': '/home/custom_mix',
    'ssb': 'home/ssb',
    'ci':'/home/custom_item'
   
}
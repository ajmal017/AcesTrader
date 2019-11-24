//appWriteIEXLog.js

// NOTE THIS IS NOT FINISHED, PAUSED 11/24/19

// import { removeLocalDatabase, saveLocalDatabase, loadLocalDatabase, getLocalDatabaseKeys } from './localDatabaseStorage'

// let msgLog = []
// let currentKey = `${logKey}$keyCount`

// export const setNewIEXLogKey = (key) => {
//   const [logKey, setLogKey] = useState('IEX-Log')
//   const [keyCount, setKeyCount] = useState(1)
//   logKey = key
//   keyCount++
//   msgLog = [] //begin new key's msg log
// }

// export const addIEXLogMsg = (msg, key = currentKey) => {
//   msgLog.push(msg)
//   saveLocalDatabase(key)
// }

// export const getIEXLog = (key = currentKey) => loadLocalDatabase(key)

// export const removeIEXLog = (key = currentKey) => removeLocalDatabase(key)

// export const listIEXLogKeys = () => getLocalDatabaseKeys

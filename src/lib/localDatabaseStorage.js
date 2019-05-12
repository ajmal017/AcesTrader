// localDatabaseStorage.js

import { set } from 'idb-keyval'
import { get } from 'idb-keyval'
import { clear } from 'idb-keyval'
import { del } from 'idb-keyval'

export async function clearLocalDatabase() {
  clear()
}

export async function removeLocalDatabase(key) {
  del(key)
}

export async function loadLocalDatabase(key) {
  try {
    let val = await get(key)
    // debugger
    return val
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      debugger
    } else {
      alert('get() failed in loadLocalDatabase')
    }
    return false
  }
}

export async function saveLocalDatabase(key, value) {
  // debugger //BCM
  await set(key, value)

  // try {
  //   await set(key, state)
  //   // .then(() => console.log('It worked!'))
  //   // .catch(err => console.log('It failed!', err));
  // } catch (err) {
  //   if (process.env.NODE_ENV === 'development') {
  //     debugger
  //   } else {
  //     alert('set() failed in saveLocalDatabase')
  //   }
  //   return false
  // }
}

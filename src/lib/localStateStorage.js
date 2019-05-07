// localStateStorage.js

import { set } from 'idb-keyval'
import { get } from 'idb-keyval'
import { clear } from 'idb-keyval'
import { del } from 'idb-keyval'

export async function clearLocalState() {
  clear()
}

export async function removeLocalState(key) {
  del(key)
}

export async function loadLocalState(key) {
  let val = await get(key)
  // debugger //BCM
  return val

  // try {
  //   let val = await get(key)
  //   debugger
  //   return val
  //   // .then(val => console.log(val))
  // } catch (err) {
  //   if (process.env.NODE_ENV === 'development') {
  //     debugger
  //   } else {
  //     alert('get() failed in localStateStorage')
  //   }
  //   return false
  // }
}

export async function saveLocalState(key, value) {
  // debugger //BCM
  await set(key, value)
  // .then(() => console.log('saveLocalState worked!'))
  // .catch(err => console.log('saveLocalState failed!', err))

  // try {
  //   await set(key, state)
  //   // .then(() => console.log('It worked!'))
  //   // .catch(err => console.log('It failed!', err));
  // } catch (err) {
  //   if (process.env.NODE_ENV === 'development') {
  //     debugger
  //   } else {
  //     alert('set() failed in localStateStorage')
  //   }
  //   return false
  // }
}

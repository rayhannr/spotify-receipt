import { createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Token, User } from './models'

export const store = createStore()

export const tokenAtom = atomWithStorage<Token | null>('sporeceipt-token', null, undefined, { getOnInit: true })
export const userAtom = atomWithStorage<User | null>('sporeceipt-user', null, undefined, { getOnInit: true })

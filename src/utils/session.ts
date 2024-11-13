import { store, tokenAtom, userAtom } from '@/store'

export const removeSession = () => {
  store.set(userAtom, null)
  store.set(tokenAtom, null)
}

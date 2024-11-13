import { useEffect } from 'react'
import { exchangeToken } from './utils/auth'
import { useAtomValue, useSetAtom } from 'jotai'
import { tokenAtom, userAtom } from './store'
import { getCurrentUser } from './utils/api'
import { Receipt } from './components/Receipt'

function App() {
  const token = useAtomValue(tokenAtom)
  const setUser = useSetAtom(userAtom)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code') || ''

    if (token || !code) return
    exchangeToken(code)
  }, [token])

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  return <Receipt />
}

export default App

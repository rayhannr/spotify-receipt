import { useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { exchangeToken } from './utils/auth'
import { tokenAtom, userAtom } from './store'
import { getCurrentUser } from './utils/api'
import { Receipt } from './components/Receipt'

function App() {
  const token = useAtomValue(tokenAtom)
  const setUser = useSetAtom(userAtom)

  const getUser = () => {
    getCurrentUser().then(setUser)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code') || ''

    if (token || !code) return
    exchangeToken().then(getUser)
  }, [])

  useEffect(() => {
    getUser()
  }, [])

  return <Receipt />
}

export default App

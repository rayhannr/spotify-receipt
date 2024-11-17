import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { exchangeToken } from './utils/auth'
import { userAtom } from './store'
import { sdk } from './utils/api'
import { Receipt } from './components/Receipt'

function App() {
  const setUser = useSetAtom(userAtom)

  const getUser = () => {
    sdk.currentUser.profile().then(setUser)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code') || ''

    if (!code) return
    exchangeToken().then(getUser)
  }, [])

  return <Receipt />
}

export default App

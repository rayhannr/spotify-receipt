import { useEffect } from 'react'
import { authorize, exchangeToken } from './utils/auth'
import { useAtom, useAtomValue } from 'jotai'
import { tokenAtom, userAtom } from './store'
import { getCurrentUser } from './utils/api'
import { Button } from './components/ui/button'

function App() {
  const token = useAtomValue(tokenAtom)
  const [user, setUser] = useAtom(userAtom)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code') || ''

    if (token || !code) return
    exchangeToken(code)
  }, [token])

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  return <Button onClick={authorize}>login to spotify</Button>
}

export default App

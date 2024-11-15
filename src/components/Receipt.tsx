import { userAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { Title } from './Title'
import { Button } from './ui/button'
import { removeSession } from '@/utils/session'
import { ReceiptGenerator } from './ReceiptGenerator'

export const Receipt = () => {
  const user = useAtomValue(userAtom)

  return (
    <div className="w-full sm:w-3/4 lg:w-2/3 mx-auto px-4 sm:px-0 py-8 md:py-10 lg:py-12">
      {!user && (
        <div className="text-center">
          <Title />
        </div>
      )}

      {user && (
        <>
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">Hi, {user.display_name}</h1>
          <span className="text-muted-foreground">Not you?</span>{' '}
          <Button variant="link" onClick={removeSession} className="px-0">
            Logout
          </Button>
          <ReceiptGenerator />
        </>
      )}
    </div>
  )
}

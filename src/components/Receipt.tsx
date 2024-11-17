import { useAtomValue } from 'jotai'
import { userAtom } from '@/store'
import { logout } from '@/utils/auth'
import { Title } from './Title'
import { Button } from './ui/button'
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
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight flex gap-2 items-center">
            <img src={user.images[0].url} className="w-7 h-7 rounded-[50%]" />
            Hi, {user.display_name}
          </h1>
          <span className="text-muted-foreground">Not you?</span>{' '}
          <Button variant="link" onClick={logout} className="p-0 h-auto">
            Logout
          </Button>
          <div className="flex flex-wrap gap-6 mt-4">
            <div className="w-full lg:w-5/12">
              <ReceiptGenerator />
            </div>
            <div className="w-full lg:w-auto flex-1">koeko</div>
          </div>
        </>
      )}
    </div>
  )
}

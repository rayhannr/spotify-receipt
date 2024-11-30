import { useAtomValue } from 'jotai'
import { userAtom } from '@/store'
import { logout } from '@/utils/auth'
import { Title } from './Title'
import { Button } from './ui/button'
import { ReceiptGenerator } from './ReceiptGenerator'
import { ReceiptImage } from './ReceiptImage'
import { Information } from './Information'
import { Accordion } from './ui/accordion'
import { MusicTaste } from './MusicTaste'

export const Receipt = () => {
  const user = useAtomValue(userAtom)

  return (
    <main className="w-full sm:w-3/4 lg:w-2/3 mx-auto px-4 sm:px-0 py-8 md:py-10 lg:py-12">
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
          <span className="text-muted-foreground text-sm">Not you?</span>{' '}
          <Button variant="link" onClick={logout} className="p-0 h-auto">
            Logout
          </Button>
          <section className="flex flex-wrap gap-6">
            <div className="w-full lg:w-5/12">
              <Accordion type="multiple" defaultValue={['customize', 'taste']} className="w-full">
                <ReceiptGenerator />
                <MusicTaste />
                <Information />
              </Accordion>
            </div>
            <div className="w-full lg:w-auto flex-1 flex flex-col items-center gap-3">
              <ReceiptImage />
            </div>
          </section>
        </>
      )}
    </main>
  )
}

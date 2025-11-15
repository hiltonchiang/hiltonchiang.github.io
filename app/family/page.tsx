import FamilyTree1 from '@/components/FamilyTree1'
import FamilyTree2 from '@/components/FamilyTree2'
import FamilyTreeMD1 from '@/components/FamilyTreeMD1'
import FamilyTreeMD2 from '@/components/FamilyTreeMD2'
import FamilyTreeMD3 from '@/components/FamilyTreeMD3'
import FamilyTreeMD4 from '@/components/FamilyTreeMD4'
import FamilyTreeMD5 from '@/components/FamilyTreeMD5'
import FamilyTreeMD6 from '@/components/FamilyTreeMD6'
import FamilyTreeMD7 from '@/components/FamilyTreeMD7'
import FamilyTreeMD8 from '@/components/FamilyTreeMD8'
import FamilyTreeMD9 from '@/components/FamilyTreeMD9'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DialogPage from '@/components/DialogPage'

export default async function Page() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')
  let blurFlag = false
  if (!authToken) {
    blurFlag = true
  }
  return (
    <>
      <div id="main-family-page" data-blur="true" className="blur-lg filter">
        <ScrollTopAndComment />
        <div className="realtive hidden w-screen max-w-[1088px] divide-y border-2 border-solid p-4 md:block md:w-full">
          <FamilyTree1 />
          <FamilyTree2 />
        </div>
        <div className="divide-y md:hidden">
          <FamilyTreeMD1 />
          <FamilyTreeMD2 />
          <FamilyTreeMD3 />
          <FamilyTreeMD4 />
          <FamilyTreeMD5 />
          <FamilyTreeMD6 />
          <FamilyTreeMD7 />
          <FamilyTreeMD8 />
          <FamilyTreeMD9 />
        </div>
      </div>
      <DialogPage />
    </>
  )
}

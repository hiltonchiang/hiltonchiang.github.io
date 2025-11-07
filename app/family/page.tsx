import FamilyTree1 from '@/components/FamilyTree1'
import FamilyTree2 from '@/components/FamilyTree2'
import FamilyTreeMD1 from '@/components/FamilyTreeMD1'
import FamilyTreeMD2 from '@/components/FamilyTreeMD2'
import FamilyTreeMD3 from '@/components/FamilyTreeMD3'
import FamilyTreeMD4 from '@/components/FamilyTreeMD4'
import FamilyTreeMD5 from '@/components/FamilyTreeMD5'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

export default async function Page() {
  return (
    <>
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
      </div>
    </>
  )
}

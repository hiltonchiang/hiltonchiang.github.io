import FamilyTree from '@/components/FamilyTree'

export default async function Page() {
  return (
    <>
      <div className="realtive md h-[1024px] w-screen max-w-[1088px] border-2 border-solid p-4 md:w-full">
        <FamilyTree />
      </div>
    </>
  )
}

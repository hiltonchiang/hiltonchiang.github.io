import FamilyTree from '@/components/FamilyTree'

export default async function Page() {
  return (
    <>
      <div className="md max-w-[1088px] transform-gpu p-4 hover:scale-150 md:w-full">
        <FamilyTree />
      </div>
    </>
  )
}

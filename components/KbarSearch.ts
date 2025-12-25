'use client'
import { Action } from 'kbar'

async function handlePerform(e) {
  console.log('handlePerform', e)
}
const handleSearchDocumentsLoad = (D) => {
  const myAction: Action[] = [] as Action[]
  for (let i = 0; i < D.length; i++) {
    const action: Action = {
      id: i.toString(),
      name: D[i].title,
      perform: handlePerform,
    }
    myAction.push(action)
  }
  return myAction
}

export default handleSearchDocumentsLoad

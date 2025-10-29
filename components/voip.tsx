'use client'
import { WheelEvent } from 'react'

const VoIPComponent = () => {
  const handleWheelEvent = (e: WheelEvent<HTMLDivElement>) => {
    // Access properties of the WheelEvent object
    console.log('Delta Y:', e.deltaY) // Vertical scroll amount
    console.log('Delta X:', e.deltaX) // Horizontal scroll amount
    // Perform actions based on scroll direction or amount
  }

  return <div onWheel={handleWheelEvent}>Scroll over me!</div>
}

export default VoIPComponent

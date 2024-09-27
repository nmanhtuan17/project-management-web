import { useState } from 'react'
import './App.css'
import { StartUp } from '@/components/Startup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <StartUp />
    </>
  )
}

export default App

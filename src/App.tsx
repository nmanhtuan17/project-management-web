import { useState } from 'react'
import './App.css'
import { StartUp } from '@/components/Startup'
import ReduxProvider from '@/components/providers/ReduxProvider'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ReduxProvider>
      <StartUp />
    </ReduxProvider>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import { StartUp } from '@/components/Startup'
import ReduxProvider from '@/components/providers/ReduxProvider'
import PageNotFound from '@/views/404'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <ReduxProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </ReduxProvider>
  )
}

export default App

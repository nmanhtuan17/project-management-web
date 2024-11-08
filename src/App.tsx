import { useState } from 'react'
import ReduxProvider from '@/components/providers/ReduxProvider'
import PageNotFound from '@/views/404'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '@/views/auth/Login'
import RegisterPage from '@/views/auth/Register'
import VerifyPage from '@/views/auth/VerifyPage'
import AuthLayout from '@/components/layouts/AuthLayout'
import BoardingLayout from '@/components/layouts/BoardingLayout'
import Boarding from '@/views/boading'
import ProjectPage from './views/project'
import DialogProvider from './components/providers/DialogProvider'
import MainLayout from './components/layouts/MainLayout'
import { Toaster } from 'sonner'

function App() {

  return (
    <ReduxProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DialogProvider />}>
            <Route path='projects/' element={<MainLayout />}>
              <Route path=':projectSlug/'>
                <Route index element={<ProjectPage />} />
              </Route>
            </Route>
            <Route path={'boarding/'} element={<BoardingLayout />}>
              <Route index element={<Boarding />} />
              <Route path={'new'} element={<div />} />
            </Route>
            <Route path={'auth/'} element={<AuthLayout />}>
              <Route index path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="verify" element={<VerifyPage />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Route>

        </Routes>
      </BrowserRouter>
      <Toaster closeButton richColors toastOptions={{
        classNames: {
          error: 'bg-red-400',
          success: 'bg-green-400',
          warning: 'bg-yellow-400',
          info: 'bg-blue-400',
        }
      }} />
    </ReduxProvider>
  )
}

export default App

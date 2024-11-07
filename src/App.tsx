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
import ProjectLayout from './components/layouts/ProjectLayout'

function App() {

  return (
    <ReduxProvider>
      <>
        <BrowserRouter>
          <Routes>
            <Route path='projects/' element={<ProjectLayout />}>
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

          </Routes>
        </BrowserRouter>
      </>
    </ReduxProvider>
  )
}

export default App

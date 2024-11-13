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
import HomePage from './views/home'
import DialogProvider from './components/providers/DialogProvider'
import MainLayout from './components/layouts/MainLayout'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/AuthProvider'
import MailPage from '@/views/mail'
import { ProjectDetail } from '@/views/tasks'
import ProjectTasks from '@/views/tasks/ProjectTask'
import TasksBoard from '@/views/tasks/TaskBoard'

function App() {

  return (
    <ReduxProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DialogProvider />}>
            <Route path='/' element={<AuthProvider />}>
              <Route path='/' element={<MainLayout />}>
                <Route path='' index element={<HomePage />} />
                <Route path='projects/'>
                  <Route path=':projectSlug/'>
                    <Route path='' index element={<HomePage />} />
                    <Route path='details/' element={<ProjectDetail />}>
                      <Route path='overview/' element={<div />} />
                      <Route path='tasks/' element={<ProjectTasks />} >
                        <Route path='performance/' element={<TasksBoard />} />
                        <Route path='list/' element={<TasksBoard />} />
                        <Route path='kanban/' element={<TasksBoard />} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
                <Route path={'mails/'} >
                  {['inbox', 'sent', 'important', 'drafts', 'trash'].map(path => (
                    <Route key={path} path="">
                      <Route path={path} element={<MailPage />} />
                      <Route path={`${path}/:mailId`} element={<MailPage />} />
                    </Route>
                  ))}
                </Route>
              </Route>
              <Route path={'boarding/'} element={<BoardingLayout />}>
                <Route index element={<Boarding />} />
              </Route>
              <Route path={'auth/'} element={<AuthLayout />}>
                <Route index path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="verify" element={<VerifyPage />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Route>
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

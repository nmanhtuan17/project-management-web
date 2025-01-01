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
import { ProjectLayout } from '@/views/project'
import TaskLayout from '@/views/tasks'
import TasksBoard from '@/views/tasks/TaskBoard'
import { TaskList } from '@/views/tasks/TaskList'
import { MemberPage } from '@/views/member'
import SettingsProfilePage from '@/views/setting/profile'
import SettingsLayout from '@/views/setting/layout'
import { ProjectOverview } from './views/project/ProjectOverview'

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
                    <Route path='details/' element={<ProjectLayout />}>
                      <Route index path='overview/' element={<ProjectOverview />} />
                      <Route path='tasks/' element={<TaskLayout />} >
                        <Route index path='performance/' element={<TasksBoard />} />
                        <Route path='list/' element={<TaskList />} />
                        <Route path='kanban/' element={<TasksBoard />} />
                      </Route>
                      <Route path='members/' element={<MemberPage />} />
                    </Route>
                  </Route>
                  <Route path='setting/' element={<SettingsLayout />}>
                    <Route path='profile' element={<SettingsProfilePage />} />
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

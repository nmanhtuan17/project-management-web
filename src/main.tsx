import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime);
dayjs.locale('vi')

createRoot(document.getElementById('root')!).render(
  <App />,
)

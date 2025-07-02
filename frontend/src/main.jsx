import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router.jsx'
import 'sweetalert2/dist/sweetalert2.js'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvide } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvide>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthProvide>
    </Provider>
  </StrictMode>
)

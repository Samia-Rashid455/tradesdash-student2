import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import App from './App'
import { antdTheme } from './theme'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider theme={antdTheme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>
)
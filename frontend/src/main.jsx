import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// reactDom v18 uses createRoot instead of ReactDOM.render
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

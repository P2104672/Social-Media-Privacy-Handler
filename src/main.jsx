import React from 'react'
import { RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'; // Remember it is for CLIENT !!!!!!!!!
import './index.css'
import { router } from './router'


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router = { router } />
  </React.StrictMode>
)
import React from 'react'
import {createRoot} from 'react-dom/client'
import { RouterProvider, createBrowserRouter} from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Login from './components/Login.jsx'
import GroupChat from "./components/GroupChat.jsx";
import './index.css'

const router=createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:
    [
      {
        path:"",
        element:<Login/>
      },
      {
        path:"/groupchat",
        element:<GroupChat/>
      }
    ]

  }
])
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)

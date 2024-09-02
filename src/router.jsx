import App from './App.jsx'
import './index.css'
import Profile from './routes/Profile.jsx'
import Dashboard from './routes/Dashboard.jsx'
import SearchPost from './routes/SearchPost.jsx'
import {createBrowserRouter} from "react-router-dom";

// put all the routes here !!!!!!!
export const router = createBrowserRouter([
    {path: '/', element:<App />},
    {path: '/profile', element:<Profile />},
    {path: '/dashboard', element:<Dashboard />},
    {path: '/search', element:<SearchPost />}

  ])
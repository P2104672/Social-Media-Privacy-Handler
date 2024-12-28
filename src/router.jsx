import App from './App.jsx'
import './index.css'
import Profile from './routes/Profile.jsx'
// import Dashboard from './routes/Dashboard.jsx'
import SearchPost from './routes/SearchPost.jsx'
import {createBrowserRouter} from "react-router-dom";
// import PostManagement from './routes/PostManagement.jsx';
import DashboardSocialMeida from './routes/DashboardSocialMeida.jsx';
import SignInPage from './routes/SignInPage.jsx';
import SignUpPage from './routes/SignUpPage.jsx';

// put all the routes here !!!!!!!
export const router = createBrowserRouter([
    {path: '/', element:<App />},
    {path: '/profile', element:<Profile />},
    {path: '/search', element:<SearchPost />},
    {path: '/DashboardSocialMeida', element:<DashboardSocialMeida/> },
    {path: '/signin' ,element:<SignInPage/>},
    {path: '/signup', element:<SignUpPage/>},


  ])
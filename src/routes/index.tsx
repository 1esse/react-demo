import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import UserList from '../pages/UserList'
import RoleList from '../pages/RoleList'

import BasicSetting from '../pages/BasicSetting'
import AdvancedSetting from '../pages/AdvancedSetting'
import DynamicTab from '../pages/DynamicTab'
import DynamicTabDetail from '../pages/DynamicTabDetail'
import DynamicMenu from '../pages/DynamicMenu'
import DynamicMenuDetail from '../pages/DynamicMenuDetail'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'user/list',
        element: <UserList />
      },
      {
        path: 'role/list',
        element: <RoleList />
      },
      {
        path: 'router/dynamic-tab',
        element: <DynamicTab />
      },
      {
        path: 'router/dynamic-menu',
        element: <DynamicMenu />
      },
      {
        path: 'dynamic-tab/:id',
        element: <DynamicTabDetail />
      },
      {
        path: 'dynamic-menu/:id',
        element: <DynamicMenuDetail />
      },
      {
        path: 'system/basic',
        element: <BasicSetting />
      },
      {
        path: 'system/advanced',
        element: <AdvancedSetting />
      },
      {
        path: '*',
        element: <DynamicMenuDetail />
      }
    ]
  }
])

export default router

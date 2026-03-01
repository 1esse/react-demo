import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useMatch } from 'react-router-dom'
import './DynamicMenuDetail.scss'

const DynamicMenuDetail: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const match = useMatch('/*')
  const [menuInfo, setMenuInfo] = useState({ title: '动态菜单', path: '暂无路径' })

  useEffect(() => {
    // 首先尝试从 location.state 获取
    if (location.state && typeof location.state === 'object') {
      setMenuInfo({
        title: location.state.title || '动态菜单',
        path: location.state.path || '暂无路径'
      })
    } else {
      // 从 localStorage 中获取菜单信息
      try {
        const savedDynamicMenus = localStorage.getItem('dynamicMenus')
        if (savedDynamicMenus) {
          const dynamicMenus = JSON.parse(savedDynamicMenus)
          // 尝试通过路径查找菜单
          let menu = null
          
          // 通过当前路径查找（需要解码，处理中文路径）
          const currentPath = location.pathname
          const decodedPath = decodeURIComponent(currentPath)
          
          // 同时检查编码和解码后的路径
          menu = dynamicMenus.find((m: any) => m.path === decodedPath || m.path === currentPath)
          
          if (menu) {
            setMenuInfo({
              title: menu.label || '动态菜单',
              path: menu.path || '暂无路径'
            })
          }
        }
      } catch (error) {
        console.error('Failed to get menu info from localStorage:', error)
      }
    }
  }, [location.state, location.pathname])

  return (
    <div className="dynamic-menu-detail">
      <div className="dynamic-menu-detail-header">
        <h1>{menuInfo.title}</h1>
      </div>
      <div className="dynamic-menu-detail-content">
        <p>菜单路径：{menuInfo.path}</p>
        <p>这是一个动态创建的菜单页面，已经添加到左侧导航栏中。</p>
      </div>
    </div>
  )
}

export default DynamicMenuDetail
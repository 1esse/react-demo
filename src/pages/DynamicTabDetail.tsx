import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './DynamicTabDetail.scss'

const DynamicTabDetail: React.FC = () => {
  const location = useLocation()
  const [tabInfo, setTabInfo] = useState({ title: '动态标签', content: '暂无内容' })

  useEffect(() => {
    // 首先尝试从 location.state 获取
    if (location.state && typeof location.state === 'object') {
      setTabInfo({
        title: location.state.title || '动态标签',
        content: location.state.content || '暂无内容'
      })
    } else {
      // 从 localStorage 中获取标签信息
      try {
        const savedDynamicTabs = localStorage.getItem('dynamicTabs')
        if (savedDynamicTabs) {
          const dynamicTabs = JSON.parse(savedDynamicTabs)
          // 通过当前路径查找（需要解码，处理中文路径）
          const currentPath = location.pathname
          const decodedPath = decodeURIComponent(currentPath)
          
          // 同时检查编码和解码后的路径
          const tab = dynamicTabs.find((t: any) => t.path === decodedPath || t.path === currentPath)
          
          if (tab) {
            setTabInfo({
              title: tab.label || '动态标签',
              content: tab.content || '暂无内容'
            })
          }
        }
      } catch (error) {
        console.error('Failed to get tab info from localStorage:', error)
      }
    }
  }, [location.state, location.pathname])

  return (
    <div className="dynamic-tab-detail">
      <div className="dynamic-tab-detail-header">
        <h1>{tabInfo.title}</h1>
      </div>
      <div className="dynamic-tab-detail-content">
        <p>{tabInfo.content}</p>
      </div>
    </div>
  )
}

export default DynamicTabDetail
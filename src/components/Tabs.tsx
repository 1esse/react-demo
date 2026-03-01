import { useState, useEffect, useRef } from 'react'
import { Tabs as AntTabs, Button, Space, Menu, Tooltip, Divider } from 'antd'
import { 
  ReloadOutlined, 
  ColumnWidthOutlined, 
  VerticalRightOutlined,
  CloseOutlined,
  StopOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './Tabs.scss'

interface TabItem {
  key: string
  label: string
  path: string
}

interface TabsProps {
  tabs: TabItem[]
  activeTabKey: string
  onTabsChange: (tabs: TabItem[]) => void
  onActiveTabChange: (key: string) => void
  onTabClose?: () => void
  onRefresh?: () => void
  animating?: boolean
}

const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  activeTabKey, 
  onTabsChange, 
  onActiveTabChange,
  onTabClose,
  onRefresh,
  animating = false
}) => {
  const navigate = useNavigate()
  const [contextMenuVisible, setContextMenuVisible] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [currentTabKey, setCurrentTabKey] = useState('')
  const tabsRightRef = useRef<HTMLDivElement>(null)

  // 处理全局点击事件，关闭右键菜单
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenuVisible(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  // 当激活标签变化时，滚动到该标签位置
  useEffect(() => {
    // 延迟滚动，确保DOM已经更新
    setTimeout(() => {
      const activeTab = document.querySelector(`.ant-tabs-tab.ant-tabs-tab-active`)
      if (activeTab && tabsRightRef.current) {
        // 计算滚动位置，使激活的标签居中
        const tabRect = activeTab.getBoundingClientRect()
        const containerRect = tabsRightRef.current.getBoundingClientRect()
        const scrollPosition = tabsRightRef.current.scrollLeft + (tabRect.left - containerRect.left) - (containerRect.width / 2) + (tabRect.width / 2)
        
        // 平滑滚动
        tabsRightRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
  }, [activeTabKey])

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    const tab = tabs.find(tab => tab.key === key)
    if (tab) {
      navigate(tab.path)
      onActiveTabChange(key)
    }
  }

  // 处理标签页关闭
  const handleTabClose = (key: string) => {
    const closedTabIndex = tabs.findIndex(tab => tab.key === key)
    const newTabs = tabs.filter(tab => tab.key !== key)
    
    // 触发页面动画
    if (onTabClose) {
      onTabClose()
    }
    
    // 延迟更新标签页，确保动画有足够的时间执行
    setTimeout(() => {
      // 确保至少有一个标签页
      const finalTabs = newTabs.length > 0 ? newTabs : [{ key: '1', label: '首页', path: '/dashboard' }]
      onTabsChange(finalTabs)
      
      // 如果关闭的是当前标签页
      if (key === activeTabKey) {
        if (finalTabs.length > 0) {
          // 跳转到下一个标签页
          const nextTabIndex = Math.min(closedTabIndex, finalTabs.length - 1)
          const nextTab = finalTabs[nextTabIndex]
          navigate(nextTab.path)
          onActiveTabChange(nextTab.key)
        } else {
          // 如果没有标签页了，跳转到首页
          navigate('/dashboard')
          onActiveTabChange('1')
        }
      }
    }, 150)
  }

  // 刷新当前页面
  const handleRefresh = () => {
    // 优先使用用户点击的标签页（右键菜单时设置的currentTabKey），如果没有则使用当前激活的标签页
    const targetTabKey = currentTabKey || activeTabKey
    const currentTab = tabs.find(tab => tab.key === targetTabKey)
    if (currentTab) {
      // 跳转到对应标签页所代表的菜单页面
      navigate(currentTab.path)
      // 激活该标签页
      onActiveTabChange(currentTab.key)
      // 触发刷新
      if (onRefresh) {
        onRefresh()
      }
    }
  }

  // 关闭其他标签页
  const handleCloseOther = () => {
    // 优先使用用户点击的标签页（右键菜单时设置的currentTabKey），如果没有则使用当前激活的标签页
    const targetTabKey = currentTabKey || activeTabKey
    const currentTab = tabs.find(tab => tab.key === targetTabKey)
    if (currentTab) {
      onTabsChange([currentTab])
      // 激活该标签页
      onActiveTabChange(currentTab.key)
      // 跳转到该标签页对应的路径
      navigate(currentTab.path)
      // 触发页面动画
      if (onTabClose) {
        onTabClose()
      }
    }
  }

  // 关闭右侧标签页
  const handleCloseRight = () => {
    // 优先使用用户点击的标签页（右键菜单时设置的currentTabKey），如果没有则使用当前激活的标签页
    const targetTabKey = currentTabKey || activeTabKey
    const currentIndex = tabs.findIndex(tab => tab.key === targetTabKey)
    if (currentIndex !== -1) {
      const newTabs = tabs.slice(0, currentIndex + 1)
      onTabsChange(newTabs)
      // 激活该标签页
      onActiveTabChange(targetTabKey)
      // 跳转到该标签页对应的路径
      const currentTab = tabs.find(tab => tab.key === targetTabKey)
      if (currentTab) {
        navigate(currentTab.path)
      }
      // 触发页面动画
      if (onTabClose) {
        onTabClose()
      }
    }
  }

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent, key: string) => {
    e.preventDefault()
    setCurrentTabKey(key)
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setContextMenuVisible(true)
  }

  // 关闭右键菜单
  const handleContextMenuClose = () => {
    setContextMenuVisible(false)
  }



  // 生成标签页items
  const tabItems = tabs.map(tab => ({
    key: tab.key,
    label: (
      <div 
        onContextMenu={(e) => handleContextMenu(e, tab.key)}
        style={{ cursor: 'pointer', width: '100%', height: '100%', padding: '8px 0' }}
      >
        {tab.label}
      </div>
    ),
    closable: true // 所有标签页都可以关闭
  }))

  return (
    <div className="tabs-container">
      <div className="tabs-left">
        <Space size="small">
          <Tooltip title="刷新当前页">
            <Button 
              type="text" 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              style={{ backgroundColor: 'white', borderRadius: '50%', padding: '8px' }}
            />
          </Tooltip>
          <Tooltip title="关闭其他">
            <Button 
              type="text" 
              icon={<ColumnWidthOutlined />} 
              onClick={handleCloseOther}
              style={{ backgroundColor: 'white', borderRadius: '50%', padding: '8px' }}
            />
          </Tooltip>
          <Tooltip title="关闭右侧">
            <Button 
              type="text" 
              icon={<VerticalRightOutlined />} 
              onClick={handleCloseRight}
              style={{ backgroundColor: 'white', borderRadius: '50%', padding: '8px' }}
            />
          </Tooltip>
        </Space>
      </div>
      <Divider orientation="vertical" style={{ margin: '0 16px', backgroundColor: 'rgb(225,225,225)', height: '1rem' }} />
      <div className={`tabs-right ${animating ? 'tabs-animating' : ''}`} ref={tabsRightRef}>
        <AntTabs 
          activeKey={activeTabKey}
          onChange={handleTabChange}
          type="card"
          className="layout-tabs"
          items={tabItems}
        />
        {contextMenuVisible && (
          <div 
            className="context-menu"
            style={{
              position: 'fixed',
              left: `${contextMenuPosition.x}px`,
              top: `${contextMenuPosition.y}px`,
              zIndex: 1000,
              background: '#fff',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transformOrigin: '0 0'
            }}
            onClick={handleContextMenuClose}
          >
            <Menu 
              onClick={handleContextMenuClose}
              items={[
                {
                  key: 'refresh',
                  label: <span style={{ whiteSpace: 'nowrap' }}><ReloadOutlined style={{ marginRight: 8 }} />刷新</span>,
                  onClick: handleRefresh
                },
                {
                  key: 'close',
                  label: <span style={{ whiteSpace: 'nowrap' }}><CloseOutlined style={{ marginRight: 8 }} />关闭</span>,
                  onClick: () => handleTabClose(currentTabKey)
                },
                {
                  key: 'closeOther',
                  label: <span style={{ whiteSpace: 'nowrap' }}><ColumnWidthOutlined style={{ marginRight: 8 }} />关闭其他</span>,
                  onClick: handleCloseOther
                },
                {
                  key: 'closeRight',
                  label: <span style={{ whiteSpace: 'nowrap' }}><VerticalRightOutlined style={{ marginRight: 8 }} />关闭右侧</span>,
                  onClick: handleCloseRight
                },
                {
                  key: 'closeAll',
                  label: <span style={{ whiteSpace: 'nowrap' }}><StopOutlined style={{ marginRight: 8 }} />关闭所有</span>,
                  onClick: () => {
                    // 触发页面动画
                    if (onTabClose) {
                      onTabClose();
                    }
                    // 延迟更新标签页，确保动画有足够的时间执行
                    setTimeout(() => {
                      onTabsChange([{ key: '1', label: '首页', path: '/dashboard' }]);
                      navigate('/dashboard');
                      onActiveTabChange('1');
                    }, 150);
                  }
                }
              ]}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Tabs
import { useState, useEffect, useRef } from 'react'
import { Layout as AntLayout, Button, Space, Input, Dropdown, Avatar } from 'antd'
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  SearchOutlined,
  DownOutlined,
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  MenuOutlined,
  FileOutlined,
  FolderOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  PlusCircleOutlined,
  AppstoreAddOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Breadcrumb from '../components/Breadcrumb'
import Tabs from '../components/Tabs'
import './Layout.scss'

// 完整菜单项数据，包含拼音、首字母和图标
const menuItems = [
  { key: '1', label: '首页', path: '/dashboard', pinyin: 'shouye', initial: 's', icon: 'DashboardOutlined' },
  { key: '2', label: '用户管理', path: '/user/list', pinyin: 'yonghuguanli', initial: 'y', icon: 'UserOutlined' },
  { key: '3', label: '角色管理', path: '/role/list', pinyin: 'jiaoseguanli', initial: 'j', icon: 'TeamOutlined' },
  { 
    key: '6', 
    label: '路由管理', 
    path: '/router', 
    pinyin: 'luyouguanli', 
    initial: 'l',
    icon: 'MenuOutlined',
    children: [
      { key: '6-1', label: '动态标签', path: '/router/dynamic-tab', pinyin: 'dongtaibiaoqian', initial: 'd', icon: 'PlusCircleOutlined' },
      { key: '6-2', label: '动态菜单', path: '/router/dynamic-menu', pinyin: 'dongtaicaidan', initial: 'd', icon: 'AppstoreAddOutlined' }
    ]
  },
  { 
    key: '5', 
    label: '系统设置', 
    path: '/system', 
    pinyin: 'xitongshezhi', 
    initial: 'x',
    icon: 'SettingOutlined',
    children: [
      { key: '5-1', label: '基本设置', path: '/system/basic', pinyin: 'jibenshezhi', initial: 'j', icon: 'FileOutlined' },
      { key: '5-2', label: '高级设置', path: '/system/advanced', pinyin: 'gaojishezhi', initial: 'g', icon: 'FolderOutlined' }
    ]
  }
]

// 路径映射配置
const pathMap: Record<string, { title: string, key: string }> = {
  '/dashboard': { title: '首页', key: '1' },
  '/user/list': { title: '用户管理', key: '2' },
  '/role/list': { title: '角色管理', key: '3' },
  '/router/dynamic-tab': { title: '动态标签', key: '6-1' },
  '/router/dynamic-menu': { title: '动态菜单', key: '6-2' },
  '/system/basic': { title: '基本设置', key: '5-1' },
  '/system/advanced': { title: '高级设置', key: '5-2' }
}

const { Header, Content } = AntLayout

interface TabItem {
  key: string
  label: string
  path: string
}

// 菜单项定义
interface MenuItem {
  key: string
  label: string
  path: string
  children?: MenuItem[]
}

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: '1', label: '首页', path: '/dashboard' }
  ])
  const [activeTabKey, setActiveTabKey] = useState('1')
  const [isAnimating, setIsAnimating] = useState(true) // 初始化为true，触发首次进场动画
  const [breadcrumbAnimating, setBreadcrumbAnimating] = useState(false) // 面包屑动画状态
  const [tabsAnimating, setTabsAnimating] = useState(false) // 标签页动画状态
  const [refreshKey, setRefreshKey] = useState(0) // 用于触发页面刷新的状态
  const [searchValue, setSearchValue] = useState('') // 搜索输入值
  const [searchResults, setSearchResults] = useState<any[]>([]) // 搜索结果
  const [showSearchResults, setShowSearchResults] = useState(false) // 是否显示搜索结果
  const [isFullscreen, setIsFullscreen] = useState(false) // 是否全屏
  const location = useLocation()
  const navigate = useNavigate()
  const prevLocation = useRef(location.pathname)
  const searchRef = useRef<HTMLDivElement>(null) // 搜索容器引用

  // 组件挂载时触发首次进场动画并同步标签页状态
  useEffect(() => {
    // 延迟一点时间，确保组件已经渲染
    const timer = setTimeout(() => {
      setIsAnimating(false)
      
      // 检查当前路径并更新标签页状态
      const currentPath = location.pathname
      const menuItem = findMenuItemByPath(currentPath)
      
      if (menuItem) {
        // 检查标签页是否存在
        const existingTab = tabs.find(tab => tab.key === menuItem.key)
        if (!existingTab) {
          // 添加当前路径对应的标签页
          setTabs(prevTabs => [...prevTabs, { 
            key: menuItem.key, 
            label: menuItem.label, 
            path: menuItem.path 
          }])
        }
        setActiveTabKey(menuItem.key)
      }
    }, 50)
    
    return () => clearTimeout(timer)
  }, [])

  // 同步路由和标签页
  useEffect(() => {
    const currentPath = location.pathname
    
    // 检查路径是否变化
    if (currentPath !== prevLocation.current) {
      // 触发退场动画
      setIsAnimating(true)
      setBreadcrumbAnimating(true)
      
      // 等待退场动画完成后更新状态
      setTimeout(() => {
        // 更新标签页状态
        const menuItem = findMenuItemByPath(currentPath)
        
        if (menuItem) {
          // 检查标签页是否存在
          const existingTab = tabs.find(tab => tab.key === menuItem.key)
          if (!existingTab) {
            // 新增标签页，触发标签页动画
            setTabsAnimating(true)
            setTabs(prevTabs => [...prevTabs, { 
              key: menuItem.key, 
              label: menuItem.label, 
              path: menuItem.path 
            }])
            // 标签页动画结束
            setTimeout(() => {
              setTabsAnimating(false)
            }, 300)
          }
          setActiveTabKey(menuItem.key)
        }
        
        // 触发进场动画
        setTimeout(() => {
          setIsAnimating(false)
          setBreadcrumbAnimating(false)
          prevLocation.current = currentPath
        }, 50)
      }, 300)
    }
  }, [location.pathname])

  // 查找菜单项
  const findMenuItemByPath = (path: string): MenuItem | null => {
    // 解码路径，处理中文路径
    const decodedPath = decodeURIComponent(path)
    
    // 检查固定路径映射
    const pathInfo = pathMap[decodedPath]
    if (pathInfo) {
      return {
        key: pathInfo.key,
        label: pathInfo.title,
        path: decodedPath
      }
    }
    
    // 处理动态标签路径
    if (decodedPath.startsWith('/dynamic-tab/')) {
      // 使用路径作为 key 的一部分，确保相同路径生成相同的 key
      const pathParts = decodedPath.split('/')
      const tabId = pathParts[pathParts.length - 1]
      
      // 尝试从 localStorage 中获取标签标题
      let tabLabel = '动态标签'
      try {
        const savedDynamicTabs = localStorage.getItem('dynamicTabs')
        if (savedDynamicTabs) {
          const dynamicTabs = JSON.parse(savedDynamicTabs)
          const tab = dynamicTabs.find((t: any) => t.path === decodedPath || t.path === path)
          if (tab && tab.label) {
            tabLabel = tab.label
          }
        }
      } catch (error) {
        console.error('Failed to get tab label:', error)
      }
      
      return {
        key: `dynamic-tab-${tabId}`,
        label: tabLabel,
        path: decodedPath
      }
    }
    
    // 处理动态菜单路径（包括用户输入的自定义路径）
    try {
      const savedDynamicMenus = localStorage.getItem('dynamicMenus')
      if (savedDynamicMenus) {
        const dynamicMenus = JSON.parse(savedDynamicMenus)
        // 同时检查编码和解码后的路径
        const menu = dynamicMenus.find((m: any) => m.path === decodedPath || m.path === path)
        if (menu) {
          return {
            key: menu.key,
            label: menu.label,
            path: menu.path
          }
        }
      }
    } catch (error) {
      console.error('Failed to get menu label:', error)
    }
    
    // 处理默认的动态菜单路径格式
    if (decodedPath.startsWith('/dynamic-menu/')) {
      // 使用路径作为 key 的一部分，确保相同路径生成相同的 key
      const pathParts = decodedPath.split('/')
      const menuId = pathParts[pathParts.length - 1]
      
      return {
        key: `dynamic-menu-${menuId}`,
        label: '动态菜单',
        path: decodedPath
      }
    }
    
    return null
  }

  // 触发页面动画
  const triggerPageAnimation = () => {
    // 触发退场动画
    setIsAnimating(true)
    setBreadcrumbAnimating(true)
    setTabsAnimating(true)
    
    // 等待退场动画完成后触发进场动画
    setTimeout(() => {
      setIsAnimating(false)
      setBreadcrumbAnimating(false)
      setTabsAnimating(false)
    }, 300)
  }

  // 搜索函数：根据菜单名、拼音和首字母搜索
  const searchMenus = (keyword: string) => {
    if (!keyword) {
      setSearchResults([])
      return
    }

    const results: any[] = []
    const lowerKeyword = keyword.toLowerCase()

    // 递归搜索菜单项
    const searchRecursive = (items: any[], parentPath: any[] = []) => {
      for (const item of items) {
        // 检查菜单名、拼音和首字母
        if (
          item.label.toLowerCase().includes(lowerKeyword) ||
          (item.pinyin && item.pinyin.includes(lowerKeyword)) ||
          (item.initial && item.initial.toLowerCase().includes(lowerKeyword))
        ) {
          // 构建面包屑路径（包含图标信息）
          const breadcrumbPath = [...parentPath, { 
            label: item.label, 
            icon: item.icon,
            keyword: keyword // 保存搜索关键词用于高亮
          }]
          results.push({
            ...item,
            breadcrumbPath,
            keyword: keyword // 保存搜索关键词用于高亮
          })
        }
        // 搜索子菜单
        if (item.children && item.children.length > 0) {
          searchRecursive(item.children, [...parentPath, { label: item.label, icon: item.icon }])
        }
      }
    }

    // 搜索固定菜单项
    searchRecursive(menuItems)
    
    // 搜索动态菜单
    try {
      const savedDynamicMenus = localStorage.getItem('dynamicMenus')
      if (savedDynamicMenus) {
        const dynamicMenus = JSON.parse(savedDynamicMenus)
        // 为动态菜单添加默认的拼音和首字母（如果没有）
        const dynamicMenusWithSearchInfo = dynamicMenus.map((menu: any) => ({
          ...menu,
          pinyin: menu.label.toLowerCase(), // 简单处理，实际项目中可以使用拼音转换库
          initial: menu.label.charAt(0).toLowerCase() // 取首字母
        }))
        searchRecursive(dynamicMenusWithSearchInfo)
      }
    } catch (error) {
      console.error('Failed to search dynamic menus:', error)
    }
    
    // 注释掉搜索动态标签的代码，因为用户只希望搜索菜单
    // try {
    //   const savedDynamicTabs = localStorage.getItem('dynamicTabs')
    //   if (savedDynamicTabs) {
    //     const dynamicTabs = JSON.parse(savedDynamicTabs)
    //     // 为动态标签添加默认的拼音和首字母（如果没有）
    //     const dynamicTabsWithSearchInfo = dynamicTabs.map((tab: any) => ({
    //       ...tab,
    //       pinyin: tab.label.toLowerCase(), // 简单处理，实际项目中可以使用拼音转换库
    //       initial: tab.label.charAt(0).toLowerCase() // 取首字母
    //     }))
    //     searchRecursive(dynamicTabsWithSearchInfo)
    //   }
    // } catch (error) {
    //   console.error('Failed to search dynamic tabs:', error)
    // }
    
    setSearchResults(results)
  }

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    searchMenus(value)
    setShowSearchResults(value.length > 0)
  }

  // 处理点击搜索结果
  const handleSearchResultClick = (item: any) => {
    navigate(item.path)
    setSearchValue('')
    setSearchResults([])
    setShowSearchResults(false)
  }

  // 根据图标名称返回图标组件
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'DashboardOutlined':
        return <DashboardOutlined className="breadcrumb-icon" />;
      case 'UserOutlined':
        return <UserOutlined className="breadcrumb-icon" />;
      case 'TeamOutlined':
        return <TeamOutlined className="breadcrumb-icon" />;
      case 'MenuOutlined':
        return <MenuOutlined className="breadcrumb-icon" />;
      case 'SettingOutlined':
        return <SettingOutlined className="breadcrumb-icon" />;
      case 'FileOutlined':
        return <FileOutlined className="breadcrumb-icon" />;
      case 'FolderOutlined':
        return <FolderOutlined className="breadcrumb-icon" />;
      case 'PlusCircleOutlined':
        return <PlusCircleOutlined className="breadcrumb-icon" />;
      case 'AppstoreAddOutlined':
        return <AppstoreAddOutlined className="breadcrumb-icon" />;
      default:
        return null;
    }
  }

  // 高亮显示匹配的文字
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;
    
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    const index = lowerText.indexOf(lowerKeyword);
    
    if (index === -1) return text;
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + keyword.length);
    const after = text.substring(index + keyword.length);
    
    return (
      <>
        {before}
        <span className="highlight-text">{match}</span>
        {after}
      </>
    );
  }

  // 处理全局点击事件，关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 处理全屏切换
  const handleFullscreen = () => {
    if (!isFullscreen) {
      // 进入全屏
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        (document.documentElement as any).webkitRequestFullscreen()
      } else if ((document.documentElement as any).msRequestFullscreen) {
        (document.documentElement as any).msRequestFullscreen()
      }
    } else {
      // 退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  // 刷新当前页面
  const handleRefresh = () => {
    // 触发页面动画
    triggerPageAnimation()
    // 改变refreshKey，触发页面重新渲染
    setRefreshKey(prevKey => prevKey + 1)
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <AntLayout>
        <Header className="layout-header">
          <div className="header-left">
            <Button 
              type="text" 
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
              onClick={() => setCollapsed(!collapsed)}
              className="header-menu-button"
            />
            <Breadcrumb animating={breadcrumbAnimating} />
          </div>
          <div className="header-right">
            <Space size="middle">
              <div className="header-search" ref={searchRef}>
                <Input 
                  placeholder="搜索菜单" 
                  suffix={<SearchOutlined />} 
                  className="search-input"
                  value={searchValue}
                  onChange={handleSearchChange}
                />
                {showSearchResults && searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map((item) => (
                      <div 
                        key={item.key} 
                        className="search-result-item"
                        onClick={() => handleSearchResultClick(item)}
                      >
                        <div className="breadcrumb-style">
                          {item.breadcrumbPath.map((crumb: any, index: number) => (
                            <span key={index} className="breadcrumb-item">
                              {getIconComponent(crumb.icon)}
                              {highlightText(crumb.label, item.keyword)}
                              {index < item.breadcrumbPath.length - 1 && (
                                <span className="breadcrumb-separator"> / </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                type="text" 
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} 
                className="header-icon-button"
                onClick={handleFullscreen}
              />
              <Dropdown
                menu={{
                  items: [
                    { label: '退出登录', key: '3', onClick: () => navigate('/login') }
                  ]
                }}
                trigger={['click']}
              >
                <div className="user-info">
                  <Avatar size="small">管</Avatar>
                  <span className="user-name">管理员</span>
                  <DownOutlined />
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content className="layout-content">
          <Tabs 
            tabs={tabs}
            activeTabKey={activeTabKey}
            onTabsChange={setTabs}
            onActiveTabChange={setActiveTabKey}
            onTabClose={triggerPageAnimation}
            onRefresh={handleRefresh}
            animating={tabsAnimating}
          />
          <div className={`page-content ${isAnimating ? 'page-content-animating' : ''}`}>
            <Outlet key={refreshKey} />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout

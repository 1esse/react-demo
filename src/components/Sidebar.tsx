import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Menu, Layout } from 'antd'
import { 
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  MenuOutlined,
  SettingOutlined,
  FileOutlined,
  FolderOutlined,
  PlusCircleOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.scss'

const { Sider } = Layout

interface MenuItem {
  key: string
  label: string
  icon: React.ReactNode
  path?: string
  children?: MenuItem[]
}

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      key: '1',
      label: '首页',
      icon: <DashboardOutlined />,
      path: '/dashboard'
    },
    {
      key: '2',
      label: '用户管理',
      icon: <UserOutlined />,
      path: '/user/list'
    },
    {
      key: '3',
      label: '角色管理',
      icon: <TeamOutlined />,
      path: '/role/list'
    },

    {
      key: '6',
      label: '路由管理',
      icon: <MenuOutlined />,
      children: [
        {
          key: '6-1',
          label: '动态标签',
          icon: <PlusCircleOutlined />,
          path: '/router/dynamic-tab'
        },
        {
          key: '6-2',
          label: '动态菜单',
          icon: <AppstoreAddOutlined />,
          path: '/router/dynamic-menu'
        }
      ]
    },
    {
      key: '5',
      label: '系统设置',
      icon: <SettingOutlined />,
      children: [
        {
          key: '5-1',
          label: '基本设置',
          icon: <FileOutlined />,
          path: '/system/basic'
        },
        {
          key: '5-2',
          label: '高级设置',
          icon: <FolderOutlined />,
          path: '/system/advanced'
        }
      ]
    }
  ])

  // 根据图标名称获取图标组件
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'DashboardOutlined':
        return <DashboardOutlined />;
      case 'UserOutlined':
        return <UserOutlined />;
      case 'TeamOutlined':
        return <TeamOutlined />;
      case 'MenuOutlined':
        return <MenuOutlined />;
      case 'SettingOutlined':
        return <SettingOutlined />;
      case 'FileOutlined':
        return <FileOutlined />;
      case 'FolderOutlined':
        return <FolderOutlined />;
      default:
        return <FileOutlined />;
    }
  }

  // 递归查找父级菜单项
  const findParentMenuItem = (items: MenuItem[], parentPath: string): MenuItem | null => {
    for (const item of items) {
      // 检查菜单项本身的路径
      if (item.path === parentPath) {
        return item
      }
      // 检查菜单项是否有子菜单，且子菜单的路径以父级路径开头
      if (item.children) {
        const hasMatchingChild = item.children.some(child => 
          child.path && child.path.startsWith(parentPath)
        )
        if (hasMatchingChild) {
          return item
        }
        // 递归查找子菜单
        const found = findParentMenuItem(item.children, parentPath)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  // 递归查找菜单项的key
  const findParentMenuKey = (items: MenuItem[], parentPath: string): string | null => {
    for (const item of items) {
      // 检查菜单项本身的路径
      if (item.path === parentPath) {
        return item.key
      }
      // 检查菜单项是否有子菜单，且子菜单的路径以父级路径开头
      if (item.children) {
        const hasMatchingChild = item.children.some(child => 
          child.path && child.path.startsWith(parentPath)
        )
        if (hasMatchingChild) {
          return item.key
        }
        // 递归查找子菜单
        const found = findParentMenuKey(item.children, parentPath)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  // 递归更新菜单项
  const updateMenuItems = (items: MenuItem[], parentKey: string, newMenu: MenuItem): MenuItem[] => {
    return items.map(item => {
      if (item.key === parentKey) {
        // 找到父级菜单，添加子菜单
        return {
          ...item,
          children: [...(item.children || []), newMenu]
        }
      }
      if (item.children) {
        // 递归更新子菜单
        return {
          ...item,
          children: updateMenuItems(item.children, parentKey, newMenu)
        }
      }
      return item
    })
  }

  // 从localStorage加载动态菜单
  useEffect(() => {
    const loadDynamicMenus = () => {
      const savedDynamicMenus = localStorage.getItem('dynamicMenus')
      if (savedDynamicMenus) {
        try {
          const dynamicMenus = JSON.parse(savedDynamicMenus)
          if (dynamicMenus.length > 0) {
            // 为动态菜单添加图标
            const dynamicMenusWithIcons = dynamicMenus.map((menu: any) => {
              return {
                ...menu,
                icon: getIconComponent(menu.icon)
              }
            })
            
            setMenuItems(prevItems => {
              let updatedItems = [...prevItems]
              
              // 过滤掉已存在的动态菜单，避免重复
              const existingKeys = new Set()
              const collectKeys = (items: MenuItem[]) => {
                items.forEach(item => {
                  existingKeys.add(item.key)
                  if (item.children) {
                    collectKeys(item.children)
                  }
                })
              }
              collectKeys(updatedItems)
              
              const newDynamicMenus = dynamicMenusWithIcons.filter((menu: any) => !existingKeys.has(menu.key))
              
              if (newDynamicMenus.length > 0) {
                newDynamicMenus.forEach((menu: any) => {
                  // 解析路径，提取父级路径
                  const pathParts = menu.path.split('/').filter(Boolean)
                  if (pathParts.length >= 2) {
                    // 构建父级路径
                    const parentPath = '/' + pathParts.slice(0, pathParts.length - 1).join('/')
                    
                    // 查找父级菜单的key
                    const parentKey = findParentMenuKey(updatedItems, parentPath)
                    if (parentKey) {
                      // 添加为父级菜单的子菜单
                      updatedItems = updateMenuItems(updatedItems, parentKey, menu)
                    } else {
                      // 如果找不到父级菜单，默认添加到系统设置之前
                      const systemSettingIndex = updatedItems.findIndex(item => item.key === '5')
                      updatedItems.splice(systemSettingIndex, 0, menu)
                    }
                  } else {
                    // 路径层级不足，默认添加到系统设置之前
                    const systemSettingIndex = updatedItems.findIndex(item => item.key === '5')
                    updatedItems.splice(systemSettingIndex, 0, menu)
                  }
                })
              }
              return updatedItems
            })
          }
        } catch (error) {
          console.error('Failed to parse dynamic menus:', error)
        }
      }
    }
    
    // 初始加载
    loadDynamicMenus()
    
    // 监听localStorage变化
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'dynamicMenus') {
        loadDynamicMenus()
      }
    }
    
    // 监听window.postMessage消息
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'DYNAMIC_MENU_UPDATED') {
        loadDynamicMenus()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  // 生成菜单项
  const generateMenuItems = useCallback((items: MenuItem[]): any[] => {
    return items.map(item => {
      const menuItem: any = {
        key: item.key,
        icon: item.icon,
        label: item.label
      }
      
      if (item.children) {
        menuItem.children = generateMenuItems(item.children)
      }
      
      return menuItem
    })
  }, [])

  // 缓存生成的菜单项
  const menuItemsMemo = useMemo(() => generateMenuItems(menuItems), [menuItems, generateMenuItems])

  // 处理菜单点击
  const handleMenuClick = (e: any) => {
    const menuItem = findMenuItemByKey(menuItems, e.key)
    if (menuItem && menuItem.path) {
      navigate(menuItem.path)
    }
  }

  // 递归查找菜单项
  const findMenuItemByKey = (items: MenuItem[], key: string): MenuItem | null => {
    for (const item of items) {
      if (item.key === key) {
        return item
      }
      if (item.children) {
        const found = findMenuItemByKey(item.children, key)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  // 查找当前路径对应的菜单 key
  const findCurrentMenuKey = (items: MenuItem[], path: string): string => {
    // 解码路径，处理中文路径
    const decodedPath = decodeURIComponent(path)
    
    // 首先检查所有菜单项，包括动态添加的菜单项
    for (const item of items) {
      if (item.path === decodedPath || item.path === path) {
        return item.key
      }
      if (item.children) {
        // 在子菜单中查找
        const foundKey = findCurrentMenuKeyRecursive(item.children, path)
        if (foundKey) {
          return foundKey
        }
      }
    }
    
    // 处理动态菜单路径
    try {
      const savedDynamicMenus = localStorage.getItem('dynamicMenus')
      if (savedDynamicMenus) {
        const dynamicMenus = JSON.parse(savedDynamicMenus)
        // 同时检查编码和解码后的路径
        const menu = dynamicMenus.find((m: any) => m.path === decodedPath || m.path === path)
        if (menu && menu.key) {
          return menu.key
        }
      }
    } catch (error) {
      console.error('Failed to get dynamic menu key:', error)
    }
    
    return '1' // 默认选中仪表盘
  }

  // 查找当前路径对应的所有父菜单 key
  const findOpenKeys = (items: MenuItem[], path: string, parentKeys: string[] = []): string[] => {
    // 解码路径，处理中文路径
    const decodedPath = decodeURIComponent(path)
    
    const findRecursive = (currentItems: MenuItem[], currentPath: string, keys: string[]): string[] => {
      for (const item of currentItems) {
        if (item.path === decodedPath || item.path === currentPath) {
          return keys
        }
        if (item.children) {
          const found = findRecursive(item.children, currentPath, [...keys, item.key])
          if (found.length > 0) {
            return found
          }
        }
      }
      return []
    }
    
    return findRecursive(items, path, parentKeys)
  }

  // 递归查找菜单 key（不返回默认值）
  const findCurrentMenuKeyRecursive = (items: MenuItem[], path: string): string | null => {
    // 解码路径，处理中文路径
    const decodedPath = decodeURIComponent(path)
    
    for (const item of items) {
      if (item.path === decodedPath || item.path === path) {
        return item.key
      }
      if (item.children) {
        const foundKey = findCurrentMenuKeyRecursive(item.children, path)
        if (foundKey) {
          return foundKey
        }
      }
    }
    return null
  }

  // 处理遮罩层点击
  const handleOverlayClick = () => {
    onCollapse(true)
  }

  // 计算当前选中的菜单 key
  const currentSelectedKey = findCurrentMenuKey(menuItems, location.pathname)
  
  // 计算当前需要展开的菜单 key
  const currentOpenKeys = useMemo(() => {
    return findOpenKeys(menuItems, location.pathname)
  }, [menuItems, location.pathname])
  
  // 组件初始化时更新 openKeys
  useEffect(() => {
    setOpenKeys(currentOpenKeys)
  }, [currentOpenKeys])
  
  return (
    <>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        onCollapse={onCollapse}
        className={`sidebar ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      >
        <div className="logo">
          {collapsed ? (
            <div className="logo-text">
              <div>clown</div>
              <div>fish</div>
            </div>
          ) : (
            <img 
              src="https://1esse.github.io/vue-clownfish-admin/assets/logo-c960c9f9.png" 
              alt="Clownfish Admin" 
              className="logo-image"
            />
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          selectedKeys={[currentSelectedKey]}
          items={menuItemsMemo}
          onClick={handleMenuClick}
        />
      </Sider>
      {/* 遮罩层 */}
      <div 
        className={`sidebar-overlay ${!collapsed ? 'sidebar-overlay-visible' : ''}`}
        onClick={handleOverlayClick}
      />
    </>
  )
}

export default Sidebar

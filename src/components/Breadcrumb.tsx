import { Breadcrumb as AntBreadcrumb } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  MenuOutlined,
  FileOutlined,
  FolderOutlined,
  SettingOutlined
} from '@ant-design/icons'
import './Breadcrumb.scss'

// 路径映射配置
const pathMap: Record<string, { title: string, icon: React.ReactNode }> = {
  '/dashboard': { title: '首页', icon: <DashboardOutlined /> },
  '/user/list': { title: '用户管理', icon: <UserOutlined /> },
  '/role/list': { title: '角色管理', icon: <TeamOutlined /> },
  '/menu/list': { title: '菜单管理', icon: <MenuOutlined /> },
  '/router/dynamic-tab': { title: '动态标签', icon: <FileOutlined /> },
  '/router/dynamic-menu': { title: '动态菜单', icon: <FolderOutlined /> },
  '/system/basic': { title: '基本设置', icon: <FileOutlined /> },
  '/system/advanced': { title: '高级设置', icon: <FolderOutlined /> }
}

interface BreadcrumbProps {
  animating?: boolean
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ animating = false }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // 使用共享的路径映射配置

  // 生成面包屑项
  const getBreadcrumbItems = () => {
    const path = location.pathname
    const items = []
    
    // 特殊处理系统设置的子路径
    if (path.startsWith('/system/')) {
      // 添加系统设置
      items.push({
        title: (
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/system/basic')}>
            <span className="breadcrumb-icon"><SettingOutlined /></span>
            <span>系统设置</span>
          </span>
        )
      })
      
      // 添加子项
      const pathInfo = pathMap[path]
      if (pathInfo) {
        items.push({
          title: (
            <span className="breadcrumb-active">
              <span className="breadcrumb-icon">{pathInfo.icon}</span>
              <span>{pathInfo.title}</span>
            </span>
          )
        })
      }
    } else if (path.startsWith('/router/')) {
      // 特殊处理路由管理的子路径
      // 添加路由管理
      items.push({
        title: (
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/router/dynamic-tab')}>
            <span className="breadcrumb-icon"><MenuOutlined /></span>
            <span>路由管理</span>
          </span>
        )
      })
      
      // 添加子项
      const pathInfo = pathMap[path]
      if (pathInfo) {
        items.push({
          title: (
            <span className="breadcrumb-active">
              <span className="breadcrumb-icon">{pathInfo.icon}</span>
              <span>{pathInfo.title}</span>
            </span>
          )
        })
      }
    } else if (path.startsWith('/dynamic-tab/')) {
      // 特殊处理动态标签路径
      items.push({
        title: (
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/router/dynamic-tab')}>
            <span className="breadcrumb-icon"><MenuOutlined /></span>
            <span>路由管理</span>
          </span>
        )
      })
      items.push({
        title: (
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/router/dynamic-tab')}>
            <span className="breadcrumb-icon"><FileOutlined /></span>
            <span>动态标签</span>
          </span>
        )
      })
      items.push({
        title: (
          <span className="breadcrumb-active">
            <span className="breadcrumb-icon"><FileOutlined /></span>
            <span>标签详情</span>
          </span>
        )
      })
    } else if (path.startsWith('/dynamic-menu/')) {
      // 特殊处理动态菜单路径
      items.push({
        title: (
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/router/dynamic-menu')}>
            <span className="breadcrumb-icon"><MenuOutlined /></span>
            <span>路由管理</span>
          </span>
        )
      })
      items.push({
        title: (
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/router/dynamic-menu')}>
            <span className="breadcrumb-icon"><FolderOutlined /></span>
            <span>动态菜单</span>
          </span>
        )
      })
      items.push({
        title: (
          <span className="breadcrumb-active">
            <span className="breadcrumb-icon"><FolderOutlined /></span>
            <span>菜单详情</span>
          </span>
        )
      })
    } else {
      // 直接查找完整路径
      const pathInfo = pathMap[path]
      if (pathInfo) {
        items.push({
          title: (
            <span className="breadcrumb-active">
              <span className="breadcrumb-icon">{pathInfo.icon}</span>
              <span>{pathInfo.title}</span>
            </span>
          )
        })
      } else {
        // 如果找不到完整路径，显示默认首页
        const defaultPathInfo = pathMap['/dashboard']
        items.push({
          title: (
            <span className="breadcrumb-active">
              <span className="breadcrumb-icon">{defaultPathInfo.icon}</span>
              <span>{defaultPathInfo.title}</span>
            </span>
          )
        })
      }
    }

    return items
  }

  return (
    <div className={`breadcrumb-container ${animating ? 'breadcrumb-animating' : ''}`}>
      <AntBreadcrumb items={getBreadcrumbItems()} />
    </div>
  )
}

export default Breadcrumb

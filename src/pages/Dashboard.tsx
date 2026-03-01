import { Card, Statistic, Row, Col, Avatar, Tag, Progress } from 'antd'
import { 
  UserOutlined, 
  TeamOutlined, 
  MenuOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons'
import './Dashboard.scss'

const Dashboard = () => {
  const statistics = [
    {
      title: '用户总数',
      value: 1234,
      icon: <UserOutlined />,
      color: '#1890ff'
    },
    {
      title: '角色总数',
      value: 56,
      icon: <TeamOutlined />,
      color: '#52c41a'
    },
    {
      title: '菜单总数',
      value: 78,
      icon: <MenuOutlined />,
      color: '#faad14'
    },
    {
      title: '今日登录',
      value: 89,
      icon: <CheckCircleOutlined />,
      color: '#f5222d'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      user: '张三',
      action: '登录系统',
      time: '2分钟前',
      status: 'success'
    },
    {
      id: 2,
      user: '李四',
      action: '修改用户信息',
      time: '15分钟前',
      status: 'success'
    },
    {
      id: 3,
      user: '王五',
      action: '创建新角色',
      time: '30分钟前',
      status: 'success'
    },
    {
      id: 4,
      user: '赵六',
      action: '删除菜单',
      time: '1小时前',
      status: 'error'
    }
  ]

  const systemStatus = [
    { name: 'CPU 使用率', value: 30, color: '#1890ff' },
    { name: '内存使用率', value: 45, color: '#52c41a' },
    { name: '磁盘使用率', value: 60, color: '#faad14' },
    { name: '网络带宽', value: 75, color: '#722ed1' }
  ]

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">仪表盘</h2>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {statistics.map((item, index) => (
          <Col span={6} key={index}>
            <Card hoverable className="stat-card">
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.icon}
                styles={{ content: { color: item.color } }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        {/* 最近活动 */}
        <Col span={12}>
          <Card title="最近活动" className="activity-card">
            <div className="activity-list">
              {recentActivities.map(item => (
                <div key={item.id} className="activity-item">
                  <div className="activity-avatar">
                    <Avatar>{item.user.charAt(0)}</Avatar>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      <span>{item.user}</span>
                      <span style={{ margin: '0 8px' }}>·</span>
                      <span>{item.action}</span>
                    </div>
                    <div className="activity-description">
                      <ClockCircleOutlined style={{ marginRight: 4, fontSize: 12 }} />
                      <span>{item.time}</span>
                      <Tag 
                        color={item.status === 'success' ? 'green' : 'red'} 
                        style={{ marginLeft: 16 }}
                      >
                        {item.status === 'success' ? '成功' : '失败'}
                      </Tag>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        
        {/* 系统状态 */}
        <Col span={12}>
          <Card title="系统状态" className="status-card">
            <div className="system-status">
              {systemStatus.map((item, index) => (
                <div className="status-item" key={index}>
                  <div className="status-header">
                    <span className="status-label">{item.name}</span>
                    <span className="status-value">{item.value}%</span>
                  </div>
                  <Progress 
                    percent={item.value} 
                    strokeColor={item.color} 
                    size="small" 
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 数据概览 */}
        <Col span={8}>
          <Card title="数据概览" className="chart-card">
            <div className="chart-placeholder">
              <BarChartOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <p>数据图表</p>
            </div>
          </Card>
        </Col>
        
        {/* 用户分布 */}
        <Col span={8}>
          <Card title="用户分布" className="chart-card">
            <div className="chart-placeholder">
              <PieChartOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
              <p>用户分布图表</p>
            </div>
          </Card>
        </Col>
        
        {/* 趋势分析 */}
        <Col span={8}>
          <Card title="趋势分析" className="chart-card">
            <div className="chart-placeholder">
              <LineChartOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
              <p>趋势分析图表</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

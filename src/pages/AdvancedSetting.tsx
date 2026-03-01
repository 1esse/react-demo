import React, { useState } from 'react'
import { Form, Input, Select, Switch, Button, message, InputNumber } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import './AdvancedSetting.scss'

const AdvancedSetting: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 模拟初始数据
  const initialValues = {
    // 服务器设置
    serverPort: 3000,
    serverHost: '0.0.0.0',
    maxUploadSize: 10,
    // 数据库设置
    dbType: 'mysql',
    dbHost: 'localhost',
    dbPort: 3306,
    dbName: 'clownfish_admin',
    dbUsername: 'root',
    dbPassword: '123456',
    // 缓存设置
    cacheType: 'redis',
    redisHost: 'localhost',
    redisPort: 6379,
    redisPassword: '',
    redisDb: 0,
    // 安全设置
    enableHttps: false,
    enableCors: true,
    jwtSecret: 'clownfish_admin_secret',
    jwtExpire: 24,
    // 日志设置
    logLevel: 'info',
    logPath: './logs',
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true)
      // 模拟保存操作
      setTimeout(() => {
        console.log('保存高级设置:', values)
        message.success('高级设置保存成功')
        setLoading(false)
      }, 1000)
    })
  }

  return (
    <div className="advanced-setting">
      <div className="advanced-setting-header">
        <h1>高级设置</h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <div className="setting-section">
          <h2>服务器设置</h2>
          <div className="setting-form">
            <Form.Item
              name="serverPort"
              label="服务器端口"
              rules={[{ required: true, message: '请输入服务器端口' }]}
            >
              <InputNumber min={1} max={65535} />
            </Form.Item>
            <Form.Item
              name="serverHost"
              label="服务器主机"
              rules={[{ required: true, message: '请输入服务器主机' }]}
            >
              <Input placeholder="请输入服务器主机" />
            </Form.Item>
            <Form.Item
              name="maxUploadSize"
              label="最大上传大小 (MB)"
              rules={[{ required: true, message: '请输入最大上传大小' }]}
            >
              <InputNumber min={1} max={1000} />
            </Form.Item>
          </div>
        </div>

        <div className="setting-section">
          <h2>数据库设置</h2>
          <div className="setting-form">
            <Form.Item
              name="dbType"
              label="数据库类型"
              rules={[{ required: true, message: '请选择数据库类型' }]}
            >
              <Select>
                <Select.Option value="mysql">MySQL</Select.Option>
                <Select.Option value="postgres">PostgreSQL</Select.Option>
                <Select.Option value="sqlite">SQLite</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="dbHost"
              label="数据库主机"
              rules={[{ required: true, message: '请输入数据库主机' }]}
            >
              <Input placeholder="请输入数据库主机" />
            </Form.Item>
            <Form.Item
              name="dbPort"
              label="数据库端口"
              rules={[{ required: true, message: '请输入数据库端口' }]}
            >
              <InputNumber min={1} max={65535} />
            </Form.Item>
            <Form.Item
              name="dbName"
              label="数据库名称"
              rules={[{ required: true, message: '请输入数据库名称' }]}
            >
              <Input placeholder="请输入数据库名称" />
            </Form.Item>
            <Form.Item
              name="dbUsername"
              label="数据库用户名"
              rules={[{ required: true, message: '请输入数据库用户名' }]}
            >
              <Input placeholder="请输入数据库用户名" />
            </Form.Item>
            <Form.Item
              name="dbPassword"
              label="数据库密码"
            >
              <Input.Password placeholder="请输入数据库密码" />
            </Form.Item>
          </div>
        </div>

        <div className="setting-section">
          <h2>缓存设置</h2>
          <div className="setting-form">
            <Form.Item
              name="cacheType"
              label="缓存类型"
              rules={[{ required: true, message: '请选择缓存类型' }]}
            >
              <Select>
                <Select.Option value="redis">Redis</Select.Option>
                <Select.Option value="memory">内存</Select.Option>
                <Select.Option value="file">文件</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="redisHost"
              label="Redis主机"
              rules={[{ required: true, message: '请输入Redis主机' }]}
            >
              <Input placeholder="请输入Redis主机" />
            </Form.Item>
            <Form.Item
              name="redisPort"
              label="Redis端口"
              rules={[{ required: true, message: '请输入Redis端口' }]}
            >
              <InputNumber min={1} max={65535} />
            </Form.Item>
            <Form.Item
              name="redisPassword"
              label="Redis密码"
            >
              <Input.Password placeholder="请输入Redis密码" />
            </Form.Item>
            <Form.Item
              name="redisDb"
              label="Redis数据库"
              rules={[{ required: true, message: '请输入Redis数据库' }]}
            >
              <InputNumber min={0} max={15} />
            </Form.Item>
          </div>
        </div>

        <div className="setting-section">
          <h2>安全设置</h2>
          <div className="setting-form">
            <Form.Item
              name="enableHttps"
              label="启用HTTPS"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="enableCors"
              label="启用CORS"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="jwtSecret"
              label="JWT密钥"
              rules={[{ required: true, message: '请输入JWT密钥' }]}
            >
              <Input.Password placeholder="请输入JWT密钥" />
            </Form.Item>
            <Form.Item
              name="jwtExpire"
              label="JWT过期时间 (小时)"
              rules={[{ required: true, message: '请输入JWT过期时间' }]}
            >
              <InputNumber min={1} max={168} />
            </Form.Item>
          </div>
        </div>

        <div className="setting-section">
          <h2>日志设置</h2>
          <div className="setting-form">
            <Form.Item
              name="logLevel"
              label="日志级别"
              rules={[{ required: true, message: '请选择日志级别' }]}
            >
              <Select>
                <Select.Option value="debug">Debug</Select.Option>
                <Select.Option value="info">Info</Select.Option>
                <Select.Option value="warn">Warn</Select.Option>
                <Select.Option value="error">Error</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="logPath"
              label="日志路径"
              rules={[{ required: true, message: '请输入日志路径' }]}
            >
              <Input placeholder="请输入日志路径" />
            </Form.Item>
          </div>
        </div>

        <div className="setting-actions">
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSubmit}
            loading={loading}
          >
            保存设置
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AdvancedSetting
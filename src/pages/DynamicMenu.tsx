import React, { useState } from 'react'
import { Form, Input, Button, message, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './DynamicMenu.scss'

const DynamicMenu: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()



  const handleSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true)
      // 模拟创建动态菜单
      setTimeout(() => {
        console.log('创建动态菜单:', values)
        
        // 规范化路径：确保以/开头
        const normalizedPath = values.path.startsWith('/') ? values.path : '/' + values.path
        
        // 生成唯一的时间戳
        const timestamp = Date.now()
        
        // 保存动态菜单到 localStorage
        const newMenu = {
          key: `dynamic-menu-${timestamp}`,
          label: values.title,
          icon: values.icon, // 保存图标名称，而不是图标组件
          path: normalizedPath // 使用规范化后的路径
        }
        
        // 从 localStorage 获取现有动态菜单
        const savedDynamicMenus = localStorage.getItem('dynamicMenus')
        const dynamicMenus = savedDynamicMenus ? JSON.parse(savedDynamicMenus) : []
        
        // 添加新菜单
        dynamicMenus.push(newMenu)
        
        // 保存回 localStorage
        localStorage.setItem('dynamicMenus', JSON.stringify(dynamicMenus))
        
        // 通知 Sidebar 组件更新
        window.postMessage({ type: 'DYNAMIC_MENU_UPDATED' }, '*')
        
        message.success('动态菜单创建成功')
        setLoading(false)
        
        // 跳转到新创建的菜单页
        // 对路径进行编码，确保中文路径能正确跳转
        const encodedPath = encodeURI(normalizedPath)
        navigate(encodedPath, {
          state: {
            title: values.title,
            path: normalizedPath // 保存规范化后的路径
          }
        })
      }, 1000)
    })
  }

  return (
    <div className="dynamic-menu">
      <div className="dynamic-menu-header">
        <h1>动态菜单</h1>
      </div>
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="菜单标题"
          rules={[{ required: true, message: '请输入菜单标题' }]}
        >
          <Input placeholder="请输入菜单标题" />
        </Form.Item>
        <Form.Item
          name="path"
          label="菜单路径"
          rules={[{ required: true, message: '请输入菜单路径' }]}
        >
          <Input placeholder="请输入菜单路径" />
        </Form.Item>
        <Form.Item
          name="icon"
          label="菜单图标"
          rules={[{ required: true, message: '请选择菜单图标' }]}
        >
          <Select placeholder="选择菜单图标">
            <Select.Option value="DashboardOutlined">DashboardOutlined</Select.Option>
            <Select.Option value="UserOutlined">UserOutlined</Select.Option>
            <Select.Option value="TeamOutlined">TeamOutlined</Select.Option>
            <Select.Option value="MenuOutlined">MenuOutlined</Select.Option>
            <Select.Option value="SettingOutlined">SettingOutlined</Select.Option>
            <Select.Option value="FileOutlined">FileOutlined</Select.Option>
            <Select.Option value="FolderOutlined">FolderOutlined</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleSubmit}
            loading={loading}
          >
            新增菜单
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default DynamicMenu
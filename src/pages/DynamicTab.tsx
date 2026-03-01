import React, { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './DynamicTab.scss'

const DynamicTab: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true)
      // 模拟创建动态标签
      setTimeout(() => {
        console.log('创建动态标签:', values)
        
        // 生成唯一的时间戳
        const timestamp = Date.now()
        
        // 保存动态标签到localStorage
        const newTab = {
          key: `dynamic-tab-${timestamp}`,
          label: values.title,
          path: `/dynamic-tab/${timestamp}`,
          content: values.content
        }
        
        // 从localStorage获取现有动态标签
        const savedDynamicTabs = localStorage.getItem('dynamicTabs')
        const dynamicTabs = savedDynamicTabs ? JSON.parse(savedDynamicTabs) : []
        
        // 添加新标签
        dynamicTabs.push(newTab)
        
        // 保存回localStorage
        localStorage.setItem('dynamicTabs', JSON.stringify(dynamicTabs))
        
        message.success('动态标签创建成功')
        setLoading(false)
        // 跳转到新创建的标签页
        navigate(`/dynamic-tab/${timestamp}`, {
          state: {
            title: values.title,
            content: values.content
          }
        })
      }, 1000)
    })
  }

  return (
    <div className="dynamic-tab">
      <div className="dynamic-tab-header">
        <h1>动态标签</h1>
      </div>
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="标签标题"
          rules={[{ required: true, message: '请输入标签标题' }]}
        >
          <Input placeholder="请输入标签标题" />
        </Form.Item>
        <Form.Item
          name="content"
          label="标签内容"
          rules={[{ required: true, message: '请输入标签内容' }]}
        >
          <Input.TextArea placeholder="请输入标签内容" rows={4} />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleSubmit}
            loading={loading}
          >
            新增标签
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default DynamicTab
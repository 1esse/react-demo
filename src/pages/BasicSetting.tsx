import React, { useState } from 'react'
import { Form, Input, Select, Switch, Button, message, Upload } from 'antd'
import { SaveOutlined, UploadOutlined } from '@ant-design/icons'
import './BasicSetting.scss'

const BasicSetting: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 模拟初始数据
  const initialValues = {
    siteName: 'Clownfish Admin',
    siteTitle: 'Clownfish Admin - 管理系统',
    siteDescription: '一个基于 React 和 Ant Design 的管理系统',
    siteKeywords: 'React, Ant Design, 管理系统',
    siteLogo: '',
    siteFavicon: '',
    enableRegistration: true,
    enableCaptcha: true,
    theme: 'light',
    language: 'zh-CN',
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true)
      // 模拟保存操作
      setTimeout(() => {
        console.log('保存基本设置:', values)
        message.success('基本设置保存成功')
        setLoading(false)
      }, 1000)
    })
  }

  const handleUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`)
    }
  }

  return (
    <div className="basic-setting">
      <div className="basic-setting-header">
        <h1>基本设置</h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <div className="setting-section">
          <h2>网站信息</h2>
          <div className="setting-form">
            <Form.Item
              name="siteName"
              label="网站名称"
              rules={[{ required: true, message: '请输入网站名称' }]}
            >
              <Input placeholder="请输入网站名称" />
            </Form.Item>
            <Form.Item
              name="siteTitle"
              label="网站标题"
              rules={[{ required: true, message: '请输入网站标题' }]}
            >
              <Input placeholder="请输入网站标题" />
            </Form.Item>
            <Form.Item
              name="siteDescription"
              label="网站描述"
            >
              <Input.TextArea placeholder="请输入网站描述" rows={4} />
            </Form.Item>
            <Form.Item
              name="siteKeywords"
              label="网站关键词"
            >
              <Input placeholder="请输入网站关键词，多个关键词用逗号分隔" />
            </Form.Item>
          </div>
        </div>

        <div className="setting-section">
          <h2>网站图标</h2>
          <div className="setting-form">
            <Form.Item
              name="siteLogo"
              label="网站Logo"
              valuePropName="fileList"
            >
              <Upload
                name="logo"
                action="/api/upload"
                onChange={handleUpload}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>上传Logo</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="siteFavicon"
              label="网站Favicon"
              valuePropName="fileList"
            >
              <Upload
                name="favicon"
                action="/api/upload"
                onChange={handleUpload}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>上传Favicon</Button>
              </Upload>
            </Form.Item>
          </div>
        </div>

        <div className="setting-section">
          <h2>系统设置</h2>
          <div className="setting-form">
            <Form.Item
              name="enableRegistration"
              label="启用注册"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="enableCaptcha"
              label="启用验证码"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="theme"
              label="主题"
              rules={[{ required: true, message: '请选择主题' }]}
            >
              <Select>
                <Select.Option value="light">浅色主题</Select.Option>
                <Select.Option value="dark">深色主题</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="language"
              label="语言"
              rules={[{ required: true, message: '请选择语言' }]}
            >
              <Select>
                <Select.Option value="zh-CN">简体中文</Select.Option>
                <Select.Option value="en-US">English</Select.Option>
              </Select>
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

export default BasicSetting
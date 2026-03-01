import { useState } from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './Login.scss'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = (_: any) => {
    setLoading(true)
    // 模拟登录请求
    setTimeout(() => {
      setLoading(false)
      message.success('登录成功')
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2 className="login-title">Clownfish Admin</h2>
          <p className="login-subtitle">欢迎登录</p>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              placeholder="用户名" 
              prefix={<UserOutlined />}
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              placeholder="密码" 
              prefix={<LockOutlined />}
            />
          </Form.Item>
          
          <div className="login-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <a href="#" className="forgot-password">忘记密码？</a>
          </div>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              className="login-button"
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login

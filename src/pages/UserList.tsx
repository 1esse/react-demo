import { useState } from 'react'
import { Table, Button, Space, Input, Modal, Form, message, Select } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import './UserList.scss'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: '张三', email: 'zhangsan@example.com', role: '管理员', status: '活跃' },
    { id: '2', name: '李四', email: 'lisi@example.com', role: '普通用户', status: '活跃' },
    { id: '3', name: '王五', email: 'wangwu@example.com', role: '普通用户', status: '禁用' },
  ])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()
  const [searchValue, setSearchValue] = useState('')

  const showModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      form.setFieldsValue(user)
    } else {
      setEditingUser(null)
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingUser(null)
    form.resetFields()
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // 编辑用户
        setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...values } : user))
        message.success('用户信息更新成功')
      } else {
        // 新增用户
        const newUser: User = {
          id: Date.now().toString(),
          ...values,
          status: '活跃'
        }
        setUsers([...users, newUser])
        message.success('用户添加成功')
      }
      setIsModalVisible(false)
      form.resetFields()
      setEditingUser(null)
    })
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      onOk: () => {
        setUsers(users.filter(user => user.id !== id))
        message.success('用户删除成功')
      }
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchValue.toLowerCase()
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.status.toLowerCase().includes(searchLower)
    )
  })

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={status === '活跃' ? 'status-active' : 'status-inactive'}>
          {status}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h1>用户管理</h1>
        <Space>
          <Input 
            placeholder="搜索用户" 
            suffix={<SearchOutlined />} 
            className="search-input"
            style={{ width: 200 }}
            value={searchValue}
            onChange={handleSearch}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            新增用户
          </Button>
        </Space>
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredUsers} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              <Select.Option value="管理员">管理员</Select.Option>
              <Select.Option value="普通用户">普通用户</Select.Option>
            </Select>
          </Form.Item>
          {editingUser && (
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select>
                <Select.Option value="活跃">活跃</Select.Option>
                <Select.Option value="禁用">禁用</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default UserList

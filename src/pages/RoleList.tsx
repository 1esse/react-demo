import { useState } from 'react'
import { Table, Button, Space, Input, Modal, Form, message, Checkbox, Select } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import './RoleList.scss'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  status: string
}

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: '管理员', description: '拥有所有权限', permissions: ['user:manage', 'role:manage', 'menu:manage', 'system:manage'], status: '活跃' },
    { id: '2', name: '普通用户', description: '拥有基本权限', permissions: [], status: '活跃' },
  ])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [form] = Form.useForm()
  const [searchValue, setSearchValue] = useState('')

  const showModal = (role?: Role) => {
    if (role) {
      setEditingRole(role)
      form.setFieldsValue(role)
    } else {
      setEditingRole(null)
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingRole(null)
    form.resetFields()
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingRole) {
        // 编辑角色
        setRoles(roles.map(role => role.id === editingRole.id ? { ...role, ...values } : role))
        message.success('角色信息更新成功')
      } else {
        // 新增角色
        const newRole: Role = {
          id: Date.now().toString(),
          ...values,
          permissions: values.permissions || [],
          status: '活跃'
        }
        setRoles([...roles, newRole])
        message.success('角色添加成功')
      }
      setIsModalVisible(false)
      form.resetFields()
      setEditingRole(null)
    })
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个角色吗？',
      onOk: () => {
        setRoles(roles.filter(role => role.id !== id))
        message.success('角色删除成功')
      }
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const filteredRoles = roles.filter(role => {
    const searchLower = searchValue.toLowerCase()
    return (
      role.name.toLowerCase().includes(searchLower) ||
      role.description.toLowerCase().includes(searchLower) ||
      role.permissions.some(permission => permission.toLowerCase().includes(searchLower)) ||
      role.status.toLowerCase().includes(searchLower)
    )
  })

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <span>
          {permissions.length > 0 ? permissions.join(', ') : '无'}
        </span>
      ),
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
      render: (_: any, record: Role) => (
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

  const permissions = [
    { label: '用户管理', value: 'user:manage' },
    { label: '角色管理', value: 'role:manage' },
    { label: '菜单管理', value: 'menu:manage' },
    { label: '系统设置', value: 'system:manage' },
  ]

  return (
    <div className="role-list">
      <div className="role-list-header">
        <h1>角色管理</h1>
        <Space>
          <Input 
            placeholder="搜索角色" 
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
            新增角色
          </Button>
        </Space>
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredRoles} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限"
          >
            <Checkbox.Group options={permissions} />
          </Form.Item>
          {editingRole && (
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

export default RoleList

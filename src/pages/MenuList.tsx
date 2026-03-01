import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import './MenuList.scss'

interface MenuItem {
  id: number
  name: string
  path: string
  icon: string
  parentId: number | null
  order: number
  status: number
}

const MenuList: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null)
  const [deleteMenuId, setDeleteMenuId] = useState<number | null>(null)
  const [form] = Form.useForm()

  // 模拟数据
  useEffect(() => {
    const mockData: MenuItem[] = [
      { id: 1, name: '首页', path: '/dashboard', icon: 'DashboardOutlined', parentId: null, order: 1, status: 1 },
      { id: 2, name: '用户管理', path: '/user/list', icon: 'UserOutlined', parentId: null, order: 2, status: 1 },
      { id: 3, name: '角色管理', path: '/role/list', icon: 'TeamOutlined', parentId: null, order: 3, status: 1 },
      { id: 4, name: '菜单管理', path: '/menu/list', icon: 'MenuOutlined', parentId: null, order: 4, status: 1 },
      { id: 5, name: '系统设置', path: '/system', icon: 'SettingOutlined', parentId: null, order: 5, status: 1 },
      { id: 6, name: '基本设置', path: '/system/basic', icon: 'FileOutlined', parentId: 5, order: 1, status: 1 },
      { id: 7, name: '高级设置', path: '/system/advanced', icon: 'FolderOutlined', parentId: 5, order: 2, status: 1 },
    ]
    setMenuData(mockData)
  }, [])

  const showAddModal = () => {
    form.resetFields()
    setEditingMenu(null)
    setIsModalOpen(true)
  }

  const showEditModal = (menu: MenuItem) => {
    setEditingMenu(menu)
    form.setFieldsValue(menu)
    setIsModalOpen(true)
  }

  const showDeleteModal = (id: number) => {
    setDeleteMenuId(id)
    setIsDeleteModalOpen(true)
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingMenu) {
        // 编辑
        const updatedData = menuData.map(item => 
          item.id === editingMenu.id ? { ...item, ...values } : item
        )
        setMenuData(updatedData)
        message.success('菜单编辑成功')
      } else {
        // 添加
        const newMenu: MenuItem = {
          ...values,
          id: menuData.length + 1,
        }
        setMenuData([...menuData, newMenu])
        message.success('菜单添加成功')
      }
      setIsModalOpen(false)
    })
  }

  const handleDelete = () => {
    if (deleteMenuId) {
      const updatedData = menuData.filter(item => item.id !== deleteMenuId)
      setMenuData(updatedData)
      message.success('菜单删除成功')
      setIsDeleteModalOpen(false)
    }
  }

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: '父菜单',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId: number | null) => {
        if (parentId === null) return '无'
        const parentMenu = menuData.find(item => item.id === parentId)
        return parentMenu ? parentMenu.name : '未知'
      },
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => status === 1 ? '启用' : '禁用',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MenuItem) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => showDeleteModal(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="menu-list">
      <div className="menu-list-header">
        <h1>菜单管理</h1>
        <Space>
          <Input 
            placeholder="搜索菜单" 
            suffix={<SearchOutlined />} 
            className="search-input"
            style={{ width: 200 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
          >
            添加菜单
          </Button>
        </Space>
      </div>
      <Table 
        columns={columns} 
        dataSource={menuData} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingMenu ? '编辑菜单' : '添加菜单'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form 
          form={form} 
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="path"
            label="路径"
            rules={[{ required: true, message: '请输入路径' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="icon"
            label="图标"
            rules={[{ required: true, message: '请输入图标' }]}
          >
            <Input placeholder="例如：DashboardOutlined" />
          </Form.Item>
          <Form.Item
            name="parentId"
            label="父菜单"
          >
            <Select placeholder="选择父菜单">
              <Select.Option value={null}>无</Select.Option>
              {menuData.map(menu => (
                <Select.Option key={menu.id} value={menu.id}>
                  {menu.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="order"
            label="排序"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="确认删除"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>确定要删除该菜单吗？</p>
      </Modal>
    </div>
  )
}

export default MenuList
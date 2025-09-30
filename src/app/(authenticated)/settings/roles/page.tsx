'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Plus, Edit, Trash2, Users, Check, X, MoreHorizontal, Crown, User, BookOpen, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Permission {
  id: string
  name: string
  description: string
  category: string
  critical?: boolean
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  color: string
  userCount: number
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
}

const permissions: Permission[] = [
  // Student Management
  { id: 'student.create', name: 'Create Student', description: 'Create new student records', category: 'Student Management' },
  { id: 'student.read', name: 'View Students', description: 'View student information', category: 'Student Management' },
  { id: 'student.update', name: 'Update Student', description: 'Edit student information', category: 'Student Management' },
  { id: 'student.delete', name: 'Delete Student', description: 'Delete student records', category: 'Student Management', critical: true },
  { id: 'student.import', name: 'Import Students', description: 'Bulk import student data', category: 'Student Management' },
  { id: 'student.export', name: 'Export Students', description: 'Export student data', category: 'Student Management' },
  
  // Payment Management
  { id: 'payment.create', name: 'Create Payment', description: 'Create payment records', category: 'Payment Management' },
  { id: 'payment.read', name: 'View Payments', description: 'View payment information', category: 'Payment Management' },
  { id: 'payment.update', name: 'Update Payment', description: 'Edit payment records', category: 'Payment Management' },
  { id: 'payment.delete', name: 'Delete Payment', description: 'Delete payment records', category: 'Payment Management', critical: true },
  { id: 'payment.process', name: 'Process Payment', description: 'Process and confirm payments', category: 'Payment Management' },
  { id: 'payment.refund', name: 'Refund Payment', description: 'Process payment refunds', category: 'Payment Management', critical: true },
  { id: 'payment.export', name: 'Export Payments', description: 'Export payment data', category: 'Payment Management' },
  
  // Staff Management
  { id: 'staff.create', name: 'Create Staff', description: 'Create new staff accounts', category: 'Staff Management', critical: true },
  { id: 'staff.read', name: 'View Staff', description: 'View staff information', category: 'Staff Management' },
  { id: 'staff.update', name: 'Update Staff', description: 'Edit staff information', category: 'Staff Management' },
  { id: 'staff.delete', name: 'Delete Staff', description: 'Delete staff accounts', category: 'Staff Management', critical: true },
  { id: 'staff.permissions', name: 'Manage Permissions', description: 'Assign permissions to staff', category: 'Staff Management', critical: true },
  
  // Role Management
  { id: 'role.create', name: 'Create Role', description: 'Create new roles', category: 'Role Management', critical: true },
  { id: 'role.read', name: 'View Roles', description: 'View role information', category: 'Role Management' },
  { id: 'role.update', name: 'Update Role', description: 'Edit role permissions', category: 'Role Management', critical: true },
  { id: 'role.delete', name: 'Delete Role', description: 'Delete custom roles', category: 'Role Management', critical: true },
  
  // Class Management
  { id: 'class.create', name: 'Create Class', description: 'Create new classes', category: 'Academic Management' },
  { id: 'class.read', name: 'View Classes', description: 'View class information', category: 'Academic Management' },
  { id: 'class.update', name: 'Update Class', description: 'Edit class information', category: 'Academic Management' },
  { id: 'class.delete', name: 'Delete Class', description: 'Delete class records', category: 'Academic Management' },
  
  // System Settings
  { id: 'settings.general', name: 'General Settings', description: 'Manage general system settings', category: 'System Settings', critical: true },
  { id: 'settings.payment', name: 'Payment Settings', description: 'Configure payment gateways', category: 'System Settings', critical: true },
  { id: 'settings.whatsapp', name: 'WhatsApp Settings', description: 'Configure WhatsApp integration', category: 'System Settings' },
  { id: 'settings.notification', name: 'Notification Settings', description: 'Configure notification preferences', category: 'System Settings' },
  { id: 'settings.backup', name: 'Backup Settings', description: 'Manage system backups', category: 'System Settings', critical: true },
  { id: 'settings.security', name: 'Security Settings', description: 'Manage security configurations', category: 'System Settings', critical: true },
  
  // Reports & Analytics
  { id: 'reports.financial', name: 'Financial Reports', description: 'Access financial reports', category: 'Reports & Analytics' },
  { id: 'reports.academic', name: 'Academic Reports', description: 'Access academic reports', category: 'Reports & Analytics' },
  { id: 'reports.student', name: 'Student Reports', description: 'Access student reports', category: 'Reports & Analytics' },
  { id: 'reports.attendance', name: 'Attendance Reports', description: 'Access attendance reports', category: 'Reports & Analytics' },
  { id: 'reports.export', name: 'Export Reports', description: 'Export report data', category: 'Reports & Analytics' },
  
  // Communication
  { id: 'communication.whatsapp', name: 'Send WhatsApp', description: 'Send WhatsApp messages', category: 'Communication' },
  { id: 'communication.email', name: 'Send Email', description: 'Send email notifications', category: 'Communication' },
  { id: 'communication.sms', name: 'Send SMS', description: 'Send SMS messages', category: 'Communication' },
  { id: 'communication.broadcast', name: 'Broadcast Messages', description: 'Send bulk messages', category: 'Communication' },
  
  // System Administration
  { id: 'system.logs', name: 'System Logs', description: 'View system logs', category: 'System Administration', critical: true },
  { id: 'system.maintenance', name: 'System Maintenance', description: 'Perform system maintenance', category: 'System Administration', critical: true },
  { id: 'system.backup', name: 'System Backup', description: 'Create and restore backups', category: 'System Administration', critical: true },
  { id: 'system.users', name: 'User Management', description: 'Manage all user accounts', category: 'System Administration', critical: true },
  { id: 'system.database', name: 'Database Access', description: 'Direct database access', category: 'System Administration', critical: true },
]

export default function RoleManagementPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'Super Administrator',
      description: 'Full system access with all permissions',
      permissions: permissions.map(p => p.id),
      color: 'bg-red-100 text-red-800 border-red-300',
      userCount: 1,
      isSystem: true,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date()
    },
    {
      id: 'finance',
      name: 'Finance Manager',
      description: 'Manage payments, financial operations, and related reports',
      permissions: [
        'student.read', 'payment.create', 'payment.read', 'payment.update', 'payment.delete', 'payment.process', 'payment.refund', 'payment.export',
        'reports.financial', 'settings.payment', 'communication.whatsapp', 'communication.email'
      ],
      color: 'bg-green-100 text-green-800 border-green-300',
      userCount: 2,
      isSystem: true,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date()
    },
    {
      id: 'academic',
      name: 'Academic Staff',
      description: 'Manage academic operations, students, and classes',
      permissions: [
        'student.create', 'student.read', 'student.update', 'student.import', 'student.export',
        'class.create', 'class.read', 'class.update', 'class.delete',
        'reports.academic', 'reports.student', 'reports.attendance',
        'communication.whatsapp', 'communication.email'
      ],
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      userCount: 5,
      isSystem: true,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date()
    },
    {
      id: 'teacher',
      name: 'Teacher',
      description: 'View student information, manage classes, and access academic reports',
      permissions: [
        'student.read', 'class.read', 'reports.student', 'reports.academic', 'reports.attendance'
      ],
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      userCount: 15,
      isSystem: true,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date()
    },
    {
      id: 'staff',
      name: 'General Staff',
      description: 'Basic access to student information and general reports',
      permissions: ['student.read', 'reports.student'],
      color: 'bg-gray-100 text-gray-800 border-gray-300',
      userCount: 8,
      isSystem: false,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date()
    }
  ])

  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: [],
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  })

  const colorOptions = [
    { label: 'Red', value: 'bg-red-100 text-red-800 border-red-300' },
    { label: 'Green', value: 'bg-green-100 text-green-800 border-green-300' },
    { label: 'Blue', value: 'bg-blue-100 text-blue-800 border-blue-300' },
    { label: 'Purple', value: 'bg-purple-100 text-purple-800 border-purple-300' },
    { label: 'Yellow', value: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { label: 'Pink', value: 'bg-pink-100 text-pink-800 border-pink-300' },
    { label: 'Indigo', value: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    { label: 'Gray', value: 'bg-gray-100 text-gray-800 border-gray-300' },
  ]

  const handleCreate = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const newRole: Role = {
        ...formData as Role,
        id: Math.random().toString(36).substr(2, 9),
        userCount: 0,
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setRoles(prev => [...prev, newRole])
      setIsAddDialogOpen(false)
      resetForm()
      
      toast({
        title: 'Role Created',
        description: `${newRole.name} role has been created successfully.`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create role.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedRole || !formData.name || !formData.description) {
      return
    }

    setLoading(true)
    try {
      setRoles(prev => prev.map(r => 
        r.id === selectedRole.id 
          ? { ...r, ...formData, updatedAt: new Date() } as Role
          : r
      ))
      
      setIsEditDialogOpen(false)
      setSelectedRole(null)
      resetForm()
      
      toast({
        title: 'Role Updated',
        description: 'Role has been updated successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (role?.isSystem) {
      toast({
        title: 'Cannot Delete',
        description: 'System roles cannot be deleted.',
        variant: 'destructive'
      })
      return
    }

    if ((role?.userCount || 0) > 0) {
      toast({
        title: 'Cannot Delete',
        description: 'Role is currently assigned to users. Please reassign users before deleting.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      setRoles(prev => prev.filter(r => r.id !== roleId))
      
      toast({
        title: 'Role Deleted',
        description: 'Role has been deleted successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete role.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    })
  }

  const openEditDialog = (role: Role) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      color: role.color
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (role: Role) => {
    setSelectedRole(role)
    setIsViewDialogOpen(true)
  }

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions?.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...(prev.permissions || []), permissionId]
    }))
  }

  const getRoleIcon = (role: Role) => {
    if (role.name.toLowerCase().includes('admin')) return <Crown className="w-4 h-4" />
    if (role.name.toLowerCase().includes('teacher')) return <BookOpen className="w-4 h-4" />
    if (role.name.toLowerCase().includes('finance')) return <Settings className="w-4 h-4" />
    return <User className="w-4 h-4" />
  }

  const getPermissionsByCategory = () => {
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    }, {} as Record<string, Permission[]>)
  }

  const RoleForm = ({ isEdit = false }: { isEdit?: boolean }) => {
    const categorizedPermissions = getPermissionsByCategory()

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter role name"
              disabled={selectedRole?.isSystem}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Role Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-full border-2 ${color.value} ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter role description"
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Permissions ({formData.permissions?.length || 0} selected)</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, permissions: permissions.map(p => p.id) }))}
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, permissions: [] }))}
              >
                Clear All
              </Button>
            </div>
          </div>

          <Tabs defaultValue={Object.keys(categorizedPermissions)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {Object.keys(categorizedPermissions).map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(categorizedPermissions).map(([category, perms]) => (
              <TabsContent key={category} value={category} className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">
                  {category} ({perms.filter(p => formData.permissions?.includes(p.id)).length}/{perms.length} selected)
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {perms.map((permission) => (
                    <div
                      key={permission.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                        formData.permissions?.includes(permission.id)
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      } ${permission.critical ? 'border-l-4 border-l-red-500' : ''}`}
                    >
                      <Switch
                        checked={formData.permissions?.includes(permission.id) || false}
                        onCheckedChange={() => togglePermission(permission.id)}
                        disabled={selectedRole?.isSystem && permission.critical}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {permission.name}
                          </label>
                          {permission.critical && (
                            <Badge variant="destructive" className="text-xs">
                              Critical
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {formData.permissions && formData.permissions.length > 0 && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={formData.color}>
                  {getRoleIcon({ name: formData.name } as Role)}
                  {formData.name || 'New Role'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formData.permissions.length} permission{formData.permissions.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.description}
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions for your school management system
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions for your staff members
              </DialogDescription>
            </DialogHeader>
            
            <RoleForm />
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={loading}>
                {loading ? 'Creating...' : 'Create Role'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">System Roles</p>
                <p className="text-2xl font-bold">{roles.filter(r => r.isSystem).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Custom Roles</p>
                <p className="text-2xl font-bold">{roles.filter(r => !r.isSystem).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{roles.reduce((sum, role) => sum + role.userCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles List */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(role)}
                    <Badge className={role.color}>
                      {role.name}
                    </Badge>
                    {role.isSystem && (
                      <Badge variant="outline" className="text-xs">
                        System
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}</span>
                      <span>{role.userCount} user{role.userCount !== 1 ? 's' : ''}</span>
                      <span>Updated {role.updatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openViewDialog(role)}>
                      <Shield className="w-4 h-4 mr-2" />
                      View Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditDialog(role)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Role
                    </DropdownMenuItem>
                    {!role.isSystem && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onClick={(e?: React.MouseEvent) => e?.preventDefault()}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Role
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Role</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the "{role.name}" role? This action cannot be undone.
                              {role.userCount > 0 && (
                                <span className="block mt-2 text-red-600 font-medium">
                                  Warning: This role is currently assigned to {role.userCount} user{role.userCount !== 1 ? 's' : ''}.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(role.id)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={role.userCount > 0}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Modify role permissions and settings
            </DialogDescription>
          </DialogHeader>
          
          <RoleForm isEdit={true} />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Role Details</DialogTitle>
            <DialogDescription>
              View permissions and information for {selectedRole?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRole && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge className={selectedRole.color}>
                  {getRoleIcon(selectedRole)}
                  {selectedRole.name}
                </Badge>
                {selectedRole.isSystem && (
                  <Badge variant="outline">System Role</Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {selectedRole.userCount} user{selectedRole.userCount !== 1 ? 's' : ''} assigned
                </span>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedRole.description}
                </p>
              </div>
              
              <div>
                <Label className="text-base">
                  Permissions ({selectedRole.permissions.length})
                </Label>
                <div className="mt-3 space-y-4">
                  {Object.entries(getPermissionsByCategory()).map(([category, perms]) => {
                    const categoryPermissions = perms.filter(p => selectedRole.permissions.includes(p.id))
                    if (categoryPermissions.length === 0) return null
                    
                    return (
                      <div key={category}>
                        <h4 className="font-medium text-sm mb-2">
                          {category} ({categoryPermissions.length}/{perms.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryPermissions.map(permission => (
                            <div key={permission.id} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-600" />
                              <span>{permission.name}</span>
                              {permission.critical && (
                                <Badge variant="destructive" className="text-xs">
                                  Critical
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedRole && (
              <Button onClick={() => {
                setIsViewDialogOpen(false)
                openEditDialog(selectedRole)
              }}>
                Edit Role
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
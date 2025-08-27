import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  UserX,
  ArrowLeft,
  AlertTriangle,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';
import { authService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'admin',
    permissions: {
      canCreateEvents: true,
      canEditEvents: true,
      canDeleteEvents: true,
      canManageAdmins: false,
      canViewAnalytics: true
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const current = authService.getCurrentAdmin();
    setCurrentAdmin(current);
    
    // Check if current admin has permission to manage admins
    if (!current || (!current.permissions?.canManageAdmins && current.role !== 'super_admin')) {
      navigate('/admin/dashboard');
      return;
    }
    
    fetchAdmins();
  }, [navigate]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const result = await authService.getAdminList();
      
      if (result.success) {
        setAdmins(result.data.admins);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError('Failed to fetch admin list');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    if (field.startsWith('permissions.')) {
      const permissionKey = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const result = await authService.register(formData);
      
      if (result.success) {
        setShowCreateForm(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          fullName: '',
          role: 'admin',
          permissions: {
            canCreateEvents: true,
            canEditEvents: true,
            canDeleteEvents: true,
            canManageAdmins: false,
            canViewAnalytics: true
          }
        });
        fetchAdmins();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setError('Failed to create admin');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      role: 'admin',
      permissions: {
        canCreateEvents: true,
        canEditEvents: true,
        canDeleteEvents: true,
        canManageAdmins: false,
        canViewAnalytics: true
      }
    });
    setShowCreateForm(false);
    setEditingAdmin(null);
    setError('');
    setShowPassword(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'moderator':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
              <p className="text-gray-600">Manage administrator accounts and permissions</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Admin
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>
            
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleFormChange('fullName', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleFormChange('username', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      className="form-input pr-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleFormChange('role', e.target.value)}
                    className="form-input"
                    disabled={currentAdmin?.role !== 'super_admin'}
                  >
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    {currentAdmin?.role === 'super_admin' && (
                      <option value="super_admin">Super Admin</option>
                    )}
                  </select>
                </div>
              </div>
              
              {/* Permissions */}
              <div>
                <label className="form-label">Permissions</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canCreateEvents}
                      onChange={(e) => handleFormChange('permissions.canCreateEvents', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Create Events</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canEditEvents}
                      onChange={(e) => handleFormChange('permissions.canEditEvents', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Edit Events</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canDeleteEvents}
                      onChange={(e) => handleFormChange('permissions.canDeleteEvents', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Delete Events</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canViewAnalytics}
                      onChange={(e) => handleFormChange('permissions.canViewAnalytics', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">View Analytics</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canManageAdmins}
                      onChange={(e) => handleFormChange('permissions.canManageAdmins', e.target.checked)}
                      className="rounded"
                      disabled={currentAdmin?.role !== 'super_admin'}
                    />
                    <span className="text-sm">Manage Admins</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn btn-primary"
                >
                  {formLoading ? 'Creating...' : 'Create Admin'}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Admin List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Administrators ({admins.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">Admin</th>
                  <th className="text-left p-4 font-medium text-gray-600">Role</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Permissions</th>
                  <th className="text-left p-4 font-medium text-gray-600">Last Login</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{admin.fullName}</div>
                        <div className="text-sm text-gray-500">@{admin.username}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(admin.role)}`}>
                        {admin.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                        {admin.status.toUpperCase()}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions?.canCreateEvents && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Create</span>
                        )}
                        {admin.permissions?.canEditEvents && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Edit</span>
                        )}
                        {admin.permissions?.canDeleteEvents && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Delete</span>
                        )}
                        {admin.permissions?.canManageAdmins && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Manage</span>
                        )}
                        {admin.permissions?.canViewAnalytics && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Analytics</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4 text-sm text-gray-600">
                      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    
                    <td className="p-4">
                      <div className="flex gap-2">
                        {admin._id !== currentAdmin?.id && (
                          <>
                            <button
                              onClick={() => setEditingAdmin(admin)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Admin"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            
                            {currentAdmin?.role === 'super_admin' && (
                              <button
                                onClick={() => setDeleteConfirm(admin)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Admin"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                        
                        {admin._id === currentAdmin?.id && (
                          <span className="text-sm text-gray-500 px-2 py-1">Current User</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

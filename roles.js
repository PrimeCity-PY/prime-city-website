// Role Management System
(() => {
  const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    VIEWER: 'viewer'
  };

  const ROLE_NAMES = {
    [ROLES.OWNER]: 'المالك',
    [ROLES.ADMIN]: 'مدير',
    [ROLES.MODERATOR]: 'مشرف',
    [ROLES.VIEWER]: 'مشاهد'
  };

  const ROLE_PERMISSIONS = {
    [ROLES.OWNER]: {
      viewApplications: true,
      manageApplications: true,
      manageRoles: true,
      deleteApplications: true,
      exportData: true
    },
    [ROLES.ADMIN]: {
      viewApplications: true,
      manageApplications: true,
      manageRoles: false,
      deleteApplications: true,
      exportData: true
    },
    [ROLES.MODERATOR]: {
      viewApplications: true,
      manageApplications: true,
      manageRoles: false,
      deleteApplications: false,
      exportData: false
    },
    [ROLES.VIEWER]: {
      viewApplications: true,
      manageApplications: false,
      manageRoles: false,
      deleteApplications: false,
      exportData: false
    }
  };

  // Initialize default owner (first time setup)
  const initializeDefaultOwner = () => {
    const admins = JSON.parse(localStorage.getItem('primeCityAdmins') || '[]');
    if (admins.length === 0) {
      // Create default owner account
      const defaultOwner = {
        id: 'owner-1',
        username: 'owner',
        password: 'admin123', // Change this!
        role: ROLES.OWNER,
        name: 'المالك',
        createdAt: new Date().toISOString()
      };
      admins.push(defaultOwner);
      localStorage.setItem('primeCityAdmins', JSON.stringify(admins));
      console.log('✅ تم إنشاء حساب Owner الافتراضي:\nUsername: owner\nPassword: admin123\n⚠️ يرجى تغيير كلمة المرور فوراً!');
    }
  };

  // Get current user
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('primeCityAdminUser');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  // Get current user role
  const getCurrentRole = () => {
    const user = getCurrentUser();
    return user?.role || null;
  };

  // Check permission
  const hasPermission = (permission) => {
    const role = getCurrentRole();
    if (!role) return false;
    return ROLE_PERMISSIONS[role]?.[permission] || false;
  };

  // Check if user is logged in as admin
  const isAdminLoggedIn = () => {
    return getCurrentUser() !== null;
  };

  // Login admin
  const loginAdmin = (username, password) => {
    const admins = JSON.parse(localStorage.getItem('primeCityAdmins') || '[]');
    const admin = admins.find(a => a.username === username && a.password === password);
    
    if (admin) {
      const userData = {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        name: admin.name
      };
      localStorage.setItem('primeCityAdminUser', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
  };

  // Logout admin
  const logoutAdmin = () => {
    localStorage.removeItem('primeCityAdminUser');
  };

  // Get all admins (only for owner)
  const getAllAdmins = () => {
    if (!hasPermission('manageRoles')) return [];
    return JSON.parse(localStorage.getItem('primeCityAdmins') || '[]');
  };

  // Add admin (only owner)
  const addAdmin = (username, password, name, role) => {
    if (!hasPermission('manageRoles')) {
      return { success: false, error: 'ليس لديك صلاحية لإضافة إداريين' };
    }

    const admins = JSON.parse(localStorage.getItem('primeCityAdmins') || '[]');
    
    // Check if username exists
    if (admins.find(a => a.username === username)) {
      return { success: false, error: 'اسم المستخدم موجود بالفعل' };
    }

    const newAdmin = {
      id: `admin-${Date.now()}`,
      username,
      password,
      role,
      name,
      createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    localStorage.setItem('primeCityAdmins', JSON.stringify(admins));
    return { success: true, admin: newAdmin };
  };

  // Update admin role (only owner)
  const updateAdminRole = (adminId, newRole) => {
    if (!hasPermission('manageRoles')) {
      return { success: false, error: 'ليس لديك صلاحية لتعديل الرتب' };
    }

    const admins = JSON.parse(localStorage.getItem('primeCityAdmins') || '[]');
    const admin = admins.find(a => a.id === adminId);
    
    if (!admin) {
      return { success: false, error: 'المستخدم غير موجود' };
    }

    // Prevent changing owner role
    if (admin.role === ROLES.OWNER && newRole !== ROLES.OWNER) {
      return { success: false, error: 'لا يمكن تغيير رتبة المالك' };
    }

    admin.role = newRole;
    localStorage.setItem('primeCityAdmins', JSON.stringify(admins));
    return { success: true };
  };

  // Delete admin (only owner)
  const deleteAdmin = (adminId) => {
    if (!hasPermission('manageRoles')) {
      return { success: false, error: 'ليس لديك صلاحية لحذف الإداريين' };
    }

    const admins = JSON.parse(localStorage.getItem('primeCityAdmins') || '[]');
    const admin = admins.find(a => a.id === adminId);
    
    if (!admin) {
      return { success: false, error: 'المستخدم غير موجود' };
    }

    // Prevent deleting owner
    if (admin.role === ROLES.OWNER) {
      return { success: false, error: 'لا يمكن حذف المالك' };
    }

    const filtered = admins.filter(a => a.id !== adminId);
    localStorage.setItem('primeCityAdmins', JSON.stringify(filtered));
    return { success: true };
  };

  // Initialize on load
  initializeDefaultOwner();

  // Export to window
  window.RoleSystem = {
    ROLES,
    ROLE_NAMES,
    ROLE_PERMISSIONS,
    getCurrentUser,
    getCurrentRole,
    hasPermission,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    getAllAdmins,
    addAdmin,
    updateAdminRole,
    deleteAdmin
  };
})();

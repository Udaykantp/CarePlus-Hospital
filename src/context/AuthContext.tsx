import React, { createContext, useContext, useState, useEffect } from 'react';
import { ManagementUser, Tenant, UserRole } from '../types/management';
import { SEEDED_TENANTS, SEEDED_USERS } from '../data/mockManagementData';

interface AuthContextType {
  currentUser: ManagementUser | null;
  currentTenant: Tenant;
  allTenants: Tenant[];
  allUsers: ManagementUser[];
  token: string | null;
  isAuthenticated: boolean;
  isViewModePublic: boolean;
  isManagementView: boolean;
  toggleViewMode: () => void;
  login: (email: string, pass: string, tenantId?: string) => { success: boolean; error?: string };
  logout: () => void;
  quickSwitchRole: (role: UserRole, customTenantId?: string) => void;
  switchTenant: (tenantId: string) => void;
  setViewModePublic: (isPublic: boolean) => void;
  updateTenant: (updated: Tenant) => void;
  addUser: (user: Omit<ManagementUser, 'id'>) => void;
  toggleUserStatus: (userId: string) => void;
}

const AUTH_STORAGE_KEY = 'hhmc_platform_auth_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allTenants, setAllTenants] = useState<Tenant[]>(SEEDED_TENANTS);
  const [allUsers, setAllUsers] = useState<ManagementUser[]>(SEEDED_USERS);
  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-healing-hands');
  const [currentUser, setCurrentUser] = useState<ManagementUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isViewModePublic, setIsViewModePublic] = useState<boolean>(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.userId) {
          const matchedUser = allUsers.find(u => u.id === parsed.userId);
          if (matchedUser) {
            setCurrentUser(matchedUser);
            setToken(parsed.token || 'mock-jwt-token-hhmc');
            if (matchedUser.tenantId) {
              setCurrentTenantId(matchedUser.tenantId);
            }
            setIsViewModePublic(parsed.isViewModePublic ?? false);
          }
        }
      }
    } catch (e) {
      console.error('Error restoring auth session', e);
    }
  }, []);

  // Sync to localStorage
  const saveSession = (user: ManagementUser | null, tok: string | null, isPublic: boolean) => {
    try {
      if (user) {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            userId: user.id,
            token: tok,
            isViewModePublic: isPublic
          })
        );
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving session', e);
    }
  };

  const currentTenant = allTenants.find(t => t.id === currentTenantId) || allTenants[0];

  const generateMockJwt = (user: ManagementUser): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        iss: 'careplus-multi-tenant-auth',
        exp: Math.floor(Date.now() / 1000) + 86400,
        hipaaAudited: true
      })
    );
    return `${header}.${payload}.MOCK_SIGNATURE_${user.role.toUpperCase()}`;
  };

  const login = (email: string, pass: string, tenantId?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    
    // Find matching user
    const foundUser = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!foundUser) {
      return { success: false, error: 'Invalid medical staff or patient credentials. Please check your email.' };
    }

    if (foundUser.status === 'inactive') {
      return { success: false, error: 'This user account has been deactivated by the clinic administrator.' };
    }

    // If tenant specified for non-superadmin, verify tenant
    if (foundUser.role !== 'super_admin' && tenantId && foundUser.tenantId !== tenantId) {
      return { success: false, error: 'Selected clinic tenant does not match your assigned domain account.' };
    }

    const mockToken = generateMockJwt(foundUser);
    setCurrentUser(foundUser);
    setToken(mockToken);
    if (foundUser.tenantId) {
      setCurrentTenantId(foundUser.tenantId);
    }
    setIsViewModePublic(false);
    saveSession(foundUser, mockToken, false);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setIsViewModePublic(true);
    saveSession(null, null, true);
  };

  const quickSwitchRole = (role: UserRole, customTenantId?: string) => {
    let targetUser: ManagementUser | undefined;
    
    if (role === 'clinic_admin' && customTenantId === 'tenant-apex-care') {
      targetUser = allUsers.find(u => u.id === 'user-clinic-admin-2');
    } else {
      targetUser = allUsers.find(u => u.role === role);
    }

    if (targetUser) {
      const mockToken = generateMockJwt(targetUser);
      setCurrentUser(targetUser);
      setToken(mockToken);
      if (targetUser.tenantId) {
        setCurrentTenantId(targetUser.tenantId);
      }
      setIsViewModePublic(false);
      saveSession(targetUser, mockToken, false);
    }
  };

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    // If current user is clinic-scoped and does not belong to this tenant, switch to that tenant's admin
    if (currentUser && currentUser.role !== 'super_admin' && currentUser.tenantId !== tenantId) {
      const adminOfTenant = allUsers.find(u => u.tenantId === tenantId && u.role === 'clinic_admin');
      if (adminOfTenant) {
        setCurrentUser(adminOfTenant);
        const mockToken = generateMockJwt(adminOfTenant);
        setToken(mockToken);
        saveSession(adminOfTenant, mockToken, false);
      }
    }
  };

  const updateTenant = (updated: Tenant) => {
    setAllTenants(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  };

  const addUser = (newUser: Omit<ManagementUser, 'id'>) => {
    const id = `user-gen-${Date.now()}`;
    const userWithId: ManagementUser = { ...newUser, id };
    setAllUsers(prev => [userWithId, ...prev]);
  };

  const toggleUserStatus = (userId: string) => {
    setAllUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentTenant,
        allTenants,
        allUsers,
        token,
        isAuthenticated: !!currentUser,
        isViewModePublic,
        isManagementView: !isViewModePublic,
        toggleViewMode: () => {
          setIsViewModePublic(prev => {
            const next = !prev;
            saveSession(currentUser, token, next);
            return next;
          });
        },
        login,
        logout,
        quickSwitchRole,
        switchTenant,
        setViewModePublic: (isPub) => {
          setIsViewModePublic(isPub);
          saveSession(currentUser, token, isPub);
        },
        updateTenant,
        addUser,
        toggleUserStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import { useAuth } from './useAuth';

export function usePermission() {
  const { user } = useAuth();

  const hasRole = (...roles) => user && roles.includes(user.role);
  const isAdmin = () => hasRole('ADMIN');
  const isHR = () => hasRole('ADMIN', 'HR_MANAGER');
  const isManager = () => hasRole('ADMIN', 'HR_MANAGER', 'MANAGER');
  const isFinance = () => hasRole('ADMIN', 'HR_MANAGER', 'FINANCE');

  return { hasRole, isAdmin, isHR, isManager, isFinance, user };
}

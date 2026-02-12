import { usePermission } from "@/hooks/permissions/usePermission";
import { ReactNode } from "react";

interface PermissionGuardProps {
  /**
   * Permission(s) required to view the children
   * - Single permission: "users.create"
   * - Multiple permissions (OR): ["users.create", "users.edit"]
   */
  permission: string | string[];

  /**
   * Optional fallback UI when permission is denied
   */
  fallback?: ReactNode;

  /**
   * Content to show when permission is granted
   */
  children: ReactNode;

  /**
   * If true, requires ALL permissions in array (AND logic)
   * If false (default), requires ANY permission in array (OR logic)
   */
  requireAll?: boolean;
}

/**
 * Permission Guard Component
 *
 * Conditionally renders children based on user permissions
 *
 * @example
 * ```tsx
 * // Show button only if user has permission
 * <PermissionGuard permission="users.create">
 *   <CreateButton />
 * </PermissionGuard>
 *
 * // Show different UI when no permission
 * <PermissionGuard
 *   permission="users.delete"
 *   fallback={<p>You don't have permission</p>}
 * >
 *   <DeleteButton />
 * </PermissionGuard>
 *
 * // Require multiple permissions (OR logic - default)
 * <PermissionGuard permission={["users.create", "users.edit"]}>
 *   <UserActions />
 * </PermissionGuard>
 *
 * // Require ALL permissions (AND logic)
 * <PermissionGuard permission={["users.create", "users.edit"]} requireAll>
 *   <AdvancedUserActions />
 * </PermissionGuard>
 * ```
 */
export const PermissionGuard = ({
  permission,
  fallback = null,
  children,
  requireAll = false,
}: PermissionGuardProps) => {
  const { hasPermission, hasAllPermissions } = usePermission();

  // Check permissions based on requireAll flag
  const hasAccess =
    requireAll && Array.isArray(permission)
      ? hasAllPermissions(permission)
      : hasPermission(permission);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;

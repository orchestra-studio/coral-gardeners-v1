import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateRolePermissions, type Role } from "@/services/adminRoles";
import { FormValues, PermissionGroup, GroupState, UseRolePermissionsReturn } from "../types";

export function useRolePermissions(
    role: Role | null,
    permissionGroups: PermissionGroup,
    rolePermissions: string[],
    handleClose: () => void
): UseRolePermissionsReturn {
    const updateRolePermissionsMutation = useUpdateRolePermissions();

    const { handleSubmit, setValue, watch, reset, getValues } = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            permissions: {},
        },
    });

    // Update form values when permissions are loaded
    useEffect(() => {
        if (Object.keys(permissionGroups).length > 0) {
            const formPermissions: { [key: string]: boolean } = {};

            // Initialize individual permissions
            Object.values(permissionGroups)
                .flat()
                .forEach((permission) => {
                    formPermissions[permission.name] = rolePermissions.includes(permission.name);
                });

            reset({
                permissions: formPermissions,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissionGroups, rolePermissions]);

    // Handle individual permission toggle
    const handlePermissionToggle = (permissionName: string) => {
        const allPermissions = watch('permissions') || {};
        const currentValue = allPermissions[permissionName];

        setValue('permissions', {
            ...allPermissions,
            [permissionName]: !currentValue
        });
    };

    // Handle group permission toggle
    const handleGroupToggle = (groupName: string) => {
        if (!permissionGroups[groupName]) return;

        const groupPermissions = permissionGroups[groupName];
        const allPermissions = getValues('permissions');

        const checkedCount = groupPermissions.filter((p) =>
            allPermissions[p.name] === true
        ).length;
        const totalCount = groupPermissions.length;

        const shouldCheckAll = checkedCount !== totalCount;

        // Update all permissions in the group
        const updatedPermissions = { ...allPermissions };
        groupPermissions.forEach((permission) => {
            updatedPermissions[permission.name] = shouldCheckAll;
        });

        setValue('permissions', updatedPermissions, {
            shouldDirty: true,
            shouldTouch: true
        });
    };

    // Handle "Select All" toggle
    const handleSelectAll = () => {
        const allPermissions = getValues('permissions');
        const allPermissionNames = Object.values(permissionGroups).flat().map(p => p.name);

        const allChecked = allPermissionNames.every(permissionName =>
            allPermissions[permissionName] === true
        );
        const newValue = !allChecked;

        // Update all individual permissions
        const updatedPermissions = { ...allPermissions };
        allPermissionNames.forEach((permissionName) => {
            updatedPermissions[permissionName] = newValue;
        });

        setValue('permissions', updatedPermissions, {
            shouldDirty: true,
            shouldTouch: true
        });
    };

    // Check if all permissions are selected
    const areAllPermissionsSelected = () => {
        const allPermissions = watch('permissions') || {};
        const allPermissionNames = Object.values(permissionGroups).flat().map(p => p.name);
        return allPermissionNames.every(permissionName => allPermissions[permissionName] === true);
    };

    // Check if some permissions are selected (for indeterminate state)
    const areSomePermissionsSelected = () => {
        const allPermissions = watch('permissions') || {};
        const allPermissionNames = Object.values(permissionGroups).flat().map(p => p.name);
        return allPermissionNames.some(permissionName => allPermissions[permissionName] === true);
    };

    // Check group state
    const getGroupState = (groupName: string): GroupState => {
        if (!permissionGroups[groupName])
            return { checked: false, indeterminate: false };

        const groupPermissions = permissionGroups[groupName];
        const allPermissions = watch('permissions') || {};

        const checkedCount = groupPermissions.filter((p) =>
            allPermissions[p.name] === true
        ).length;
        const totalCount = groupPermissions.length;

        return {
            checked: checkedCount === totalCount,
            indeterminate: checkedCount > 0 && checkedCount < totalCount,
        };
    };

    const onSubmit = async () => {
        if (!role) return;

        try {
            const currentValues = getValues();

            // Get selected permission names (only permissions with dots in their names)
            const selectedPermissions = Object.entries(currentValues.permissions)
                .filter(([key, checked]) =>
                    typeof checked === 'boolean' &&
                    checked === true &&
                    key.includes('.')
                )
                .map(([permissionName]) => permissionName);

            await updateRolePermissionsMutation.mutateAsync({
                roleId: role.id,
                permissions: selectedPermissions,
            });

            handleClose();
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    return {
        handleSubmit,
        setValue,
        watch,
        reset,
        handlePermissionToggle,
        handleGroupToggle,
        handleSelectAll,
        areAllPermissionsSelected,
        areSomePermissionsSelected,
        getGroupState,
        onSubmit,
        isLoading: updateRolePermissionsMutation.isPending,
    };
}
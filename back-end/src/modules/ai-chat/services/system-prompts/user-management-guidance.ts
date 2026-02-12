/**
 * User Management Guidance
 * Instructions for using user management tools
 */
export function buildUserManagementGuidance(tools: any[]): string {
    const createUserTool = tools.find((tool) => tool.name === 'create-user');
    const updateUserTool = tools.find((tool) => tool.name === 'update-user');
    const deleteUserTool = tools.find((tool) => tool.name === 'delete-user');
    const restoreUserTool = tools.find((tool) => tool.name === 'restore-user');
    const searchUsersTool = tools.find((tool) => tool.name === 'search-users');
    const listUsersTool = tools.find((tool) => tool.name === 'list-users');

    if (!createUserTool && !updateUserTool && !deleteUserTool && !restoreUserTool && !searchUsersTool && !listUsersTool) {
        return '';
    }

    let guidance = `
USER MANAGEMENT WORKFLOWS:`;

    if (createUserTool) {
        guidance += `
• Creating users → call **${createUserTool.name}** with required fields (username, email, password, etc.)`;
    }

    if (updateUserTool) {
        guidance += `
• Updating users → IMPORTANT: First search/list users to get their ID, then immediately call **${updateUserTool.name}** with userId and fields to update
    - Example: "edit user John" → search-users or list-users to find John's ID → update-user with userId in the same reply
    - If multiple matches share the name, ask the user to choose an ID; otherwise proceed automatically
    - Never guess user IDs, always search first`;
    }

    if (searchUsersTool || listUsersTool) {
        const toolNames = [searchUsersTool?.name, listUsersTool?.name].filter(Boolean).join(' or ');
        guidance += `
• Finding users → call **${toolNames}** to get user details including IDs`;
    }

    if (deleteUserTool) {
        guidance += `
• Deleting users → First search/list to get user ID, then call **${deleteUserTool.name}** with userId (soft delete, can be restored)`;
    }

    if (restoreUserTool) {
        guidance += `
• Restoring deleted users → call **${restoreUserTool.name}** with user ID`;
    }

    return guidance;
}

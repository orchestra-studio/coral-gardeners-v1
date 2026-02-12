/**
 * Username Generator Utility
 * Generates unique usernames from first and last names
 */

/**
 * Generate a unique username from first name and last name
 * Format: firstname-lastname
 * If duplicate exists: firstname-lastname-2, firstname-lastname-3, etc.
 * 
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param repository - TypeORM repository to check for existing usernames
 * @param tableName - Optional table name for display in comments (default: 'user')
 * @returns Promise<string> - Unique username
 */
export async function generateUsername(
    firstName: string,
    lastName: string,
    repository: any,
    tableName: string = 'user'
): Promise<string> {
    // Sanitize names: convert to lowercase and remove non-alphanumeric characters
    const first = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const last = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const baseUsername = `${first}-${last}`;
    let username = baseUsername;

    // Check if base username exists
    let existing = await repository.findOne({ where: { username } });

    if (!existing) {
        // Base username is available
        return username;
    }

    // Base username exists, find the next available suffix
    // Start from 2 and find the first gap or next number
    let suffix = 2;
    const maxAttempts = 1000; // Safety limit to prevent infinite loops

    while (suffix < maxAttempts) {
        username = `${baseUsername}-${suffix}`;
        existing = await repository.findOne({ where: { username } });

        if (!existing) {
            // Found an available username
            return username;
        }

        suffix++;
    }

    // Fallback: should never reach here, but add timestamp if it does
    const timestamp = Date.now().toString().slice(-6);
    return `${baseUsername}-${timestamp}`;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate string is not empty
 * @param {string} str - String to validate
 * @returns {boolean} - True if string is not empty
 */
export const isNotEmpty = (str) => {
    return str && str.trim().length > 0;
};

/**
 * Validate required fields
 * @param {object} obj - Object containing fields
 * @param {array} fields - Array of required field names
 * @returns {string|null} - Error message or null if valid
 */
export const validateRequiredFields = (obj, fields) => {
    for (const field of fields) {
        if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
            return `${field} is required`;
        }
    }
    return null;
};

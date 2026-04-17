export const MESSAGES = {
    AUTH: {
        REGISTER_SUCCESS: "Account created successfully",
        LOGIN_SUCCESS: "Logged in successfully",
        LOGOUT_SUCCESS: "Logged out successfully",
        INVALID_CREDENTIALS: "Invalid email or password",
        EMAIL_ALREADY_EXISTS: "Email is already registered",
        UNAUTHORIZED: "You are not authorized to access this resource",
        TOKEN_EXPIRED: "Session expired, please login again",
        TOKEN_INVALID: "Invalid token",
        UNAUTHORIZED_ACCESS: "Unauthorized access",
    },
    USER: {
        FETCHED: "User fetched successfully",
        UPDATED: "User updated successfully",
        NOT_FOUND: "User not found",
    },
    PROPERTY: {
        CREATED: "Property listed successfully",
        FETCHED: "Property fetched successfully",
        UPDATED: "Property updated successfully",
        DELETED: "Property deleted successfully",
        NOT_FOUND: "Property not found",
    },
    BOOKING: {
        CREATED: "Booking created successfully",
        FETCHED: "Booking fetched successfully",
        CANCELLED: "Booking cancelled successfully",
        NOT_FOUND: "Booking not found",
        DATE_CONFLICT: "Property is not available for selected dates",
    },
    GENERAL: {
        SOMETHING_WENT_WRONG: "Something went wrong, please try again",
        VALIDATION_ERROR: "Validation failed",
        NOT_FOUND: "Resource not found",
    },
} as const;

/**
 * ApiResponse.js — Standardized API response wrapper.
 * Ensures all successful responses follow a consistent format.
 */
class ApiResponse {
    constructor(statusCode, data, message = 'Success') {
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    static ok(data, message = 'Success') {
        return new ApiResponse(200, data, message);
    }

    static created(data, message = 'Created successfully') {
        return new ApiResponse(201, data, message);
    }

    static noContent(message = 'Deleted successfully') {
        return new ApiResponse(204, null, message);
    }

    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data,
        });
    }
}

export default ApiResponse;

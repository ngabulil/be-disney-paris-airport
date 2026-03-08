const formatResponse = (res, status, message, data = null, error = null) => {
    return res.status(status).json({
        success: status >= 200 && status < 300,
        statusCode: status,
        message,
        ...(data && { data }),
        ...(status >= 400 && { error }),
    });
};

module.exports = {
    formatResponse,
};
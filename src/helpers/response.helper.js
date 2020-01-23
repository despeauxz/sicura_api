export default {
    successResponse(res, status, data) {
        return res.status(status).json({ status, data });
    },
    errorResponse(res, status, error) {
        return res.status(status).json({ status, error });
    },
    messageResponse(res, status, message) {
        return res.status(status).json({ status, message });
    }
};

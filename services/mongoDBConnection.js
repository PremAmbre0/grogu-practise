const mongoose = require("mongoose");
const { logger } = require("utils");

module.exports = async () => {
    try {
        mongoose
            .connect(process.env.MONGO_URI)
            .then(() => logger.info(`MongoDB Connected`))
            .catch((err) => logger.error({ err }));
    } catch (error) {
        return null;
    }
};

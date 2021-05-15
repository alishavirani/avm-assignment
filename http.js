const axios = require("axios");

module.exports.httpGet = async (api) => {
    const response = await axios.get(api);
    return response.data;
}
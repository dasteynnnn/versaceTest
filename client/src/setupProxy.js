const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/barbies/**", { target: "http://localhost:9000" })
    );
};
const { createProxyMiddleware } = require("http-proxy-middleware");

const config = {
  proxyLogLevel: process.env.REACT_APP_PROXY_LOG_LEVEL || "error",
  proxyUrl: process.env.REACT_APP_PROXY_URL,
  sapClient: process.env.REACT_APP_PROXY_SAP_CLIENT,
  sapUsername: process.env.REACT_APP_PROXY_SAP_USERNAME,
  sapPassword: process.env.REACT_APP_PROXY_SAP_PASSWORD,
};

const updateQueryStringParameter = (path, key, value) => {
  const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  const separator = path.indexOf("?") !== -1 ? "&" : "?";
  if (path.match(re)) {
    return path.replace(re, "$1" + key + "=" + value + "$2");
  } else {
    return path + separator + key + "=" + value;
  }
};

module.exports = function (app) {
  if (!config.proxyUrl) {
    return;
  }

  const apiUrl = new URL(config.proxyUrl);

  app.use(
    apiUrl.pathname,
    createProxyMiddleware({
      logLevel: config.proxyLogLevel,
      target: apiUrl.origin,
      secure: false,
      changeOrigin: true,
      cookieDomainRewrite: "",
      auth: config.sapUsername && config.sapPassword ? `${config.sapUsername}:${config.sapPassword}` : undefined,
      pathRewrite: (path, req) => {
        let newPath = path;

        if (config.sapClient) {
          newPath = updateQueryStringParameter(newPath, "sap-client", config.sapClient);
        }

        return newPath;
      },
    })
  );
};

module.exports = ({ config }) => {
  const rawBaseUrl = process.env.EXPO_BASE_URL;
  const baseUrl = rawBaseUrl ? rawBaseUrl.trim().replace(/\/+$/, "") : "";

  if (!baseUrl) {
    return config;
  }

  return {
    ...config,
    experiments: {
      ...(config.experiments ?? {}),
      baseUrl
    }
  };
};

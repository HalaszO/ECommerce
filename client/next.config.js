module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  env: {
    STRIPE_PUBLIC_KEY:
      "pk_test_51IX6VFCUnkyQdSge8PjmrrdKMDiSk6mzJ3Dbo5j0C8BY8H0SLGeNb33W8JN9lP8vxxLJnbJDDxo1HsSSwPU3BvtB00pnq1Psd2",
  },
};

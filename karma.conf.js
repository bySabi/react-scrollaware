const carma = require('carma-tap-webpack');

module.exports = function(config) {
  carma(config);
  config.set({
    browsers: process.env.CONTINUOUS_INTEGRATION === 'true' ? ['Chrome_ci'] : ['Chrome']
  });
}

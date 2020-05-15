module.exports = {
  stories: ['../src/component/**/**/*.story.tsx'],
  webpackFinal: async config => {
      // Parse Ts
      config.module.rules.push({
          test: /\.(ts|tsx)$/,
          use: [{
              loader: require.resolve('ts-loader'),
          }],
      });
      config.resolve.extensions.push('.ts', '.tsx');
      return config;
  },
};
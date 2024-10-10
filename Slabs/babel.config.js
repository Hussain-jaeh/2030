module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@assets': './assets',
        '@components': './src/components',
        // Add other aliases as needed
      }
    }]
  ]
};
import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
  },
  rules: {
    'style/brace-style': ['warn', '1tbs'],
    'no-console': ['off'],
    'node/prefer-global/process': ['off'],
  },
  formatters: {
    css: 'prettier',
    html: 'prettier',
  },
})

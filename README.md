# babel-plugin-transform-lazy

该插件是为了解决在开发中，由于使用 `Suspense` 和 `lazy`，在修改文件时导致产生连锁效应，最终应用被最外层的 `Suspense` 重新渲染。

需要注意的是：

- 请勿在生产模式下使用该插件
- 请勿忘记使用 `Suspense`，包裹异步引入的代码

## 使用

```js
function babelConfig () {
  const presets = [...<your presets>];
  const plugins = [...<your plugins>];

  const prodPlugins = [
    [
      'transform-react-lazy-import',
      {
        checker: (local, extra) => {
          return extra.startsWith('@Views')
        }
      }
    ]
  ];

  return {
    presets,
    plugins,
    env: {
      production: {
        plugins: prodPlugins
      }
    }
  }
}

module.exports = babelConfig;
```

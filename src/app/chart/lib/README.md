# TDC chart lib

## 目录结构

- chart，比如line chart，创建line.ts在根目录下，关于line chart本身的所有类等放在该文件里
- helper，不属于chart自身的功能，比如line-chart-builder，是输出测试用的假数据。

## 开发规范

- 依照原有的tcc angular开发规范，lint，ut，aot需保证。
- 极小化引用外部依赖。chart原则上只依赖d3. 假如用到observable，lodash，尽量自己写helper。

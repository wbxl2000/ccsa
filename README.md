# CCSA（Chinese character structure annotation）

## Introduction

这是一款用于标注汉字骨架关键点的web应用。

输入应为：
① 要标注的数据集图片
② 数据集图片对应的汉字
③ 汉字的笔画顺序

输出应为：
每一张图片对应的每一种笔画按照顺序的关键点坐标

## How to use

### 运行此应用

1. 进入后端文件夹，`npm i` 安装依赖包，`node index.js` 或 `nodemon index.js`运行后端，端口为`localhost:4000`

2. 进入前端文件夹，`npm i` 安装依赖包，`yarn start` 编译并运行，端口为`localhost:4000`

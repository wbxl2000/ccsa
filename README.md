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

进入`server`文件夹，`npm i` 安装依赖包，`node index.js` 或 `nodemon index.js`运行，端口为`localhost:4000`

此时使用的前端目录为`/font/build`

### 修改与二次开发此应用

需要分别运行前端与后端：

1. 后端运行：与上一小节「运行此应用」中步骤相同

2. 前端运行：进入前端文件夹`front-end`，`npm i` 安装依赖包，`yarn start` 编译并运行，此时需要一直开着步骤1中的后端

注意，此时与运行不同的地方在于，需要访问`localhost:3000`，此时访问的是实时编译的前端，而不是`build`文件夹，如已经修改完，则可以执行`yarn build`生成新的`build`文件夹，之后就可以愉快地继续直接只运行后端了。


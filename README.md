# CCSA（Chinese character structure annotation）

## Introduction

这是一款用于标注汉字骨架关键点的web应用。

输入应为：
① 要标注的数据集图片
② 数据集图片对应的汉字
③ 汉字的笔画顺序

输出应为：
每一张图片对应的每一种笔画按照顺序的关键点坐标

效果展示：

![ccsa_sample](C:\qerdata\project\ccsa\ccsa_sample.gif)

## How to use

### 直接运行此应用

进入`server`文件夹，`npm i` 安装依赖包，`node index.js` 或 `nodemon index.js`运行，端口为`localhost:4000`

此时使用的前端目录为`/font/build`

默认有三个数据集 10000, 10002, 10003 可供测试，不需要添加额外数据集。

### 修改与二次开发此应用

需要分别运行前端与后端：

1. 后端运行：与上一小节「运行此应用」中步骤相同

2. 前端运行：进入前端文件夹`front-end`，`npm i` 安装依赖包，`yarn start` 编译并运行，此时需要一直开着步骤1中的后端

注意，此时与运行不同的地方在于，需要访问`localhost:3000`，此时访问的是实时编译的前端，而不是`build`文件夹，如已经修改完，则可以执行`yarn build`生成新的`build`文件夹，之后就可以愉快地继续直接只运行后端了。

## 数据集使用

### 测试

默认有测试数据集，编号分别为 10000, 10001, 10002，在`./server/dataSet_100per_v3/`文件夹下，可直接clone本项目使用。

### 训练数据集

目前是v3版本，链接在 群内 和 [google drive](https://drive.google.com/file/d/1w6fJXPaL70ijfs2HM3rGLcOrBnemuDz8/view?usp=sharing) 都有，群内下得快，下载之后将其解压到`./server/`，即`./server/dataSet_100per_v3/1`...

## 结果文件

`./server/result/data.json`

每完成一个数据集之后，会有选项提示自动保存，保存的文件为`./server/result/data_<dataset-id>.json`

## FAQ

### 如何修改指定数据集？

在`./server/src/system-info.json`中修改字段：`"dataSetId"`，修改为几号则从几号数据集开始。如果遇到之前未完成的进度，还可以修改同文件中的`"currentImageId"`字段，表示从这个数据集的哪一张图片开始。

修改完成想要标注的数据集后，不要忘记清空或者备份上一条的`data.json`，清空至里面只有一个`content`字段，且为空数组。

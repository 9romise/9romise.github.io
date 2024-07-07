---
title: 'JS包管理器介绍'
time: 2023-07-15
---

> 写这篇文章是因为在工作过程中发现大家对于npm这个每天接触的工具似乎都不是很熟悉。

`npm`是`JavaScript`的包管理工具，并且是`node.js`的默认包管理工具。
现如今比较流行包管理器是：`npm`、`yarn`、`pnpm`。

`npm`是随同`node.js`一起安装的包管理工具，能解决node.js代码部署上的很多问题，常见的使用场景有以下几种：

- 允许用户从`npm`服务器下载别人编写的第三方包到本地使用。
- 允许用户从`npm`服务器下载并安装别人编写的命令行程序到本地使用。
- 允许用户将自己编写的包或命令行程序上传到`npm`服务器供别人使用。

## 常用命令

### npm init 创建模块

```shell
// 创建一个package.json文件
npm init
```

### npm install 安装模块

```shell
// 读取package.json里面的配置单安装
npm install
// 简写：npm i

// 默认安装指定模块的最新(@latest)版本

npm install [<@scope>/]<name>
// 例: npm install vue

安装指定模块的指定版本

npm install [<@scope>/]<name>@<version>
// 例: npm install vue@3.2.37

安装指定指定版本范围内的模块

npm install [<@scope>/]<name>@<version range>
// 例: npm install vue@">=2.0.0 < 3.0.0"

安装指定模块的指定标签 默认值为(@latest)

npm install [<@scope>/]<name>@<tag>
// 例: npm install vue@legacy

通过Github代码库地址安装

npm install <tarball url>
// 例:npm install git://github.com/package/path.git
```

- --save（-S）

  `dependencies`中记录的都是项目在运行时需要的文件。
  在npm之前的版本中，需要使用--save来将依赖信息存入到`dependencies`中；`npm@5+`不写--save 也会把信息记录到 `dependencies`中。

- --save-dev（-D）

  `devDependencies`中记录的都是项目在开发时需要的文件，但在项目最终运行时不需要。
  使用命令`--save-dev`则会把信息记录到`devDependencies`中。

### npm uninstall 卸载模块

```shell
// 卸载当前项目或全局模块
npm uninstall <name>
```

### npm update 更新模块

```shell
// 升级当前项目或全局的指定模块
npm update <name>
// 简写：npm up
```

### npm list 查看模块

读取package.json里面的配置单安装

```shell
npm list
// 简写：npm ls
```

### npm link 引用模块

引用依赖 有些包是全局安装了，在项目里面只需要引用即可。

```shell
npm link [<@scope>/]<pkg>[@<version>]
// 例: 引用 npm link gulp gulp-ssh gulp-ftp
// 解除引用 npm unlink gulp
```

### npm run 执行脚本

`package.json`的`scripts`字段，可以用于指定脚本命令，供`npm`直接调用。`npm run`会创建一个`shell`，然后在`shell`中执行指定的命令。
如果不加任何参数，直接运行，会列出`package.json`里面所有可以执行的脚本命令。

#### pre-和post-两个钩子（hook）

`npm`会先查看有没有定义`pre-`和`post-`两个钩子，如果有的话，就会
先执行`npm run pre-命令名`，然后执行`npm run 命令名`，最后执行`npm run post-命令名`。
例：当在项目中使用`pnpm`且不希望被其他人意外运行`npm install` 或 `yarn`时，为了防止开发人员使用其他的包管理器：

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

### npm publish 发布模块

```shell
// 登录，需已注册
npm login

// 发布
npm publish

// 取消发布
npm unpublish

// 移除版本
npm deprecate <package-spec> <message>
```

## package.json 属性说明

- `name` - 包名。
- `version` - 包的版本号。
- `description` - 包的描述。
- `homepage` - 包的官网 url 。
- `author` - 包的作者姓名。
- `contributors` - 包的其他贡献者姓名。
- `dependencies` - 依赖包列表。如果依赖包没有安装，npm会自动将依赖包安装在 node_modules 目录下。
- `devDependencies` - 开发依赖包列表。大部分同dependencies，但devDependencies一般是开发所要用到的依赖包。
- `repository` - 包代码存放的地方的类型。
- `main` - main 字段指定了程序的主入口文件require('moduleName')就会加载这个文件。这个字段的默认值是模块根目录下面的index.js。
- `keywords` - 关键字

## lockfile

lockfile文件描述了整颗依赖树，包含了特定版本的传递依赖（依赖嵌套）关系。
lockfile会锁定当前安装的每个依赖包的版本，当运行 npm install时，npm 会使用这些确切的版本。包管理器都有一些诸如适配和提取公共依赖版本、扁平化依赖的优化策略，lockfile的存在可节省计算时间，从而提升npm install的时间。
在npm@5+、yarn、pnpm中分别为package-lock.json、yarn.lock、pnpm-lock.yaml。
npm install时会写入依赖版本，npm update 时会更新lockfile中的依赖版本。

- 如果写入的是 〜0.13.0，则只更新补丁版本：即 0.13.1 可以，但 0.14.0 不可以。
- 如果写入的是 ^0.13.0，则要更新补丁版本和次版本：即 0.13.1、0.14.0、依此类推。
- 如果写入的是 0.13.0，则始终使用确切的版本。

## 依赖管理模式

### npm@1/2

使用 `npm@1/2` 安装依赖，`node_modules`文件夹会以递归的树形结构呈现，严格按照`package.json`结构以及次级依赖的`package.json`结构将依赖安装到它们各自的`node_modules`中，直到次级依赖不再依赖其它模块。
就像下面这样：

```
node_modules
├─ foo1
│   ├─ index.js
│   ├─ package.json
│   └─ node_modules
│       └─ bar
│           ├─ index.js
│           └─ package.json
└─ foo2
  ├─ index.js
    ├─ package.json
    └─ node_modules
        └─ bar
            ├─ index.js
            └─ package.json
```

这种嵌套结构的管理模式就产生了问题：

- 依赖层级太深，导致文件路径过长（在Windows系统下可能会出现一些问题）
- 依赖无法被共用，重复的包被安装，导致node_modules文件体积巨大，占用过多的磁盘空间

### npm@3+/yarn

从`npm@3`和`yarn`开始，都来通过扁平化依赖的方式来解决上面的这个问题，扁平化后的`node_modules`目录如下：

```
node_modules
├─ foo1
|   ├─ index.js
|   └─ package.json
├─ foo2
|   ├─ index.js
|   └─ package.json
└─ bar
    ├─ index.js
    └─ package.json
```

这种扁平化的管理模式又产生了新的问题：

- 幽灵依赖（Phantom dependencies）
  指的是在项目内可以引用未在`package.json`中定义的包。
  这可能会导致一些意想不到的错误，如：

  - 不兼容的版本（例如某一个 api 进行了重大更新）
  - 有可能会丢失依赖（某依赖不再依赖呈现在我们项目中的幽灵依赖）

- 依赖分身（doppelgangers）
  常见的问题：

  - 项目打包会将这些“重身”的依赖都进行打包，增加产物体积

  - 无法共享库实例，引用的得到的是两个独立的实例

  - 重复 TypeScript 类型，可能会造成类型冲突

    例：在实际开发中可能会出现这样的情景，假设`foo1`、`foo2`、依赖`lodash@3.6.0`，`bar`依赖 `lodash@4.5.0`，这时候会造成依赖冲突，解决冲突的方式会将对应的冲突包放到对应依赖目录的 `node_mudules`中，类似下面结构：

    ```
    node_modules
    ├─ lodash@4.5.0
    │   ├─ index.js
    │   └─ package.json
    ├─ foo1
    │   ├─ index.js
    │   ├─ package.json
    │   └─ node_modules
    │       └─ lodash@3.6.0
    │       ├─ index.js
    │       └─ package.json
    ├─ foo2
    │   ├─ index.js
    │   ├─ package.json
    │   └─ node_modules
    │       └─ lodash@3.6.0
    │         ├─ index.js
    │         └─ package.json
    └─ bar
        ├─ index.js
        └─ package.json
    ```

### pnpm

`pnpm` 代表 performant（高性能的）`npm`。

![性能对比，图片来自于https://pnpm.io/benchmarks](https://pnpm.io/img/benchmarks/alotta-files.svg)

默认创建了一个非平铺的`node_modules`目录，因此在代码内无法访问任意包。
主要是采用硬链接和软链接的方式，提高了安装速度、节约了磁盘空间、避免了依赖分身和幽灵依赖的问题。

```
node_modules
├─foo --> ./.pnpm/foo@1.0.0/node_modules/foo
└─.pnpm
├─ bar@1.0.0
│ └─ node_modules
│ └─ bar ==> <store>/bar
└─ foo@1.0.0
└─ node_modules
├─ foo ==> <store>/foo
└─ bar --> ../../bar@1.0.0/node_modules/bar
```

#### 软链接（symbolic link）

默认情况下，pnpm使用软链的方式将项目的直接依赖添加进模块文件夹的根目录。

软链接可以理解为快捷方式，pnpm在引用依赖时通过符号链接去找到.pnpm目录下的依赖地址。

#### 硬链接（hard link）

pnpm创建从全局存储（一般都是user/.pnpm-store/v3/files）到项目下node_modules文件夹的硬链接，保证了相同的包不会被重复下载，从而提高安装速度并节约磁盘空间。
在命令行中输入pnpm config set store-dir D:/.pnpm-store即可将全局存储位置设置到你想要的位置，以避免占用你C盘的空间。
硬链接可以理解为对文件指针的复制，与链接的指向同一个数据块，所以不会重复占用磁盘空间。
使用 pnpm store prune 命令可以删除全局存储中不再被引用的包。

## nrm

`nrm`(npm registry manager)是`npm`的镜像源管理工具，有时候国外资源太慢，使用这个就可以快速地在`npm`源间切换。

### 安装

```shell
npm install nrm -g
```

#### 使用

`nrm ls`查看可选的源，带`*`的是当前使用的源。
更多具体的使用说明可查看其npm仓库。
**注**：最新版本的nrm有bug，会不显示`*`，可在`node_global/node_modules/nrm/cli.js`中修改以下代码：

```javascript
function onList() {
  getCurrentRegistry((cur) => {
    const info = ['']
    const allRegistries = getAllRegistry()
    const keys = Object.keys(allRegistries)
    const len = Math.max(...keys.map((key) => key.length)) + 3
    Object.keys(allRegistries).forEach((key) => {
      const item = allRegistries[key]

      /** 修改此处代码：将&&改为|| */
      const prefix = item[FIELD_IS_CURRENT]
        || equalsIgnoreCase(item.registry, cur)
        ? '* '
        : '  '
      /** 修改此处代码 */

      info.push(prefix + key + line(key, len) + item.registry)
    })

    info.push('')
    printMsg(info)
  })
}
```

## 其他包管理器

### cnpm

`cnpm`是个中国版的`npm`，是淘宝团队定制的命令行工具，本质上是一个指向国内镜像的`npm`，同时采用了和 `npm` 不一样的缓存目录和用户配置目录，避免与`npm`冲突。
原因：因为`npm`安装插件是从国外服务器下载，受网络影响大，可能出现异常，所以淘宝团队做了一个镜像。

### [ni](https://github.com/antfu-collective/ni)

可以理解为包管理器的管理器，`ni`假设您使用`lockfile`（应该使用），在它运行之前，它会检测你的 `yarn.lock` / `pnpm-lock.yaml` / `package-lock.json` 以了解当前的包管理器，并运行相应的命令。

### [Bun](https://bun.sh/)

`bun`是一个用`zig`编写的JavaScript运行时，不同于`node`和`deno`，它是扩展自 `jsCore`的，内置了打包器、转译器、任务运行器和包管理器，声称其包管理器的效率比`pnpm`还快，目前仍处于Beta测试版。

### [volt](https://github.com/dimensionhq/volt)

`volt`是用`rust`语言开发的包管理器，目前仍处于开发阶段。

# 简单区块链 - 用户注册功能

这是一个用JavaScript实现的简单区块链，目前支持用户注册功能，并包含一个Web界面的区块链浏览器。

## 功能特性

- ✅ 基础区块链结构（区块、哈希、链式存储）
- ✅ 用户注册功能
- ✅ 区块链完整性验证
- ✅ RESTful API接口
- ✅ Web区块链浏览器
- ✅ 搜索功能（用户、区块）

## 项目结构

```
simple-blockchain/
├── blockchain.js          # 区块链核心实现
├── server.js             # API服务器
├── public/
│   └── index.html        # 区块链浏览器前端
├── package.json          # 项目依赖
└── README.md            # 项目说明
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

```bash
# 生产模式
npm start

# 开发模式（自动重启）
npm run dev
```

### 3. 访问区块链浏览器

打开浏览器访问：`http://localhost:3001`

### 4. 测试区块链功能

```bash
# 运行区块链演示
npm test
```

## API接口

服务器运行在 `http://localhost:3001`，提供以下API接口：

### 基础信息
- `GET /api/info` - 获取区块链基本信息
- `GET /api/validate` - 验证区块链完整性

### 区块相关
- `GET /api/blocks` - 获取所有区块
- `GET /api/block/:index` - 获取指定索引的区块

### 用户相关
- `GET /api/users` - 获取所有用户
- `GET /api/user/:username` - 根据用户名查找用户
- `POST /api/users` - 添加新用户

### 搜索功能
- `GET /api/search/:query` - 搜索用户或区块

## 使用示例

### 添加用户（API）

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "张三", "email": "zhangsan@example.com"}'
```

### 查询区块链信息

```bash
curl http://localhost:3001/api/info
```

## 技术实现

### 区块结构
```javascript
{
  index: 0,           // 区块索引
  timestamp: Date.now(), // 时间戳
  data: {},           // 区块数据
  previousHash: "...", // 前一区块哈希
  hash: "..."         // 当前区块哈希
}
```

### 用户结构
```javascript
{
  id: "...",          // 用户唯一ID
  username: "张三",    // 用户名
  email: "...",       // 邮箱
  createdAt: "..."    // 创建时间
}
```

## 区块链浏览器功能

Web界面提供以下功能：

1. **概览页面** - 显示区块链基本统计信息
2. **区块页面** - 查看所有区块列表
3. **用户页面** - 管理和查看用户列表
4. **搜索页面** - 搜索用户和区块

## 安全特性

- SHA-256哈希算法确保数据完整性
- 区块链完整性验证
- 用户名和邮箱唯一性检查
- 输入验证和错误处理

## 扩展计划

未来可以添加的功能：
- [ ] 转账功能
- [ ] 数字签名
- [ ] 挖矿机制
- [ ] P2P网络
- [ ] 持久化存储
- [ ] 更多用户信息字段

## 开发环境

- Node.js >= 14.0.0
- npm >= 6.0.0

## 依赖包

- `express` - Web服务器框架
- `cors` - 跨域资源共享
- `crypto` - Node.js内置加密模块

## 许可证

MIT License

## 贡献

欢迎提交问题和改进建议！

## 演示截图

### 区块链浏览器主界面
- 概览页面显示区块链统计信息
- 实时验证区块链完整性
- 友好的用户界面设计

### 如何运行

1. 克隆仓库：
```bash
git clone https://github.com/yqq-a/simple-blockchain.git
cd simple-blockchain
```

2. 安装依赖并启动：
```bash
npm install
npm start
```

3. 访问 `http://localhost:3001` 查看区块链浏览器

## 技术亮点

- **纯JavaScript实现**：使用Node.js原生crypto模块
- **模块化设计**：清晰的代码结构，易于扩展
- **完整的Web界面**：包含前端浏览器和后端API
- **实时数据**：支持实时查看区块链状态
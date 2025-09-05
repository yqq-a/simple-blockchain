const express = require('express');
const cors = require('cors');
const { SimpleBlockchain } = require('./blockchain');

const app = express();
const port = 3001;

// 创建区块链实例
const blockchain = new SimpleBlockchain();

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static('public'));

// API路由

// 获取区块链基本信息
app.get('/api/info', (req, res) => {
    res.json(blockchain.getBlockchainInfo());
});

// 获取所有区块
app.get('/api/blocks', (req, res) => {
    const blocks = blockchain.getAllBlocks().map(block => ({
        index: block.index,
        timestamp: block.timestamp,
        hash: block.hash,
        previousHash: block.previousHash,
        data: block.data,
        formattedTime: new Date(block.timestamp).toLocaleString()
    }));
    res.json(blocks);
});

// 根据索引获取区块
app.get('/api/block/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const block = blockchain.getBlockByIndex(index);
    
    if (!block) {
        return res.status(404).json({ error: '区块不存在' });
    }
    
    res.json({
        ...block,
        formattedTime: new Date(block.timestamp).toLocaleString()
    });
});

// 获取所有用户
app.get('/api/users', (req, res) => {
    res.json(blockchain.getAllUsers());
});

// 根据用户名查找用户
app.get('/api/user/:username', (req, res) => {
    const user = blockchain.getUserByUsername(req.params.username);
    
    if (!user) {
        return res.status(404).json({ error: '用户不存在' });
    }
    
    res.json(user);
});

// 添加新用户
app.post('/api/users', (req, res) => {
    try {
        const { username, email } = req.body;
        
        if (!username || !email) {
            return res.status(400).json({ error: '用户名和邮箱不能为空' });
        }
        
        const newUser = blockchain.addUser(username, email);
        res.status(201).json({
            success: true,
            user: newUser,
            message: '用户创建成功'
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
});

// 验证区块链
app.get('/api/validate', (req, res) => {
    res.json({
        isValid: blockchain.isChainValid(),
        message: blockchain.isChainValid() ? '区块链完整性验证通过' : '区块链已被篡改'
    });
});

// 搜索功能（支持用户名、用户ID、区块索引）
app.get('/api/search/:query', (req, res) => {
    const query = req.params.query;
    const results = {
        users: [],
        blocks: [],
        type: null
    };
    
    // 搜索用户
    const userByUsername = blockchain.getUserByUsername(query);
    if (userByUsername) {
        results.users.push(userByUsername);
        results.type = 'user';
    }
    
    const userById = blockchain.getUserById(query);
    if (userById && !results.users.includes(userById)) {
        results.users.push(userById);
        results.type = 'user';
    }
    
    // 搜索区块（按索引）
    const blockIndex = parseInt(query);
    if (!isNaN(blockIndex)) {
        const block = blockchain.getBlockByIndex(blockIndex);
        if (block) {
            results.blocks.push({
                ...block,
                formattedTime: new Date(block.timestamp).toLocaleString()
            });
            results.type = results.type ? 'mixed' : 'block';
        }
    }
    
    if (results.users.length === 0 && results.blocks.length === 0) {
        return res.status(404).json({ error: '未找到相关结果' });
    }
    
    res.json(results);
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`区块链API服务器运行在 http://localhost:${port}`);
    console.log(`API文档:`);
    console.log(`  GET  /api/info          - 获取区块链信息`);
    console.log(`  GET  /api/blocks        - 获取所有区块`);
    console.log(`  GET  /api/block/:index  - 获取指定区块`);
    console.log(`  GET  /api/users         - 获取所有用户`);
    console.log(`  GET  /api/user/:name    - 获取指定用户`);
    console.log(`  POST /api/users         - 添加新用户`);
    console.log(`  GET  /api/validate      - 验证区块链`);
    console.log(`  GET  /api/search/:query - 搜索功能`);
    
    // 添加一些演示用户
    try {
        blockchain.addUser('演示用户1', 'demo1@example.com');
        blockchain.addUser('演示用户2', 'demo2@example.com');
        console.log('\n已添加演示用户，当前用户数量:', blockchain.getAllUsers().length);
    } catch (error) {
        console.error('添加演示用户失败:', error.message);
    }
});
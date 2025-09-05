const crypto = require('crypto');

// 区块类
class Block {
    constructor(index, timestamp, data, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data))
            .digest('hex');
    }
}

// 用户类
class User {
    constructor(username, email) {
        this.id = this.generateUserId();
        this.username = username;
        this.email = email;
        this.createdAt = new Date().toISOString();
    }

    generateUserId() {
        return crypto.createHash('sha256')
            .update(Math.random().toString() + Date.now().toString())
            .digest('hex').substring(0, 16);
    }
}

// 简单区块链类
class SimpleBlockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.users = [];
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "创世区块", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // 添加新用户
    addUser(username, email) {
        // 检查用户名是否已存在
        if (this.users.find(user => user.username === username)) {
            throw new Error('用户名已存在');
        }

        // 检查邮箱是否已存在
        if (this.users.find(user => user.email === email)) {
            throw new Error('邮箱已存在');
        }

        const newUser = new User(username, email);
        this.users.push(newUser);

        // 创建新区块记录用户注册
        const blockData = {
            type: 'USER_REGISTRATION',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        };

        this.addBlock(blockData);
        return newUser;
    }

    addBlock(data) {
        const latestBlock = this.getLatestBlock();
        const newBlock = new Block(
            latestBlock.index + 1,
            Date.now(),
            data,
            latestBlock.hash
        );
        this.chain.push(newBlock);
    }

    // 验证区块链完整性
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    // 获取所有用户
    getAllUsers() {
        return this.users;
    }

    // 根据用户名查找用户
    getUserByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    // 根据ID查找用户
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    // 获取区块链信息
    getBlockchainInfo() {
        return {
            totalBlocks: this.chain.length,
            totalUsers: this.users.length,
            isValid: this.isChainValid(),
            latestBlock: this.getLatestBlock()
        };
    }

    // 获取所有区块
    getAllBlocks() {
        return this.chain;
    }

    // 根据索引获取区块
    getBlockByIndex(index) {
        return this.chain[index];
    }
}

// 使用示例
const myBlockchain = new SimpleBlockchain();

console.log('=== 简单区块链演示 ===');
console.log('初始区块链信息:', myBlockchain.getBlockchainInfo());

try {
    // 添加用户
    console.log('\n--- 添加用户 ---');
    const user1 = myBlockchain.addUser('张三', 'zhangsan@email.com');
    console.log('添加用户成功:', user1);

    const user2 = myBlockchain.addUser('李四', 'lisi@email.com');
    console.log('添加用户成功:', user2);

    const user3 = myBlockchain.addUser('王五', 'wangwu@email.com');
    console.log('添加用户成功:', user3);

    // 显示所有用户
    console.log('\n--- 所有用户列表 ---');
    console.log(myBlockchain.getAllUsers());

    // 显示区块链信息
    console.log('\n--- 区块链信息 ---');
    console.log(myBlockchain.getBlockchainInfo());

    // 显示所有区块
    console.log('\n--- 所有区块 ---');
    myBlockchain.getAllBlocks().forEach((block, index) => {
        console.log(`区块 ${index}:`, {
            index: block.index,
            timestamp: new Date(block.timestamp).toLocaleString(),
            hash: block.hash.substring(0, 10) + '...',
            previousHash: block.previousHash.substring(0, 10) + '...',
            data: block.data
        });
    });

    // 验证区块链
    console.log('\n--- 区块链验证 ---');
    console.log('区块链是否有效:', myBlockchain.isChainValid());

} catch (error) {
    console.error('错误:', error.message);
}

module.exports = { SimpleBlockchain, User, Block };
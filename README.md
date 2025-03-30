# solana-learn

## Favorites 合约

[查看合约源码 →](./favorites)

这是一个使用 Solana 和 Anchor 框架开发的智能合约示例，演示了如何使用 PDA（Program Derived Address）来存储用户的收藏信息。

### 功能概述

该合约允许用户存储他们最喜欢的数字和颜色。每个用户的收藏信息存储在一个唯一的 PDA 中，该 PDA 是通过用户的公钥派生的。

### 技术特点

- **Anchor 框架**: 使用 Anchor 框架简化 Solana 程序开发
- **PDA 存储**: 展示了如何创建和使用 Program Derived Address
- **账户初始化**: 使用 `init_if_needed` 特性，允许账户在不存在时自动创建
- **数据结构**: 定义了带有字段大小限制的账户数据结构


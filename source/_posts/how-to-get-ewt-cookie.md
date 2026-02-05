---
title: 如何获取升学E网通的cookie
date: 2022-08-07 21:52:51
tags:
  - 教程
categories:
  - 教程
  - 软件
---
# 准备工作

1.非国产浏览器,如微软的Edge（推荐！！）谷歌的Google Chrome 和火狐
2.脑子和手
3.5分钟的时间

PS：别再用如360安全/极速浏览器、QQ浏览器、2345浏览器等国产浏览器了，这些东西纯属来恶心人。用了上面几个浏览器后你就知道了doge

![image](/image/0a88275eaae91de6e22c993c4ec67c9c.png)

# 开始教程

1.打开升学E网通并登录

2.登录后在任意界面按下键盘上的F12键打开开发者工具（国产浏览器都没这东西）

![image](/image/0460bb23479f2114d259728156f79dcf.jpg)

### Edge浏览器操作（Google Chrome的在下面）
3.点击+号
![image](/image/1e4cc45478f185fd95a01e573567a48d.png)

4.点击 应用程序
![image](/image/b633031437a3b0556a42178eed428470.png)

5.在储存中找到 Cookie 并展开
![image](/image/919f6a9f4f52f4279150217d5a884022.png)

6.找到 ewt_user 和 user 两项并在下方（Cookie Value框）复制其中的值

恭喜你已经获取到API需要的cookie了
![image](/image/759f6541a99038a9fe281b8f23cf0380.png)

### Google Chrome教程
3.F12打开开发者工具后迎面来的就是一堆英文（如果已经是中文当我没说），不要慌！点击上方切换成中文
![image](/image/895cde116da7042cbdadf8a2b73397be.png)

4.点击 应用
![image](/image/84ce6888fb98648d1790337ed4d61875.png)

5.接下来的操作就和Edge的5、6步一样啦~

## 关于安全性
### 问：这玩意需要我的cookie会造成盗号吗？
答：不会，账号的登录状态信息是记录在cookie的 token（令牌） 项上的（大部分网站也是如此）我们只需要cookie中 ewt_user 和 user 两项 您可尝试删除除了 ewt_user 和 user 的所有cookie或只删掉 ewt_user 和 user 刷新界面来查看登录状态.

```
sudo tee /etc/apt/sources.list.d/rocm.list <<'EOF'
deb [arch=amd64 signed-by=/etc/apt/keyrings/rocm.gpg] https://repo.radeon.com/rocm/apt/debian jammy main
EOF
echo -e 'Package: *\nPin: release o=repo.radeon.com\nPin-Priority: 600' | sudo tee /etc/apt/preferences.d/rocm-pin-600

```


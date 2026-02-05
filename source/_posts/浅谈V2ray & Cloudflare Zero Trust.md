---
title: 浅谈V2rayN & Cloudfare Zero Trust
date: 2023-12-09
tags:
  - GFW
  - 教程
  - 软件分享
cover: /image/79731173_p0.jpg.png
cssclasses:
  - 软件
  - 白嫖
---
# 前言
去年11月份介绍过通过使用 Cloudflare CDN 以达到绕过GFW的方法，但该方法特别挑网站同时效果也不怎么好，本期我们来详细讲讲这个GFW该如何翻~

:::danger
警告! 严禁使用该方法访问非法网站! 严禁使用该方法访问对国家安全造成危害的网站! 
:::

# 原理
关于绕过GFW的网络封锁的原理实际上非常简单，其本质就是通过一个非GFW黑名单的服务器作为中枢进行流量中转，即代理服务器

:::tip 
实际上绕过GFW的工具≠VPN
从VPN的全称:虚拟专用网络 也可以看出其绕过原理是建立跨国大内网XD
:::

# 正片

## 1.V2ray & Xray
[V2ray](https://www.v2fly.org/)和 [Xray](https://github.com/XTLS/Xray-core)实际上都指的是其核心Core
Xray 是由 V2ray 部分开发人员与V2ray闹掰后建立的新分支，正常来说Xray各方面表现会比V2ray好
作为使用者的我们无需关心这些细节，事实上我们使用的是以其为基础的第三方GUI发行版

### V2rayN的安装与基础使用
[V2rayN](https://github.com/2dust/v2rayN)是由[2dust](https://github.com/2dust/v2rayN/commits?author=2dust "View all commits by 2dust")维护的 [Xray core](https://github.com/XTLS/Xray-core) 、 [v2fly core](https://github.com/v2fly/v2ray-core) 和 [others core](https://github.com/2dust/v2rayN/wiki/List-of-supported-cores)的第三方Windows GUI发行版，对于Android系统可以使用该大佬的另一个项目[v2rayNG](https://github.com/2dust/v2rayNG)

来到项目地址，这边直接无脑点Releases下载最新发行版

![](image/Pasted%20image%2020240721091020.png)

选择v2rayN-With-Core.zip

![](image/Pasted%20image%2020240721091044.png)

下载后解压到任意文件夹如D盘根目录，运行v2rayN.exe
第一运行可能会要求你下载- [Microsoft .NET 6.0 Desktop Runtime](https://download.visualstudio.microsoft.com/download/pr/513d13b7-b456-45af-828b-b7b7981ff462/edf44a743b78f8b54a2cec97ce888346/windowsdesktop-runtime-6.0.15-win-x64.exe)运行环境，按照提示下载即可
![](image/Pasted%20image%2020231209172246.png)

诺运行成功则可以看到系统托盘上出现V2rayN的图标
![](image/Pasted%20image%2020231209172456.png)

打开后我们发现并没有服务器，我们需要自行添加代理服务器
![](image/Pasted%20image%2020231209172604.png)

这里分享几个可以白嫖节点的仓库:
[aiboboxx/v2rayfree: v2ray节点、免费节点、免费v2ray节点、最新公益免费v2ray节点订阅地址、免费v2ray节点每日更新、免费ss/v2ray/trojan节点、freefq (github.com)](https://github.com/aiboboxx/v2rayfree)

[freefq/free: 翻墙、免费翻墙、免费科学上网、免费节点、免费梯子、免费ss/v2ray/trojan节点、蓝灯、谷歌商店、翻墙梯子 (github.com)](https://github.com/freefq/free)

复制仓库中的节点链接到V2rayN就能成功导入服务器了
![](image/Pasted%20image%2020231209173218.png)![](image/Pasted%20image%2020231209173338.png)

如果不想每次都去仓库更新节点可以使用其订阅链接
![](image/Pasted%20image%2020231209173521.png)
![](image/Pasted%20image%2020231209173609.png)![](image/Pasted%20image%2020231209173659.png)

![](image/Pasted%20image%2020231209173727.png)
这样就不用每次都手动去仓库更新了

拿到节点后我们需要对其测试 Ctrl + A 键全选所有节点 再 Ctrl + E 多线程测试所有节点
![](image/Pasted%20image%2020231209205656.png)

:::tip 
测速为-1不一定是不能用，有些节点并不允许测试
:::

:::tip
免费的节点速度基本堪忧（毕竟是免费的）
:::

选择一个合适的节点（Enter）
然后选择自动配置系统代理
![](image/Pasted%20image%2020231209210425.png)

大功告成，现在可以尝试访问Google啦

## 2.Clash
一个使用Go语言编写的代理核心，其因GUI发行版有极其现代化的UI与优秀的分流 受许多人的追捧
但支持的协议有限如kcp

:::danger
受 Clash for Windows 作者身份暴露后删库所影响 Clash 除 Clash for Android外均删库跑路（悲）![](image/Pasted%20image%2020231209212046.png)
![](image/Pasted%20image%2020231209212446.png)
:::

## 3.Cloudfare Warp & Zero Trust
### Warp
Warp是Cloudfare在2018年推出免费VPN服务
#### Warp安装
1. 打开 [https://1.1.1.1](https://1.1.1.1/) 或 [https://one.one.one.one](https://one.one.one.one/) （均需要梯子），选择适合自己平台的客户端下载
2. 安装过程大同小异，直接无脑安装就可以了

#### Warp运行
正常情况下直接连接即可，但部分地产可能会被GFW阻断，这是先挂一次梯子即可

Warp我们只简单过以下，主要是讲Zero Trust

:::tip 
Warp有许多的限制如带宽和流量限制而Zero Trust则无视这些限制
:::
### Zero Trust
Zero Trust是 Cloudfare Warp 的团队版，不限流量和带宽，是理想的梯子替代品

:::tip 
Zero Trust Free计划唯一的限制是每个账号最多50台设备
:::
#### 准备材料
Cloudfare账号一枚（毕竟是Cloudfare提供的服务，很容易的只需要一个邮箱）

#### 申请步骤
1. 打开Cloudfare仪表盘[https://dash.cloudflare.com/](https://dash.cloudflare.com/)登录自己的Cloudfare账号，在侧边栏中选择Zero Trust
![](image/Pasted%20image%2020231209214431.png)
2. 输入团队名称（不建议随便取），点击“Next”
3. 选择Free计划
![](image/Pasted%20image%2020231209214905.png)
4. 无脑下一步“Proceed to payment” ![](image/Pasted%20image%2020231209215227.png)
5. 这里会要求我们提供信用卡，不要急接下来就是卡Cloudfare BUG
![](image/Pasted%20image%2020231209215409.png)
6. 新开一个界面来的Zero Trust的主界面 退出登录（包括Cloudfare仪表盘也要退出登录）![](image/Pasted%20image%2020231209215525.png)
7. 重新登录进入Zero Trust界面，依次点击左侧栏的“My Team”→“Devices”，点击蓝色的“Connect a device”按钮
 ![这里因为我之前操作过所以上misaka的图](image/Pasted%20image%2020231209215758.png)
6.  输入邮箱后缀（例如，s输入邮箱后缀（例如，support@outlook.com，其后缀为@outlook.com）待会登录要使用相应后缀的邮箱登录，然后点击“Save”保存即可
 ![](image/Pasted%20image%2020231209215923.png)

:::danger
该方法会造成无法管理设备所以请不要泄露你的组织名称以及邮箱后缀，以免变成肉便器
:::

7. 打开客户端设置
 ![](image/Pasted%20image%2020231209220420.png)
8. 依次选择 账户- 使用Cloudflare Zero Trust登录![](image/Pasted%20image%2020231209220511.png)
9. 输入刚刚设置的组织名称
![](image/Pasted%20image%2020231209220629.png)
10. 会跳转到登录界面,输入包含刚刚填写后缀的邮箱如mczhicheng@outlook.com![](image/Pasted%20image%2020231209220746.png)
12. 输入邮箱验证码![](image/Pasted%20image%2020231209221118.png)
13. 按照提示打开客户端 ![](image/Pasted%20image%2020231209221222.png)
14. 大功告成
 ![](image/Pasted%20image%2020231209221259.png)
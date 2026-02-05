---
title: 如何不使用科学上网工具直连访问受限网站
date: 2022-11-06 11:53:51
tags:
  - 教程
cover: /image/79731173_p0.jpg.png
cssclasses:
  - 软件
---
# 前言

又到了一年一度的敏感期，各大梯子供应商该跑的跑，暂停服务的暂停服务，再加上HAX最近不知道发生什么其节点整天爆炸，真的是太难熬了。正好看到隔壁萌幻通过CF的CDN加速解决了被墙的问题于是研究了一下，便有了这篇文章。


:::danger
警告! 严禁使用该方法访问非法网站! 严禁使用该方法访问对国家安全造成危害的网站! 
:::

:::danger
似乎有部分地区已经以反诈为借口屏蔽了 Cloudflare CDN 所有 IP 段？
[#217](https://github.com/XIU2/CloudflareSpeedTest/issues/217) [#188](https://github.com/XIU2/CloudflareSpeedTest/issues/188)
:::


# 原理
通过软件优选 Cloudflare 公开了所有IP 段，并更改Hosts文件。
具体请看：
[GitHub - XIU2/CloudflareSpeedTest: 🌩「自选优选 IP」测试 Cloudflare CDN 延迟和速度，获取最快 IP (IPv4 / IPv6)！另外也支持其他 CDN / 网站 IP ~](https://github.com/XIU2/CloudflareSpeedTest)

注：该方法自适用于启用了Cloudflare CDN加速的网站


# 快速入门
## 1.下载&安装软件
前往Github下载最新版本的[CloudflareSpeedTest][GitHub - XIU2/CloudflareSpeedTest: 🌩「自选优选 IP」测试 Cloudflare CDN 延迟和速度，获取最快 IP (IPv4 / IPv6)！另外也支持其他 CDN / 网站 IP ~](https://github.com/XIU2/CloudflareSpeedTest)
解压到任意文件夹


:::tip Github无法访问?

国内官方蓝奏云镜像
[CloudflareSpeedTest (lanzouv.com)](https://pan.lanzouv.com/b0742hkxe)

:::



![image](/image/20221222_162909.png)

## 2.运行前准备
解压完后先不要运行软件，打开资源管理器转到
```
C:\Windows\System32\drivers\etc
```

打开hosts文件

在hosts添加将要访问的网站url
格式为:
```
IP + URL
```

这里以Iwara为例:
```
127.0.0.1 iwara.tv
127.0.0.1 www.iwara.tv
```


:::tip 关于IP填写问题

IP填写随便这里以127.0.0.1为例。
- 请记住你填写的IP
- 请输入正确格式的IP格式

:::

## 3.运行
进入软件目录，我们发现有3个可执行文件
分别为:
 - CloudflareST.exe - 软件本体
 - cfst_hosts.bat - hosts模式bat批处理文件
 - cfst_3proxy.bat - 代理模式bat批处理文件

:::tip 关于cfst_3proxy.bat

需要安装3proxy.exe，不需要一个个输入hosts
但经过实测兼容性不足，仅在小部分（知名）使用CF的CDN网站有效
不推荐
具体方法:[还在一个个添加 Hosts？完美本地加速所有使用 Cloudflare CDN 的网站方法来了！ · Discussion #71 · XIU2/CloudflareSpeedTest (github.com)](https://github.com/XIU2/CloudflareSpeedTest/discussions/71)

:::

这里我们运行cfst_hosts.bat
![image](/image/20221222_165955.png)

输入刚刚编辑hosts文件填入的IP
这里以127.0.0.1为例

输入完后会进入测速阶段，稍作等待即可

:::tip 关于线程数设置

如果觉得测速速度较慢，可以通过编辑cfst_3proxy.bat修改启动参数来设置线程数，来提升速度
![image](/image/20221222_170359.png)
设置方法:
```
-n [线程数,默认200最高1000]
```

:::

## 4.完成!
测试完成后检查IP地址中第一行的下载速度是否正常(7MB/s+)，如果速度过低请重新运行批处理脚本
![image](/image/20221222_170834.png)

如果一切正常的话，那么Hosts将会被自动修改
![image](/image/20221222_171318.png)

## 5.访问测试
现在尝试通过浏览器访问iwara.tv

:::tip

必要时可以通过Ctrl+F5来刷新浏览器缓存

:::

![image](/image/20221222_172813.png)



# 进阶(必看!!!)


现在我们已经可以访问到iwara.tv，但是我们发现iwara.tv的图片并不能加载出来

如图:
![image](/image/20221222_172813.png)

## 1.通过F12开发者工具手动逐条添加

通过F12打开开发者工具分析，我们发现I站的图片是通过i.iwara.tv这个域名来请求的
![image](/image/20221222_173318.png)

这下事情就变得简单了，将i.iwara.tv添加到Hosts文件即可
如图:
![image](/image/20221222_173705.png)

刷新网页，图片正常显示
![image](/image/20221222_171708.png)

对于视频也是如此,将域名添加至hosts文件
![image](/image/20221222_175006.png)


## 2.通过第三方网站解析子域，实现批量添加
很显然，上面的方法过于繁琐且效率低下，接下来我们将使用更暴力的方法

访问[查子域](https://chaziyu.com)
输入主域名点击 查子域名 等待即可

![image](/image/20221222_175557.png)
将查询到的子域名添加到Hosts即可

# 最后
如果感觉速度不行或出现无法访问的情况请重新运行批处理脚本刷新CDN加速IP
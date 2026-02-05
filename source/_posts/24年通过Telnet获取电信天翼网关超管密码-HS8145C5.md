---
title: 24年通过Telnet获取电信天翼网关超管密码-HS8145C5
date: 2024-2-6 12:40:00
tags:
  - 网络
  - 硬件
  - 光猫
feature: false
cssclasses:
  - 软件
  - 硬件
cover: /image/cover20240207.png
---
# 1 前言
家里用的是中国电信诈骗的网自然也是用它的光猫 型号版本为**HS8145C5 V5.19.C20S050**
之前超管的密码一直都是默认的``nE7jA%5m``，结果24年开年没多久突然想登超管后台看一下日志排查问题，结果发现被下发配置了，密码被改了（我TM谢谢你中国电信）于是踏上了get password的旅程😅
网上的方法有很多，比如经典的**F12**大法，以及**BurpSuite**抓改包USB欺骗大法，但毕竟是BUG，~~BUG就TM的活不久~~，基本上都被Fixed了(
不过天灾(BUG)是天灾，人祸就是另一回事了，那么我们的入手点就来到了亲爱的Dev留下的BackDoor(Telnet)上了喵😋
接下来我们将通过Huawei内部工具通过Telnet获取超管密码。

# 2 准备工作
## 2.1 系统准备
以Win11为例:
依此打开设置->系统->可选功能->(相关设置)更多Windows功能

分别启用Telnet 客户端 和 TFTP 客户端，如下图
![](image/Pasted%20image%2020240205221119.png)

## 2.2 软件准备
### 2.2.1 华为ONT相关工具 
[原链(百度网盘)](https://pan.baidu.com/s/1NYNVbRhDkHNv-3enw7V8Bw)  提取码:brpa 感谢相随666大佬的整理 [存档](https://pan.baidu.com/s/1JvsiVqDoSH9KSmHAaQ0A0Q?pwd=brpa)
下载图下俩个即可:
	![](image/Pasted%20image%2020240205224343.png)
### 2.2.2 Tftpd64
访问[phjounin / tftpd64 / wiki / Download Tftpd64 — Bitbucket](https://bitbucket.org/phjounin/tftpd64/wiki/Download%20Tftpd64)根据需要下载x64或x86版本，当然也可以使用上面百度网盘给出的版本
下载完以上的软件后我们运行Tftpd
第一项填待会文件保存的位置
第二项选择自己连接光猫的网卡
下方选择Tftp Server然后保持在后台不要关闭喵
![](image/04cdb29f1ae209a18ce77fe9f767b5e9.png)
# 3 开启Telnet
## 3.1 连接光猫
电脑连接光猫，中间可以过交换机，路由器没试过不知道行不行
<u>拔掉光猫的光纤!拔掉光猫的光纤!拔掉光猫的光纤!</u>，其他网线包括IPTV，还有电话线，确保只剩下连接电脑的那根线

## 3.2 查看光猫版本
查看光猫版本，浏览器打开光猫管理界面如`192.168.1.1:8080`输入光猫后面的密码进入有限的设置界面查看版本 如图为**V5.19.C20S050** 则光猫版本为**V5** 
	![](image/Pasted%20image%2020240206010244.png)

:::tip 
不要看光猫外壳上面写着3.0，4.0什么的，以上面获取的版本为准(踩坑😭)
:::
## 3.3 重启前准备
回到电脑 **win+r键** 输入 `cmd` 打开命令提示符 输入 `ping -t 192.168.1.1`(根据你光猫的IP填写，用于待会判断光猫什么时候重启完成)回车后可以看到在不停的ping路由器

打开华为ONT工具
根据刚刚获取到的版本选择使能模式，网卡选择连接光猫的网卡
![](image/Pasted%20image%2020240206011311.png)

## 3.4 重启光猫
接下来重启光猫，此时 命令提示符 那边会报 **连接超时** 
## 3.5 开启Telnet
等到 命令提示符 那边重新能ping到光猫后表明光猫重启完成，此时按下 ONT工具 中的 **启动** 开始开启光猫的 **Telnet** 

等到出现下图 **设备列表** 显示**Success**则开启成功，此时光猫指示灯长亮
![](image/Pasted%20image%2020240206110341.png)

:::tip 
如果一次不成功多试几次，重启一次可以进行2~3次
:::
## 3.6 再次重启
接着再重启光猫，等待光猫重启完成
# 4 通过Telnet连接光猫并获取权限
## 4.1 Telnet连接光猫
运行**cmd**或**PowerShell**，这里以Windows终端(PowerShell)为例
![](image/Pasted%20image%2020240206111144.png)

输入 `telnet 你光猫IP(如192.168.1.1)` 连接光猫
连接成功后显示
```
Welcome Visiting Huawei Home Gateway
Copyright by Huawei Technologies Co., Ltd.

Login:

```
## 4.2 登录光猫
**Login**即输入用户名这里输入`root`
接下来会要求输入**Password**输入`admin`或`adminHW`

:::tip
有些终端不一定显示你输入的密码，不用担心
不是没输到啊喂(

:::

输入密码后显示
```
Welcome Visiting Huawei Home Gateway
Copyright by Huawei Technologies Co., Ltd.

Login:root
Password:
WAP>
```

恭喜你已经进入光猫的终端，不过仅仅这样是不够的，我们还要进行提权操作😋
## 4.3 提权&进入shell
输入 `su` 进行提权提示 **success!** 后进入**SU_WAP**权限，接下来进行**补全shell**

输入 `shell` 显示
```
BusyBox v1.26.2 () built-in shell (ash)
Enter 'help' for a list of built-in commands.

profile close core dump
WAP(Dopra Linux) #

```

可以看到是基于**Dopra Linux**开发的，实际上到这一步我们就可以对光猫为所欲为了 ~~先来个rm -rf /\*~~ (你可别真去试啊😨)

:::danger
目前你已经拿到root权限这意味着接下来你 <u>必须</u> **小心谨慎**操作
数据无价，失手成砖
你已经被警告过了!
:::

# 5 通过Telnet&Tftp64获取光猫配置文件
## 5.1 进入目标文件夹
输入 `cd /mnt/jffs2`进入光猫配置存放文件夹
如果报错先 `cd /mnt` 进入**mnt**文件夹再输入 `ls` 查看当前目录下的文件夹与文件查找类似于**jffs2**的文件夹，`cd  文件夹名称`进去
![](image/Pasted%20image%2020240206120115.png)

进去后**hw_ctree.xml**就是我们要的文件😋![](image/Pasted%20image%2020240206120308.png)

## 5.2 下载配置文件
输入`tftp -p -l hw_ctree.xml 你电脑的ip(如192.168.1.26)`将**hw_ctree.xml**通过Tftp传输到电脑上
打开之前Tftp你设置的文件夹，发现**hw_ctree.xml**已经下载到电脑上了
直接打开会发现被加密成了二进制文件，强制打开也是乱码，我们需要对其解密
	![](image/Pasted%20image%2020240206121257.png)![](image/Pasted%20image%2020240206121326.png)
## 5.3 解密xml配置
打开由 欲断魂 大佬制作的解密工具，选择刚刚下载下来的文件，点击解密
![](image/Pasted%20image%2020240206121610.png)
## 5.4 获取telecomadmin密码
打开解密后的**hw_ctree.xml**
![](image/Pasted%20image%2020240206121750.png)
搜索`telecomadmin`可以看到后面跟着的Password，不过该密码依旧是加密的😅
![](image/Pasted%20image%2020240206122110.png)

## 5.5 解密密码
复制后面的密文丢到解密软件内，根据密文开头选择解密方式
![](image/Pasted%20image%2020240206122836.png)

解密得@!2^WzC2
![](image/Pasted%20image%2020240206122922.png)
# 6 登录测试&善后
用刚刚的密码进行测试
成功登录😋![](image/Pasted%20image%2020240206123125.png)

插上光纤、其他网线、IPTV和电话线重启光猫
可以在安全-ONT访问控制配置关闭Telnet
![](image/Pasted%20image%2020240206123350.png)
# 尾声
这次只是涉及获取密码所以只是下载配置，如果需要进行修改则需要将配置文件通过Tftp重新上传到光猫并用`cp`命令进行复制替换，具体操作可以去google or bing一下

题外话:最近老师那边丢过来一个竞赛刚好最近正在写的一个项目符合要求不过要改一下项目名称带Fuck可不行😋(
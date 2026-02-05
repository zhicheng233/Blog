---
title: 如何白嫖JetBrains系列软件
date: 2023-02-18 13:17:51
tags:
  - JetBrains
cover: /image/a1265432asd.png
cssclasses:
  - 白嫖
  - 软件
---
# 前言
JetBrains是一家专注于创建智能开发工具的前沿软件公司，他家的软件用一句话概括就是“JetBrains 出品，必属精品”
![JetBrains全家桶](image/Pasted%20image%2020230218141338.png)

但是羊毛来自羊身上，JetBrains的正版软件不是一般人能用得起的
![](image/Pasted%20image%2020230218142755.png)
虽然有香得不行的社区版，但能白嫖为什么不嫖呢？

目前能白嫖JetBrainsIDE的方法有两种
一种是官方白嫖，通过Github学生礼包进行白嫖
![通过学生礼包白嫖](image/Pasted%20image%2020230218144146.png)
PS：如果评论区有要求我会另外出一个关于Github学生礼包申请教程

另外一种则是通过破解软件，这也是本期重点。

:::danger
警告! 请勿在商业上使用破解版，或对破解后的版本进行二次分发！
本教程以及资源仅用于学习交流，请勿用于任何商业行为！
因无视以上条款使用导致的任何法律责任作者均不负责！
:::

# 准备  
1.JetBrains旗下的任意IDE，这里以PyCharm做演示
![](image/Pasted%20image%2020230218150852.png)
2.[Ja-netfilter(gitee)](https://gitee.com/ja-netfilter/ja-netfilter/releases/tag/2022.2.0)

:::tip 为什么是Gitee?
ja-netfilter的Github仓库被端了
![DMCA尸体](image/Pasted%20image%2020230218151247.png)
:::

ja-netfilter下载后解压到任意文件夹即可，我比较喜欢放在PyCharm安装位置。需要注意的是破解完后ja-netfilter不能删！ja-netfilter不能删！ja-netfilter不能删！否则会导致破解失效，所以请将ja-netfilter文件夹放在合理的地方
![](image/Pasted%20image%2020230218153011.png)

# 配置ja-netfilter
打开ja-netfilter文件夹下的config文件夹
接下来我们将对里面的文件进行修改

首先访问[JETBRA.IN CHECKER | IPFS](https://3.jetbra.in/)
稍等片刻，选择一个在线的节点
![](image/Pasted%20image%2020230218153817.png)
点击上方的 jetbra.zip 下载对应的配置文件
![](image/Pasted%20image%2020230218153855.png)
下载后打开将压缩包中的config-jetbrains文件夹里的文件解压复制到`ja-netfilter\config`文件夹内
![](image/Pasted%20image%2020230218154313.png)

plugins-jetbrains文件夹同理，复制到`plugins`文件夹
![](image/Pasted%20image%2020230218154503.png)

好的，jetbrains的配置就算完成了

# 配置JetBrains's IDE
打开PyCharm安装目录下的`bin`文件夹找到`pycharm64.exe.vmoptions`文件
![](image/Pasted%20image%2020230218155006.png)

:::tip 
JetBrains不同的IDE名字会不同但都是以 IDE程序exe名称+`.vmoptions`命名
如IDEA为`idea64.exe.vmoptions`
该文件为IDE启动参数(JetBrains的IDE均使用java编写)
可以修改运行内存等启动设置
:::

:::tip 注意
不同的版本或不同安装方式的IDE vmoptions位置可能会不一样
比如通过JetBrainsTool安装的PyCharm其vmoptions文件在`\PyCharm-P\ch-0`目录下 以 版本号+`.vmoptions`命名
如果不确定是哪个可以都进行修改
![](image/Pasted%20image%2020230218164134.png)
:::

使用任意编辑器打开这里以Sublime Text为例
![](image/Pasted%20image%2020230218160831.png)
添加以下内容并保存（#号的为注释）
```
# 最新 IDEA 版本需要添加下面两行，否则会报 key valid 
--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED
--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED


# 补丁的绝对路径（可根据你实际的位置进行修改）,注意路径一定要填写正确，且不能包含中文，否则会导致 IDEA 无法启动
-javaagent:G:\jetbrains\apps\PyCharm-P\ch-0\ja-netfilter\ja-netfilter.jar=jetbrains
```
![](image/Pasted%20image%2020230218172230.png)

:::tip 
-javaagent是java命令的一个参数。直译为Java代理(或叫探针)
它的使用是在允许java程序启动时静态加载指定的外部.jar文件，无论该文件是不是属于该程序的
因此可以看到许多针对java程序的逆向使用javaagent来达到破解或汉化目的 如
BurpSuite
:::

# 运行IDE
在确认上述操作都完成后回到`bin`目录打开`pycharm64.exe`这里更推荐第一次打开使用`pycharm.bat`这样可以更清楚的看到ja-netfilter是否正确加载
![](image/Pasted%20image%2020230218162642.png)
如果你使用`pycharm.bat`运行时看到这行提示，恭喜你ja-netfilter成功加载
![](image/Pasted%20image%2020230218164434.png)


# 激活
打开IDE后自动进入激活界面
选择激活码
![](image/Pasted%20image%2020230218165357.png)

回到刚刚的网站，找到需要激活的IDE并复制激活码
如果遇到无法复制的情况请更换网站
![](image/Pasted%20image%2020230218165528.png)

粘贴激活码并点击激活
![](image/Pasted%20image%2020230218172316.png)
成功!
![](image/Pasted%20image%2020230218172353.png)
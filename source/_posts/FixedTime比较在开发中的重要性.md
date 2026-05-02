---
title: FixedTime比较在开发中的重要性
date: 2026-05-01
tags:
  - 教程
  - 技术探讨
  - 网络安全
  - 杂谈
  - 开发
cover: https://cdn.jsdelivr.net/gh/zhicheng233/Image/Blog/20260502012630156.png
cssclasses:
  - 杂谈
  - 开发
---
# 前言
开始前咱们先看两段代码:
```C#
	var input = request.QueryString["password"];
	return string.Equals(input, Password, StringComparison.Ordinal);
```

```C#
		var input = request.QueryString["password"];
		return FixedTimeEquals(input, Password); 
	} 
	private static bool FixedTimeEquals(string left, string right)
	{ 
		if (left == null || right == null) return false;
		if (left.Length != right.Length) return false;
		int result = 0;
		for (int i = 0; i < left.Length; i++)
		{ 
			result |= left[i] ^ right[i]; 
		}
		return result == 0;
		}
```

同样实现一个逻辑，为什么第二种写法会复杂如此之多，为何我们需要使用后者，而不是前者呢？
可能有人刚看到位操作会说，肯定是第二种写法性能更快，所以选择后者。然而现实是后者不但没有任何性能优势，反而比前者更慢，那么我们为什么要在开发者使用一个更慢，看起来更复杂的方法去对字符串进行比较呢？
# 更快的代价
我们先来看看原版`string.Equals`快在哪，相较于后者，前者通过将一个每一位字符进行比较，一旦发现字符串中有一个字符为`false`整个方法就会立即返回`false`无论后面是否还有需要检查的字符，也就是说`string.Equals`是逻辑短路的。而后者通过代码我们可以知道，代码通过对两段字符串的每一个字符进行异或操作，在将得到的结果与result按位或并赋值给result，只要有一个字符不同result的值就不为0，与前者不同的是，这段代码无论前面字符是否正确，程序都会对下一个字符进行比较，直到字符串结束，在这种写法下，无论输入的值是什么，我们都可以保证每次比较所用的时长是相同的。

既然`string.Equals`是逻辑短路的，这也意味着在输入长度相同的情况下`string.Equals`函数的运行时长是由第一个错误的字符决定的，这也意味着我们可以通过侧信道攻击去获得正确的值。

# 时间侧信道攻击
我们已经知道`string.Equals`函数的运行时长是由第一个错误的字符决定，我们可以通过测量函数的执行时间去逐位推测出所需的值。

首先我们需要先知道目标字符串的长度，可知当输出长度相匹配时，函数的执行时间会有轻微的起跳，由此我们可以确定目标字符串的长度；在去确认字符串长度后，我们可以遍历第一个字符所有可能的值，并测量函数执行所需要的时间，当满足目标字符后函数的执行时长会轻微的延长，重复上述步骤，不断测量函数的执行时长，从而获得目标字符串。

![](https://raw.githubusercontent.com/zhicheng233/Image/master/Blog/20260502012630156.png)

# 总结
在C#可以使用`.NET Core`自带的`CryptographicOperations.FixedTimeEquals`方法去实现上述功能，对于一般的比较`string.Equals`可以加快程序的性能，而对于敏感场景则应当使用`FixedTimeEquals`来防止时间侧信道攻击。
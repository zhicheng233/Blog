---
title: 为AquaDX等服务端使用Cloudflare CDN的思路
date: 2026-05-26
tags:
  - 教程
  - 技术探讨
  - 杂谈
  - 开发
  - Cloudflare
  - CDN
  - MaiMaiDX
cover: https://cdn.jsdelivr.net/gh/zhicheng233/Image@master/Blog/20260526180709133.png
cssclasses:
  - 杂谈
  - 开发
  - 解决方案
---
# 已知信息
![](https://cdn.jsdelivr.net/gh/zhicheng233/Image@master/Blog/20260526160257613.png)
AquaDX的官方说明文档中明确表示不支持使用CDN
## Why？
通过抓包以及逆向分析得出:
- MaiMaiDX与服务器通信使用的是HTTP，而CF的HTTPS重写会使得HTTP变为HTTPS，导致通信异常

- Amdaemon的PowerOn请求使用的是HTTP/1.0 + 非法请求头，CF会直接拦截，导致请求无法到达后端服务器

- 最重要的是MaiMaiDX请求使用的数据压缩方式为`deflare`，且对于任何响应都会忽视请求头使用`deflare`的解压方式进行解压，而Cloudflare仅支持`Gzip`、`Brotli`、`Zstd`，导致游戏无法正确解压请求体
	```CSharp
	private void Decompress()
	{
		_memoryStream.SetLength(0L);
		if (_temporaryStream.Length < 6)
		{
			return;
		}
		_temporaryStream.Position = 2L;
		_temporaryStream.SetLength(_temporaryStream.Length - 4);
		using (DeflateStream deflateStream = new DeflateStream(_temporaryStream, CompressionMode.Decompress, leaveOpen: true))
		{
			while (true)
			{
				int num = deflateStream.Read(_buffer, 0, 1024);
				if (num <= 0)
				{
					break;
				}
				_memoryStream.Write(_buffer, 0, num);
			}
			deflateStream.Close();
		}
		_memoryStream.Seek(0L, SeekOrigin.Begin);
		_temporaryStream.Seek(0L, SeekOrigin.Begin);
		_temporaryStream.SetLength(0L);
	}
	```

# 解决方案
## Cloudflare设置
首先需要在`cloudflare`边缘证书中关闭`始终使用 HTTPS`，设置`最低 TLS 版本`为`TLS 1.0`
![](https://cdn.jsdelivr.net/gh/zhicheng233/Image@master/Blog/20260526165601081.png)

在`规则-Configuration Rules`中设置AuqaDX的主机名，关闭`自动 HTTPS 重写`;`SSL`设置为关

新建`Compression Rules`设置`压缩选项`为`自动`

## PowerOn(Auth Server)
对于Amdaemon的PowerOn请求，我们知道PowerOn服务器用于返回最新的标题服务器地址给游戏，介于服务器返回的内容是一样的，实际负载很小，我们可以将poweron部署在另外一台服务器上，返回静态内容，定时从主服务器上拉最新的内容，这样我们可以使得主服务器的IP不会被泄露，即使PowerOn服务器遭到攻击也不会波及到主服务器

## 游戏设置
而对于游戏，我们需要对游戏打Patch

```Csharp
//Aquamai Dev//

private const int BufferSize = 1024;  
  
[HarmonyPrefix]  
[HarmonyPatch(typeof(NetHttpClient), "Decompress")]  
public static bool PreDecompress(NetHttpClient __instance)  
{  
    var traverse = Traverse.Create(__instance);  
    var temporaryStream = traverse.Field<MemoryStream>("_temporaryStream").Value;  
    var memoryStream = traverse.Field<MemoryStream>("_memoryStream").Value;  
    var buffer = traverse.Field<byte[]>("_buffer").Value;  
  
    memoryStream.SetLength(0L);  
    if (temporaryStream.Length == 0L)  
    {  
        return false;  
    }  
  
    var raw = temporaryStream.ToArray();  
   
    //  - 0x1F 0x8B            -> gzip    //  - 0x78 ?? + valid zlib -> zlib (the stock format: zlib header + raw deflate + adler32)    //  - otherwise            -> treat as plaintext    if (raw.Length >= 2 && raw[0] == 0x1F && raw[1] == 0x8B)  
    {  
        using var gz = new GZipStream(new MemoryStream(raw, writable: false), CompressionMode.Decompress);  
        CopyTo(gz, memoryStream, buffer);  
    }  
    else if (raw.Length >= 6 && raw[0] == 0x78 && TryInflateZlib(raw, memoryStream, buffer))  
    {  
        // zlib successfully decompressed  
    }  
    else  
    {  
        memoryStream.Write(raw, 0, raw.Length);  
    }  
  
    memoryStream.Seek(0L, SeekOrigin.Begin);  
    temporaryStream.Seek(0L, SeekOrigin.Begin);  
    temporaryStream.SetLength(0L);  
    return false;  
}  
  
private static bool TryInflateZlib(byte[] raw, MemoryStream output, byte[] buffer)  
{  
    var startLength = output.Length;  
    try  
    {  
		// 跳过 2 字节的 zlib 头部，忽略末尾的 4 字节 Adler32 校验和。
        using var input = new MemoryStream(raw, 2, raw.Length - 6, writable: false);  
        using var deflate = new DeflateStream(input, CompressionMode.Decompress);  
        CopyTo(deflate, output, buffer);  
        return true;  
    }  
    catch  
    {   
        output.SetLength(startLength);  
        return false;  
    }  
}  
  
private static void CopyTo(Stream from, Stream to, byte[] buffer)  
{  
    while (true)  
    {  
        var count = from.Read(buffer, 0, BufferSize);  
        if (count <= 0) break;  
        to.Write(buffer, 0, count);  
    }  
}
```

由于某些申必原因maimai手台玩家基本上都有装Aquamai，过段时间咱会给aquamai提交这份PR，具体能不能合并到主线呢就不知道了

当然如果你嫌麻烦，可以直接把游戏的Decompress();方法pass掉，然后在cf规则中关闭压缩
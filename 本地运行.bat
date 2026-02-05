@echo off 
echo 正在同步图片...
copy F:\Blog\source\_posts\image F:\Blog\source\image
echo 完成
echo ------------------------------------------------
echo ------------------------------------------------
hexo clean && hexo g && powershell -c F:\Blog\处理rss2.xml.ps1;hexo server;

pause

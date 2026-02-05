$filePath = "public/rss2.xml"
$searchString = ".html<"
$replaceString = "<"
 
# 读取文件内容（以UTF-8编码）
$fileContent = Get-Content -Path $filePath -Encoding UTF8
 
# 替换指定字符串
$newContent = $fileContent -replace $searchString, $replaceString
 
# 将修改后的内容写回文件（以UTF-8编码）
$newContent | Set-Content -Path $filePath -Encoding UTF8
Write-Output "Fix rss2.xml done!" 
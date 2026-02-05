const ap = new APlayer({
    container: document.getElementById('player'),
    listFolded: false,//列表默认折叠
    listMaxHeight: 90,//列表最大高度
    lrcType: 3, //此为歌词格式，没有歌词可以直接删掉这一行
    audio: [{
        name: 'test',
        artist: 'test',
        url: 'https://www.ytmp3.cn/down/76127.mp3',
    }]
});
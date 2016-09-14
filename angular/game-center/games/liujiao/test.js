var res={
    Item0_png:"res/0.png",
    Item1_png:"res/1.png",Item2_png:"res/2.png",Item3_png:"res/3.png",Item4_png:"res/4.png",Item5_png:"res/5.png",Item6_png:"res/6.png",Item7_png:"res/7.png",ColorBg1_png:"res/bg/1.png",ColorBg2_png:"res/bg/2.png",ColorBg3_png:"res/bg/3.png",ColorBg4_png:"res/bg/4.png",ColorBg5_png:"res/bg/5.png",ColorBg6_png:"res/bg/6.png",ColorBg7_png:"res/bg/7.png",Shadow1_png:"res/shadow/1.png",Shadow2_png:"res/shadow/2.png",Shadow3_png:"res/shadow/3.png",Shadow4_png:"res/shadow/4.png",Shadow5_png:"res/shadow/5.png",Shadow6_png:"res/shadow/6.png",Shadow7_png:"res/shadow/7.png",Num_png:"res/num.png",Circle_png:"res/circle.png",Bomb_mp3:"res/music/bomb.mp3",Bomb_ogg:"res/music/bomb.ogg",Put_mp3:"res/music/put.mp3",Put_ogg:"res/music/put.ogg",In_mp3:"res/music/in.mp3",In_ogg:"res/music/in.ogg",GameOver_mp3:"res/music/game_over.mp3",GameOver_ogg:"res/music/game_over.ogg",IconGame_png:"res/icon_moregame.png",IconReplay_png:"res/icon_replay.png",IconFacebook_png:"res/icon_facebook.png",IconTwitter_png:"res/icon_twitter.png",Facebook_png:"res/f_share.png",ShareArrow2_png:"res/share_arrow2.png",MoreGame2_png:"res/more_game.png",PlayAgain2_png:"res/play_again.png",GameOver2_png:"res/game_over2.png",GameOver_png:"res/game_over.png",ScoreBg_png:"res/score_bg.png",JiXuBtn_png:"res/jixuyouxi.png",ChouJiangBtn_png:"res/choujianganniu.png",Share_png:"res/fenxiangyixia.png",fenxiang_png:"res/fenxiang.png",fenxiang2_png:"res/fenxiang2.png",MoreGame_png:"res/moregame.png"};

var http = require('http');
var fs = require("fs");

function download_file_httpget (file_url, callback) {
    var options = {
        host: "wx.topyouxi.cn",
        port: 80,
        path: "/hlmy/ranking/ljpp/" + file_url
    };

    var file = fs.createWriteStream(file_url);//将文件流写入文件

    http.get(options, function (res) {
        res.on('data', function (data) {
            file.write(data);
        }).on('end', function () {
            file.end();
            callback(null, '');
        });
    });
};

for (var i in res) {
    download_file_httpget(res[i], function (e, v) {});
}





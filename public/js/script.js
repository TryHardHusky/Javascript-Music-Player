/*
    Music Player by https://github.com/TryHardHusky
*/
music = {};
music.volume = 0.25;
music.paused = false;
music.songindex = 0;
music.audio = new Audio();
music.songs = [
    {
        title : "Tobu - Candyland",
        src: "Tobu - Candyland.mp3",
        img: "candyland.jpg"
    },
    {
        title : "Lensko - Cetus",
        src: "cetus.mp3",
        img: "lensko.jpg"
    },
    {
        title : "Cartoon - Immortality",
        src: "cartoon.mp3",
        img: "cartoon.jpg"
    },
    {
        title : "JPB - Levitate",
        src: "JPB - Levitate.mp3",
        img: "levitate.jpg"
    },
    {
        title : "Itro & Kontinuum - Alive",
        src: "Itro & Kontinuum - Alive.mp3",
        img: "kontinuum.jpg"
    },
    {
        title : "Subtact - Away",
        src: "Subtact - Away.mp3",
        img: "subtact.jpg"
    },
    {
        title : "Alan Walker - Force",
        src: "Alan Walker - Force.mp3",
        img: "alan.jpg"
    },
    {
        title : "Lensko - Sarvagon 2015",
        src: "Lensko - Sarvagon 2015.mp3",
        img: "sarvagon.jpg"
    },
    {
        title : "Tobu & Marcus - Running Away",
        src: "Tobu & Marcus Mouya - Running Away.mp3",
        img: "tobu.jpg"
    },
    {
        title : "Itro x Valcos - Starbound",
        src: "Itro x Valcos - Starbound.mp3",
        img: "starbound.jpg"
    },
    {
        title : "ZEST - You. & Me",
        src: "ZEST - You. & Me.mp3",
        img: "zest.jpg"
    },
    {
        title : "Lensko - Let_s go!",
        src: "Lensko - Let_s go!.mp3",
        img: "lensko2.jpg"
    }
];

music.el = {
    vol : $("#music").find(".volume"),
    track : $("#music").find(".track"),
    img : $("#music").find("img"),
    title : $("#music").find(".title"),
    pause : $("#music").find("button.pause"),
    play : $("#music").find("button.play"),
    playlist : $("#music").find('.playlist')
};

music.create_audio = function(index){
    music.audio = new Audio("public/mp3/" + music.songs[index].src);
    music.el.img.attr({
        src : "public/img/" + music.songs[index].img
    });
    music.el.title.text(music.songs[index].title);
    music.audio.volume = music.volume;
};

music.pause_song = function(){
    music.time = music.audio.currentTime;
    music.audio.pause();
    music.paused = true;
    music.el.pause.hide();
    music.el.play.show();
};

music.resume_song = function(){
    music.paused = false;
    music.create_audio(music.songindex);
    music.audio.currentTime = music.time;
    music.audio.play();
    music.el.pause.show();
    music.el.play.hide();
};

music.load_playlist = function(){
    music.el.playlist.html("");
    for(var song in music.songs){
        music.el.playlist.append(
            "<li data-index='" + song + "'>" + music.songs[song].title + "</li>"
        );
    };
    music.el.playlist = $("#music").find('.playlist');
};

music.__init__ = function(){
    music.load_playlist();
    music.play_song(music.songindex);
    music.tick();
};

music.play_song = function(index){
    music.songindex = index;
    $("#music").find("li.playing").removeClass('playing');
    $("#music").find("[data-index='" + music.songindex + "']").addClass('playing');
    if(music.paused) return music.resume_song();
    else{
        music.el.pause.show();
        music.el.play.hide();
        if(music.songs[index]){
            music.create_audio(index);
            music.audio.play();
        }
    }
};

music.tick = function(){
    if(music.audio.currentTime == music.audio.duration){
        if(music.songindex+1 < music.songs.length) music.songindex++;
        else music.songindex = 0;
        music.play_song(music.songindex);
    }
    music.timestamp = music._getimestamp(music.audio.currentTime);
    music.el.track.attr({min : 0, max : music.audio.duration});
    music.el.track.val(music.audio.currentTime);
    setTimeout(music.tick, 500);
};


music._getimestamp = function(seconds){
    var h, m, s, str;
    h = ('00' + parseInt( seconds / 3600 ) % 24).substr(-2);
    m = ('00' + parseInt( seconds / 60 ) % 60).substr(-2);
    s = ('00' + (seconds % 60)).substr(-2);
    if(h != "00") str = [h,m,s].join(":");
    else str = [m,s].join(":");
    return str;
};

music.el.play.on('click', function(){music.play_song(music.songindex);});
music.el.pause.on('click', function(){music.pause_song();});
music.el.vol.on('click', function(){
    if(music.volume == 0.25){
        $(this).find('i').removeClass('fa-volume-up').addClass('fa-volume-off');
        music.volume = 0.0;
    } else{
        $(this).find('i').addClass('fa-volume-up').removeClass('fa-volume-off');
        music.volume = 0.25;
    }
    music.audio.volume = music.volume;
});
music.el.playlist.on('click', 'li', function(){
    music.audio.pause();
    music.play_song($(this).data('index'));
});
music.el.track.on('change', function(){
    music.audio.currentTime = music.el.track.val();
});

music.__init__();
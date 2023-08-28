const backwardBtn=document.getElementById('backward');
const playBtn=document.getElementById('play');
const pauseBtn=document.getElementById('pause');
const forwardBtn=document.getElementById('forward');

const songName=document.getElementById('songName');
const audio=document.getElementById('audio');

const playlistBtn=document.getElementById('playlist');
const playListContainer=document.querySelector(".playlist-container");
const volumeInput=document.querySelector(".volume");
const animation=document.querySelectorAll(".animation");


const currentTime=document.getElementById('current-time');
const maxDuration=document.getElementById('max-duration');
const closeButton=document.getElementById('close-button');
const progressBar=document.querySelector('.progress-bar');
const currentBar=document.querySelector('.current-bar');
const playListSongs=document.getElementById('playlist-song');

const dinamikContentText=document.querySelector('.dinamikText');

let index;
let loop;








const songList=[
    {
        name:'Modern Talking - Brother Louie',
        link:"assets/Modern Talking - Brother Louie Video.mp3",
        img:"assets/Atlan.jpg" 
    },
    {
        name:'Modern Talking - Atlantis Is Calling',
        link:"assets/Modern Talking Atlantis Is Calling (Die Hundertausend Ps Show 06.09.1986).mp3" ,
        img:"assets/ceri.jpg" 
    },
    {
        name:'Modern Talking - Cheri Cheri Lady',
        link:"assets/Modern Talking Cheri Cheri Lady.mp3",
        img:"assets/you.jpg"
    }
]
//ses ayarlari
const setVolume=()=>{
    const volumeValue = volumeInput.value;
    audio.volume = volumeValue / 100;
    
}

volumeInput.addEventListener("input", setVolume);


//tıklama ayarlari
let events={
    mouse:{
        click:"click"
    },

    touch:{
        click:"touchstart"
    }
}

let deviceType=""

const isTouchDevice=()=>{
    try{
        document.createEvent('TouchEvent')
        deviceType="touch"
        return true
    }
    catch(error){
        deviceType="mouse"
        return false
    }
}


//zaman formatlama
const timeFormatter=(timeInput)=>{
    let minute=Math.floor(timeInput/60)
    minute=minute < 10 ? "0" + minute : minute
    let second=Math.floor(timeInput%60)
    second=second < 10 ? "0" + second : second
    return `${minute}:${second}`
}


//song ayarlama
const setSong=(arrayIndex)=>{
    console.log(arrayIndex)
    let {name,link}=songList[arrayIndex];
    audio.src=link;
    dinamikContentText.textContent=name;

     //sureyi göster
    audio.onloadedmetadata=()=>{
        maxDuration.innerText=timeFormatter(audio.duration);

    }
    playListContainer.classList.add("hide");
    playAudio();

}

//play fonksiyonu
const playAudio = () =>{
    audio.play();
    animation.forEach(element=>{
        element.classList.remove("paused");
    })
    
}

//sonraki şarkiya git
const nextSong=()=>{
    if(loop){
        if(index==(songList.length-1)){
            index=0;
        }else{
            index+=1;
        }
        setSong(index);
        
    }else{
        let randomIndex=Math.floor(Math.random()* songList.length);
        console.log(randomIndex);
        setSong(randomIndex);
       
    }
 playAudio();
 animation.forEach(element=>{
    element.classList.remove("paused");
})
}

//şarkiyi durdur
const pouseAudio=()=>{
    audio.pause();
    animation.forEach(element=>{
        element.classList.add("paused");
    })
   
}


//bir onceki şarkiya dönmek

const backSong=()=>{
    if(index>0){
        pouseAudio();
        index-=1;

    }else{
        index=songList.length-1;
    }
    setSong(index);
    playAudio();
}

//eğer şarki kedisi biterse aşağideki fonksiyon çalişir

audio.onended = () =>{
    nextSong();
}

playBtn.addEventListener("click", playAudio);
forwardBtn.addEventListener("click", nextSong);
pauseBtn.addEventListener("click", pouseAudio);
backwardBtn.addEventListener("click", backSong);

isTouchDevice();
//bir progress bar (ilerleme çubuğu)  
progressBar.addEventListener(events[deviceType].click,(event)=>{
    let coordStart=progressBar.getBoundingClientRect().left;    //elementinin sol kenarının sayfanın soluna olan uzaklığı alınır. 


    //Bu satırda, kullanıcının tıkladığı veya dokunduğu yerin yatay koordinatı hesaplanır. Eğer cihaz bir dokunmatik cihaz değilse,
    // event.clientX kullanılır (kursorun X koordinatı); aksi takdirde dokunmatik cihazlarda kullanılan event.touches[0].clientX değeri alınır.
    
    let coordEnd=!isTouchDevice() ? event.clientX :event.touches[0].clientX;
    let progress=(coordEnd-coordStart)/progressBar.offsetWidth;
    currentTime.style.width = progress * 100 + "%";
    audio.currentTime = progress * audio.duration;
    audio.play();
})

setInterval(()=>{
currentTime.innerHTML=timeFormatter(audio.currentTime);
currentBar.style.width=(audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
},1000)


//zaman gucellemesi
audio.addEventListener('timeupdate',() => {
    currentTime.innerText=timeFormatter(audio.currentTime);
    
});

window.onload = () =>{
    index=0;
   
    setSong(index);
    initPlaylist();
}

const initPlaylist = () =>{
 for(let i in songList){
    playListSongs.innerHTML += `<li class="playlistSong"
    onclick="setSong(${i})">
    <div class="playlist-image-container">
    <img src="${songList[i].img}">
    </div>
    <div class="playlist-song-details">
    <span id="playlist-song-name">
    ${songList[i].name}
    </span>
    </div>
    </li>
    `
 }
}

//şarki listesini gösterir
playlistBtn.addEventListener("click",()=>{
    playListContainer.classList.remove("hide");
})


//şarki listesini kapatir
closeButton.addEventListener("click",()=>{
    playListContainer.classList.add("hide");
})
import { MdOutlinePause, MdSubtitles, MdOutlineVolumeUp, MdOutlineZoomOutMap, MdPlayArrow,  MdVolumeOff, MdSubtitlesOff } from "react-icons/md";
import './VideoPlayer.css'
import Hls from 'hls.js';


import { useEffect, useRef, useState } from "react";

interface VideoInterface {
  src:string
}
const VideoPlayer = ({src}:VideoInterface) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullScreen,setIsFullScreen] = useState(false)
  const [showSubtitle,setShowSubtitle] = useState(false)
  const [mute,setMute] = useState(true)
  const [progress,setProgress] = useState(0)
  const [duration,setDuration] = useState(0)
  const divRef = useRef<any>(null)
  const [volume,setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1);
  console.log(src)
  // const src = "https://ag.bigtimedelivery.net/_v13/ee250af64cab6cd80766ec8d91273b8e6dfba8e1a0de8c6bb277619add06c09134b8b9a7cc897741d88a6380fdb51c28e050ff01fa23fdfa28ab85e681a06e641547ebf43fd3dda2fbc29039e318bbe8c6b82dc1a5226bda08dbb1be99b13ed5f606910d29cec9ee30aef4bcaf596ef2e149be142e7f346e8eb382851ffb760d4db26de84a40c09ca80a83f9c0529550/360/index.m3u8"
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      // If Hls is supported
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src); // Load your m3u8 source
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play();
        });

        // Clean up on component unmount
        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari native support
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
      }
    }
  }, [src]);

  useEffect(()=>{
   if(videoRef.current){
   
    videoRef.current.currentTime =0
   }
  },[src])




  const handleSpeedChange = () => {
    const video = videoRef.current;
    if(video){
      
    
    video.playbackRate = playbackRate+0.5; // Set video playback speed
    if(playbackRate>=3){
      video.playbackRate = 0.5;
      setPlaybackRate(0.5)
     }else{
      setPlaybackRate(playbackRate+0.5)
     }
    }
  };

  const handleVolumeChange = (e:any) => {
    const newVolume = e.target.value;
    const video = videoRef.current;
    if(video)
    video.volume = newVolume; // Set video volume
    setVolume(newVolume); // Update volume state
  };
  const playVideoHandler = ()=>{
   if(videoRef.current){
    if(isPlaying===false){
      videoRef.current.play()
      setIsPlaying(!isPlaying)
    }else{
      videoRef.current.pause()
      setIsPlaying(!isPlaying)
    }
   }
  }
  const formatTime = (seconds:any) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
  
    // Format the time to always show 2 digits
    if(hrs===0){
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart
      (2, '0')}`
    }
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : '00',
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].join(':');
  };
  const handleFullscreen = () => {

    if(!isFullScreen){
    if (divRef.current.requestFullscreen) {
      divRef.current.requestFullscreen();
     
    } else if (divRef.current.mozRequestFullScreen) { // Firefox
      divRef.current.mozRequestFullScreen();
    } else if (divRef.current.webkitRequestFullscreen) { // Chrome, Safari and Opera
      divRef.current.webkitRequestFullscreen();
    } else if (divRef.current.msRequestFullscreen) { // IE/Edge
      divRef.current.msRequestFullscreen();
    }else{

    }
   
    setIsFullScreen(true)
  
    console.log("Entered full screen")
  }else{
    console.log("Exit Full Screen")
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (divRef.current.mozCancelFullScreen) { // Firefox
      divRef.current.mozCancelFullScreen();
    } else if (divRef.current.webkitExitFullscreen) { // Chrome, Safari and Opera
      divRef.current.webkitExitFullscreen();
    } else if (divRef.current.msExitFullscreen) { // IE/Edge
      divRef.current.msExitFullscreen();
    }
    setIsFullScreen(false)
  }
 

 
  };
  const muteControlHandler = ()=>{
    if(videoRef.current){
    videoRef.current.muted = mute;
    setMute(!mute)
 
    }
   }

   const handleTimeUpdate = () => {
    
    if(videoRef.current){
      const video = videoRef.current;
    const currentTime = videoRef.current.currentTime;
    const duration = video.duration;
    const progressPercentage = (currentTime / duration) * 100;
    setProgress(progressPercentage);

    }
  };

  // Seek to a specific time when clicking on the seek bar
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if(video)
    setDuration(video.duration); // Set duration when video metadata is loaded
  };

  // Seek to a specific time when clicking on the seek bar
   // Handle seek bar change
   const handleSeek = (e:any) => {
    
    const video = videoRef.current;
    if(video){
    const newTime = (e.target.value / 100) * video.duration; // Calculate new time
    video.currentTime = newTime; // Set video to new time
    setProgress(e.target.value); // Update progress visually
    }
  };
  return (
    <div ref={divRef} className=" bg-black h-[300px] w-[600px] relative">

         <video  ref={videoRef}  onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata}   className=" w-full h-full aspect-auto"> 
          
         </video>

    
         {showSubtitle&& <div className=" w-full absolute bottom-14 subtitle flex justify-center text-white ">
          
         <p className={`bg-black/70 p-1  ${isFullScreen?"text-xl":"text-sm"}  font-semibold`}>{`subtitles are here\n new line`}</p>
    </div>}
    <div className=" w-full h-[100px] bg-gradient-to-t from-black/60 absolute bottom-0 p-2" >
   
 
    {/* <div onClick={handleSeek} className=" w-full h-[4px] mt-2 bg-white cursor-pointer" >
         <div   className="  h-[4px] bg-red-500"  style={{ width: `${progress}%` }}>

         </div>
      </div> */}
       <div className="time-info mt-2 flex justify-between px-1">
        <div className="  text-white text-sm h-[15px] font-semibold">
     {formatTime(videoRef.current?.currentTime || 0)}
        </div>
        <div className="  text-white text-sm h-[15px] font-semibold">
        {formatTime(duration)}
        </div>
      </div>

  
<input  
        type="range"
        min="0"
        max="100"
       
        value={progress}
        style={{
          background: `linear-gradient(to right, red ${progress}%, white ${progress}%)`,
        }}
        onChange={handleSeek}
        className="w-full h-[4px] seekbar cursor-pointer "
      />
           
      <div className="buttons h-[60px] pt-1 mt-1  items-start flex justify-between">

       <div className=" flex">
        <button onClick={playVideoHandler}>

          {isPlaying?<MdOutlinePause size={30} className=" mx-2" color="white"/>:<MdPlayArrow size={30} className=" mx-2" color="white"/>}
        

        </button>
        <button onClick={muteControlHandler}>
       {mute?<MdOutlineVolumeUp size={28} className=" mx-2" color="white"/>:<MdVolumeOff size={28} className=" mx-2" color="white"/>} 
        
        </button>
        <div className="volume-control w-16  mb-2 ">
        
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          style={{  background: `linear-gradient(to right, white ${volume*100}%, #a9aaab ${volume*100}%)`}}
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>
       </div>
       <div className=" flex">

      <button onClick={handleSpeedChange} >
       <p className=" text-xl  mb-1 mx-2 text-white font-bold">{`${playbackRate}x`}</p>
      </button>
       <button onClick={()=>setShowSubtitle(!showSubtitle)}>
       {!showSubtitle?<MdSubtitles size={24} className=" mx-2" color="white"/>:<MdSubtitlesOff size={24} className=" mx-2" color="white"/>} 
        </button>
       <button onClick={handleFullscreen}>
        <MdOutlineZoomOutMap size={24} className=" mx-2" color="white"/>
        </button>


       </div>
      </div>
      </div>  
 
    </div>
  )
}

export default VideoPlayer
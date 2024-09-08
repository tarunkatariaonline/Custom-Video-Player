import { useState } from "react"
import VideoPlayer from "./VideoPlayer"


function App() {
const [src,setSrc] = useState("https://ag.bigtimedelivery.net/_v13/aee54b10bc75971059c54136498c16602bd8fc746efdce2f2404e277cdd1595668c31440fef44ceb4597aa1d69ab887237c3e59f8f41cf724b7ad64d3338e4ade875668edeeb226c087c076ae944a6fd3e46e5982a0dc742454e54aa3080e1cdb8e9a5d544df98597900f58a637abc2f0d965de3cb11efef9b27ef7b76225e3e/720/index.m3u8")

const [url,setUrl] = useState("")

  return (
    <>

   
    <input className=" bottom-1 border-black" placeholder="enter url here" type="text" value={url} onChange={(e)=>{
      setUrl(e.target.value)
    }} />

    <button className=" p-2 bg-red-500" onClick={()=>{setSrc(url)}} >set video</button>
    <VideoPlayer src={src}/>
    </>
  )
}

export default App

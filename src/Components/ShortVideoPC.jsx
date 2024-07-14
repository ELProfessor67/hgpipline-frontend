import '../Css/ShortVideoPc.css'
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import LeftPanel from "./LeftPanel";
import Navbar from "./Navbar";
import jwtDecode from "jwt-decode";
import VideoBoxPc from './VideoBoxPc';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CommentsDialog from './CommentsDialog';

const ShortVideoPc = () => {
  const backendURL = "https://backend.hgpipeline.com";
  const [videos, setVideos] = useState([]);
  const [commentOpen, setCommentOpen] = useState(false);
  
  const [currentVideo, setCurrentVideo] = useState(null);
  const [email, setEmail] = useState(null);

  const containerRef = useRef()


  useEffect(() => {
    async function getShortVideos() {
      try {
        const token = localStorage.getItem("userToken");
        let email = null;
        if (token) {
          email = jwtDecode(token).email;
        }
        const res = await axios.get(`${backendURL}/get-short-videos?email=${email}`);
        setVideos(res.data);
        console.log(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }

    getShortVideos()
  }, [])


  const handleScroll = (direction) => {
    if (containerRef.current) {

      const scrollAmount = containerRef.current.clientHeight; // Scroll by one full container height
      if (direction === 'next') {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollTop + scrollAmount,
          behavior: 'smooth'
        });
      } else if (direction === 'prev') {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollTop - scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };
  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className='main-container'>
        
       
          <div className='pccontainer' ref={containerRef}>
            {
              videos.length != 0 ? videos.map((video,index) => (
                <VideoBoxPc {...video} setVideos={setVideos} index={index} setCurrentVideo={setCurrentVideo} videolength={videos.length} showComments={() => setCommentOpen(true)}/>
              )):
              <div className='pcbox'>
                 <div className='loader'></div>
              </div>
            }
          </div>
        


        <div className='buttons'>
          <button onClick={() => handleScroll('prev')}><ArrowUpwardIcon color='white' /></button>
          <button onClick={() => handleScroll('next')}><ArrowDownwardIcon color='white' /></button>
        </div>
        <CommentsDialog open={commentOpen} onClose={() => setCommentOpen(false)} _id={currentVideo?._id} usermail={currentVideo?.usermail}/>
      </div>

    </>
  )
}

export default ShortVideoPc
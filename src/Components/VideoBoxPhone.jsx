import React, { useCallback, useEffect, useRef, useState } from 'react'
import useIntersectionObserver from '../hooks/useIntersectionObserver'
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Avatar } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
const backendURL = "https://backend.hgpipeline.com";

const VideoBoxPhone = ({ thumbnailURL, videoURL, Title, setVideos, videolength, setCurrentVideo,showComments,_id, email:usermail, ChannelProfile,Tags,index }) => {
  const [isPlay, setIsPlay] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading,setLikeLoading] = useState(false);
  const videoref = useRef()
  const { isVisible } = useIntersectionObserver(videoref?.current, thumbnailURL, videoURL, setVideos, videolength, setCurrentVideo);





  const handlePlay = () => {
    console.log('click overlay')
    if (isPlay) {
      setIsPlay(false);
      videoref.current.pause()
    } else {
      setIsPlay(true);
      videoref.current.play()
    }
  }


  const handleComments = (e) => {
    e.stopPropagation();
    console.log('click buuton')
    showComments()
  }


  async function checkLikeExist(email) {
    console.log('email', email)

    try {
      const res = await axios.get(`${backendURL}/getuserlikes/${_id}/${email}`);
      const { existingLikedVideo } = res.data;

      if (!existingLikedVideo) {
        setIsLiked(false);
      } else {
        setIsLiked(true);
      }
    } catch (error) {
      console.log(error.message, "while cheking liked video")
    }
  }




  const handleLikded = useCallback(async (e) => {
    e.stopPropagation()
    const token = localStorage.getItem("userToken");
    let email = null;
    if (!token) {
      toast.error('place login first.');
      return
    }




    email = jwtDecode(token).email;

    setIsLiked(prev => !prev);
    setLikeLoading(true)
    console.log("loding")
    try {
      const res = await axios.post(`${backendURL}/like/${_id}/${email}/${usermail}`);
      checkLikeExist(email);

      setLikeLoading(false)
    } catch (error) {
      setLikeLoading(false)
      toast.error(error.message)
      console.log(error.message, "while liked video")
    }
    console.log("end")
  }, [_id, usermail]);



  //check like 
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    
    let email = null;
    if(token){
      email = jwtDecode(token).email
    }
    if (email, isVisible) {
      checkLikeExist(email);
    }
  }, [_id, isVisible])
  return (
    <div className='box'>
      <video
        ref={videoref}
        onPlay={() => setIsPlay(true)}
        onPause={() => setIsPlay(false)}
        id={index.toString()}
        dataId={_id.toString()}
        usermail={usermail}

      >

      </video>

      <div className='overlay' onClick={handlePlay}>
        <div className='buttons-container'>
          <button className='btn' onClick={handleLikded} disabled={likeLoading}>
            {
              isLiked ? <ThumbUpIcon /> : <ThumbUpAltOutlinedIcon />
            }

          </button>
          <button className='btn'>
            <ThumbDownIcon />
          </button>
          <button className='btn' onClick={handleComments}>
            <CommentOutlinedIcon />
          </button>
          <button className='btn'>
            <ReplyOutlinedIcon />
          </button>
        </div>
        <div className='profile'>
          <Avatar src={ChannelProfile} />
          <div>
            <h2 className='title'>@{usermail?.split("@")[0]}</h2>
          </div>
        </div>
        <h2 className='title'>{Tags}</h2>
        <h2 className='title'>{Title}</h2>
      </div>

      {
          !isPlay &&
          <button className='play' onClick={handlePlay}>
            <PlayArrowIcon color='white' />
          </button>
        }
    </div>
  )
}

export default VideoBoxPhone
import '../Css/ShortVideoPhone.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

import jwtDecode from "jwt-decode";
import VideoBoxPhone from './VideoBoxPhone';
import LeftPanel from "./LeftPanel";
import CommentsBoxPhone from './CommentsBoxPhone';

const ShortVideoPhone = () => {
  const backendURL = "https://backend.hgpipeline.com";
  const [videos, setVideos] = useState([]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);


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
  return (
    <>
      <LeftPanel />
      <div className='container'>
        {
          videos.length != 0 ? videos.map((video, index) => (
            <VideoBoxPhone {...video} setVideos={setVideos} index={index} setCurrentVideo={setCurrentVideo} videolength={videos.length} showComments={() => setCommentOpen(true)} />
          )) :

            <div className='box'>
              <div className='loader'></div>
            </div>
        }
      </div>
      <CommentsBoxPhone open={commentOpen} onClose={() => setCommentOpen(false)} _id={currentVideo?._id} usermail={currentVideo?.usermail} />
    </>
  )
}

export default ShortVideoPhone
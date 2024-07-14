
import React, { useEffect, useState } from 'react'

const useIntersectionObserver = (targetref,poster,videourl, setVideos,videolength,setCurrentVideo) => {
    const [isVisible, setIsVisible] = useState(false);

    const callback = (entries, observer) => {
        const [entry] = entries;
        const video =entry.target;
        if(+video.id == videolength-2){
            setVideos(prev => [...prev,...prev])
        }
        if(entry.isIntersecting){
            setIsVisible(true)
            video.src = videourl;
            video.poster = poster;
            video.play()
            const _id = video.getAttribute('dataId');
            const usermail = video.getAttribute('usermail');
            setCurrentVideo({_id,usermail})
           
            

            
            
        }else{
          setIsVisible(false)
          video.pause();
          video.currentTime = 0;
     
        }
      }

    useEffect(() => {
        let options= {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        if(targetref){
            const io = new IntersectionObserver(callback,options);
            io.observe(targetref);
        }
       

        return () => {
            if(targetref){
                try {
                    io.unobserve(targetref)
                } catch (error) {
                    
                }
            }
        }
    },[targetref])
  return {isVisible}
}

export default useIntersectionObserver
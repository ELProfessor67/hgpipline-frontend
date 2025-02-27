import Browse from "./Components/Browse";
import Studio from "./Components/Studio";
import Error from "./Components/Error";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoSection from "./Components/VideoSection";
import LikeVideos from "./Components/LikeVideos";
import WatchLater from "./Components/WatchLater";
import OtherChannel from "./Components/Channel/OtherChannel";
import Subscriptions from "./Components/Subscriptions";
import Trending from "./Components/Trending";
import SearchResults from "./Components/SearchResults";
import Playlists from "./Components/Playlists";
import Library from "./Components/Library";
import Customization from "./Components/Studio/Customization";
import Content from "./Components/Studio/Content";
import VideoDetails from "./Components/Studio/VideoDetails";
import Comments from "./Components/Studio/Comments";
import VideoComments from "./Components/Studio/VideoComments";
import { ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import ytLogo from "./img/icon.png";

import "react-toastify/dist/ReactToastify.css";
import AddAds from "./Components/dashboard/AddAds";
import "./App.css"
import ShortVideoPhone from "./Components/ShortVideoPhone";
import { useEffect, useState } from "react";
import ShortVideoPC from "./Components/ShortVideoPC";

function App() {
  const token = localStorage.getItem("userToken");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 600px)'); // Adjust the width as per your requirement

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    handleMediaQueryChange(mediaQuery); // Initial check
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <BrowserRouter>
        <Helmet>
          <link rel="icon" type="image/x-icon" href={ytLogo} />
        </Helmet>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/home" element={<Browse />} />
          <Route path="/studio" element={token ? <Studio /> : <Error />} />
          <Route
            path="/studio/customize"
            element={token ? <Customization /> : <Error />}
          />
          <Route
            path="/studio/video"
            element={token ? <Content /> : <Error />}
          />
          <Route
            path="/studio/comments"
            element={token ? <Comments /> : <Error />}
          />
          <Route
            path="/studio/video/edit/:id"
            element={token ? <VideoDetails /> : <Error />}
          />
          <Route
            path="/studio/video/comments/:id"
            element={token ? <VideoComments /> : <Error />}
          />
          <Route
            path="/likedVideos"
            element={token ? <LikeVideos /> : <Error />}
          />
          <Route
            path="/watchlater"
            element={token ? <WatchLater /> : <Error />}
          />

          <Route path="/library" element={token ? <Library /> : <Error />} />
          <Route path="/channel/:id" element={<OtherChannel />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/results/:data" element={<SearchResults />} />
          <Route path="/playlist/:id" element={<Playlists />} />
          <Route path="/short" element={isMobile ? <ShortVideoPhone/>: <ShortVideoPC/>} />
          <Route
            path="/subscriptions"
            element={token ? <Subscriptions /> : <Error />}
          />
          <Route path="/video/:id" element={<VideoSection />} />

          {/* dashbaord  */}
          <Route path="/dashboard/add-ads" element={<AddAds/>}/>
          <Route path="/dashboard/add-ads" element={<AddAds/>}/>
          <Route path="/*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

import LeftPanel4 from "../LeftPanel4";
import Navbar3 from "../Navbar3";
import "../../Css/Studio/content.css";
import SouthIcon from "@mui/icons-material/South";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutline";
import VideoCallOutlinedIcon from "@mui/icons-material/MissedVideoCallOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import KeyboardTabOutlinedIcon from "@mui/icons-material/KeyboardTabOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import noImage from "../../img/no-video2.png";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ads from '../../img/social/ads.webp'
import { Link } from "react-router-dom";

import avatar from "../../img/avatar.png";
import "../../Css/studio.css";
import { storage } from "../../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Upload from "../../img/upload.png";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SdIcon from "@mui/icons-material/Sd";
import HdIcon from "@mui/icons-material/Hd";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import LinkIcon from "@mui/icons-material/Link";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import Dashboard from "../Studio/Dashboard";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { LiaUploadSolid } from "react-icons/lia";


function Content() {
  const backendURL = "https://backend.hgpipeline.com"
  const [userVideos, setUserVideos] = useState([]);
  const [sortByDateAsc, setSortByDateAsc] = useState(true);
  const [Email, setEmail] = useState();
  const [changeSort, setChangeSort] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [DeleteVideoID, setDeleteVideoID] = useState();
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [DeleteVideoData, setDeleteVideoData] = useState();
  const [boxclicked, setBoxClicked] = useState(false);
  const videoUrl = "https://shubho-youtube-mern.netlify.app/video";
  const [loading, setLoading] = useState(true);
  const [menu, setmenu] = useState(() => {
    const menu = localStorage.getItem("studioMenuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  
  const [isChannel, setisChannel] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState(avatar);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [ChannelName, setChannelName] = useState();
  const [ChannelAbout, setChannelAbout] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [isThumbnailSelected, setIsThumbnailSelected] = useState(false);
  const [videoName, setVideoName] = useState("Upload videos");
  const [VideoURL, setVideoURL] = useState("");
  const [Progress, setProgress] = useState(0);
  const [uploadTask, setUploadTask] = useState(null);
  const [videoDescription, setVideoDescription] = useState("");
  const [link, setLink] = useState("");
  const [duration, setDuration] = useState(null);
  const [linksClicked, setLinksClicked] = useState(false);
  const [iconClicked, setIconClicked] = useState("");
  const [fblink, setfblink] = useState();
  const [instalink, setinstalink] = useState();
  const [twitterlink, settwitterlink] = useState();
  const [websitelink, setwebsitelink] = useState();
  const [visibility, setVisibility] = useState("Public");
  const [isVisibilityClicked, setisVisibilityClicked] = useState(false);
  const [myVideos, setMyVideos] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  

  document.title = "Channel content - HGPIPELINE Studio";

  //TOASTS

  const CopiedNotify = () =>
    toast.success("Link Copied!", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

     //TOAST FUNCTIONS

  const CancelNotify = () =>
    toast.warning("Video upload was cancelled!", {
      position: "bottom-center",
      autoClose: 950,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const ErrorNotify = () =>
    toast.error("Image/Input can't be empty.", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const VideoErrorNotify = () =>
    toast.error("Input fields can't be empty.", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const ThumbnailNotify = () =>
    toast.warning("Please select a thumbnail!", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  //USE EFFECTS

  
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
    console.log(jwtDecode(token).email,"email")
  }, []);

  console.log(Email)

  useEffect(() => {
    if (theme === false && window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "#F9F9F9";
    } else if (theme === true && window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "rgb(31, 31, 31)";
    }
  }, [theme]);

  useEffect(() => {
    const getVideos = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `${backendURL}/getuservideos/${Email}`
          );
          const data = await response.json();
          setMyVideos(data);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getVideos()
  }, [Email]);

  useEffect(() => {
    const handleClick = () => {
      setIsClicked(true);
    };

    const uploadBtn = document.querySelector(".uploadnewone-video");
    if (uploadBtn) {
      uploadBtn.addEventListener("click", handleClick);

      return () => {
        if (uploadBtn) {
          uploadBtn.removeEventListener("click", handleClick);
        }
      };
    }
  }, []);

  useEffect(() => {
    const handleClick = () => {
      document.querySelector(".studio").classList.add("studio-dark");
    };

    const searchInp = document.getElementById("searchType2");

    if (searchInp) {
      searchInp.addEventListener("click", handleClick);
    }

    return () => {
      if (searchInp) {
        searchInp.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    const handleClick = () => {
      document.querySelector(".studio").classList.remove("studio-dark");
    };

    const crossBtn = document.querySelector(".clear-search");

    if (crossBtn) {
      crossBtn.addEventListener("click", handleClick);
    }

    return () => {
      if (crossBtn) {
        crossBtn.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    if (isChannel === false) {
      document.body.classList.add("bg-css");
    } else {
      document.body.classList.remove("bg-css");
    }
  }, [isChannel]);

  useEffect(() => {
    if (isClicked === true) {
      document.body.classList.add("bg-css");
    } else {
      document.body.classList.remove("bg-css");
    }
  }, [isClicked]);

  useEffect(() => {
    const ChannelAvailable = async () => {
      try {
        const response = await fetch(
          `${backendURL}/getchannel/${Email}`
        );
        const { channel } = await response.json();
        setisChannel(channel);
      } catch (error) {
        // console.log(error.message);
      }
    };

    ChannelAvailable()
  }, [Email]);


  useEffect(() => {
    if (theme === false && window.location.href.includes("/studio/video")) {
      document.body.style.backgroundColor = "white";
    } else if (
      theme === true &&
      window.location.href.includes("/studio/video")
    ) {
      document.body.style.backgroundColor = "#282828";
    }
  }, [theme]);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setmenu((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu2");
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("studioMenuClicked", JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3200);
  }, []);

  useEffect(() => {
    const handleClick = () => {
      document
        .querySelector(".channel-content-section")
        .classList.add("channel-dark");
    };

    const searchInp = document.getElementById("searchType2");

    if (searchInp) {
      searchInp.addEventListener("click", handleClick);
    }

    return () => {
      if (searchInp) {
        searchInp.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    const handleClick = () => {
      document
        .querySelector(".channel-content-section")
        .classList.remove("channel-dark");
    };

    const clearBtn = document.querySelector(".clear-search");

    if (clearBtn) {
      clearBtn.addEventListener("click", handleClick);
    }

    return () => {
      if (clearBtn) {
        clearBtn.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    const GetUserVideos = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `${backendURL}/all-ads?email=${Email}`
          );

          const data = await response.json();
          setUserVideos(data.ads);
          console.log(data,"dataaaa")
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    GetUserVideos()
  }, [Email]);

  console.log("dataaaa")

  useEffect(() => {
    const GetDeleteVideoData = async () => {
      try {
        if (DeleteVideoID !== undefined) {
          const response = await fetch(
            `${backendURL}/getdeletevideodata/${DeleteVideoID}`
          );

          const data = await response.json();
          setDeleteVideoData(data);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    GetDeleteVideoData()
  }, [DeleteVideoID]);

  const handleSortByDate = () => {
    setSortByDateAsc((prevState) => !prevState);
    setChangeSort(!changeSort);
  };

  const sortedUserVideos =
    userVideos &&
    userVideos.length > 0 &&
    userVideos.sort((a, b) => {
      if (sortByDateAsc) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  //POST REQUESTS

  const DeleteVideo = async (id) => {
    try {
      if (id !== undefined) {
        const response = await fetch(
          `${backendURL}/deletevideo/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        await response.json();
      }
    } catch (error) {
      // console.log(error.message);
    }
  };



  const downloadVideo = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = "video.mp4";
    link.click();
  };

  const DeleteVideoUploadDate = new Date(
    DeleteVideoData && DeleteVideoData.createdAt
  );


 

 



  

  // UPLOAD VIDEO

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    const fileSizeInMB = file.size / (1024 * 1024); // Convert file size to MB

    if (fileSizeInMB > 30) {
      alert("Please select a video file with a size of up to 30MB.");
      return;
    }

    setSelectedVideo(file);
    setIsVideoSelected(true);

    if (file) {
      const fileName = file.name;
      setVideoName(fileName.substring(0, fileName.lastIndexOf(".")));
      uploadVideo(file);
    }
  };

  const ClearState = () => {
    setIsClicked(false);
    setIsVideoSelected(false);
    setIsThumbnailSelected(false);
    setVideoName("Upload videos");
    setVideoDescription("");
  };

  const uploadVideo = async (videoFile) => {
    try {
      const fileReference = ref(storage, `ads/${videoFile.name}`);
      const uploadTask = uploadBytesResumable(fileReference, videoFile);
      setUploadTask(uploadTask); // Store the upload task

      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = async function () {
        const duration = videoElement.duration; // Duration in seconds
        // console.log("Video duration:", duration);
        setDuration(duration);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress if needed
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progress = Math.round(progress);
            setProgress(progress);
          },
          (error) => {
            // Handle error during upload
            console.log(error);
          },
          async () => {
            // Handle successful upload
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              // console.log("Video download URL:", downloadURL);
              setVideoURL(downloadURL);
              // Do something with the download URL, e.g., save it to the database
            } catch (error) {
              console.log(error);
            }
          }
        );
      };

      videoElement.src = URL.createObjectURL(videoFile);
    } catch (error) {
      // console.log(error);
    }
  };

  //CANCEL VIDEO UPLOAD

  const cancelVideoUpload = () => {
    if (uploadTask) {
      uploadTask.cancel();
      setIsVideoSelected(false);
      setVideoName("Upload videos");
      setProgress(0);
    }
  };

  //SAVE DATA TO DB



  //ON VIDEO DROP

  const handleUploadImageClick = () => {
    const fileInput = document.getElementById("videoFileInput");
    fileInput.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > 30) {
      alert("Please select a video file with a size of up to 30MB.");
      return;
    }

    setSelectedVideo(file);
    setIsVideoSelected(true);
    const fileName = file.name;
    setVideoName(fileName.substring(0, fileName.lastIndexOf(".")));
    uploadVideo(file);
  };

  //VIDEO DETAILS SECTION

  const handleTitleChange = (e) => {
    setVideoName(e.target.value);
  };
  //UPLOAD THUMBNAIL



  //SAVE UPLOAD DATA TO DATABASE

  const PublishData = async () => {
    if (videoName === "" || videoDescription === "" || link === "") {
      VideoErrorNotify();
    } else {
      try {
        setLoading(true);
        // Proceed with saving the data
        const data = {
          title: videoName,
          description: videoDescription,
          link: link,
          video: VideoURL
        };
        // Send the POST request
        const response = await fetch(`https://backend.hgpipeline.com/add-ads/${Email}`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Handle the response
        const Data = await response.json();
        console.log(Data)
        if (Data.success) {
          toast.success("Ads Upload Successfully");
          setIsPublished(true);
          setLoading(false);
          setIsClicked(false);
          window.location.reload();
        } else {
          setLoading(true);
          setIsClicked(true);
          setTimeout(() => {
            alert("An unknown error occurred, Please try again!");
          }, 1500);
        }
      } catch (error) {
        // console.log(error.message);
      }
    }
  };

  return (
    <>
      <Navbar3 />
      <LeftPanel4 />
      <div className="channel-content-section">
        <div
          className="channel-content-top"
          style={{ left: menu ? "125px" : "310px",width: "83%",position: "relative" }}
        >
            
            <p className={theme ? "" : "text-light-mode"}>Ads Content</p>

            <div style={{display: "flex",justifyContent: "end",}}>
            <div
              className={theme ? "create-btn" : "create-btn create-btn-light"}
              onClick={() => setIsClicked(true)}
              style={{ display: "flex",position: 'absolute',top: 0 } }
            >
              <VideoCallOutlinedIcon
                className=""
                fontSize="large"
                style={{ color: "#FF4E45" }}
              />
              <p className={theme ? "" : "text-light-mode"}>CREATE</p>
            </div>
            </div>
          
          <p
            className={theme ? "channel-videosss" : "channel-videosss blue-txt"}
          >
            Ads
          </p>
        </div>
        <hr
          className="breakk2 breakkk"
          style={{ left: menu ? "88px" : "262px" }}
        />
        <div
          className="channels-uploaded-videos-section"
          style={{ left: menu ? "90px" : "270px" }}
        >
          {sortedUserVideos && sortedUserVideos.length > 0 && (
            <table className="videos-table">
              <thead>
                <tr
                  style={{ color: theme ? "#aaa" : "black", fontSize: "14px" }}
                >
                  <th
                    style={{
                      textAlign: "left",
                      paddingLeft: "40px",
                      width: "45%",
                    }}
                  >
                    Ads
                  </th>
                  <th>Visibility</th>
                  <th onClick={handleSortByDate} className="date-table-head">
                    <div className="table-row">
                      <p className={theme ? "" : "text-light-mode"}>Date</p>
                      {changeSort === false ? (
                        <SouthIcon
                          fontSize="200px"
                          style={{
                            color: theme ? "white" : "black",
                            marginLeft: "5px",
                          }}
                        />
                      ) : (
                        <NorthOutlinedIcon
                          fontSize="200px"
                          style={{
                            color: theme ? "white" : "black",
                            marginLeft: "5px",
                          }}
                        />
                      )}
                    </div>
                  </th>
                  <th>Clicks</th>
                  <th>Views</th>
                  <th>CTR</th>
                </tr>
              </thead>
              <tbody>
                {sortedUserVideos.map((element, index) => {
                  const uploaded = new Date(element.createdAt);
                  return (
                    <tr
                      key={index}
                      className={
                        theme ? "table-roww" : "table-roww preview-lightt"
                      }
                      style={
                        loading === true
                          ? { pointerEvents: "none" }
                          : { pointerEvents: "auto" }
                      }
                    >
                      <td className="video-cell">
                        <SkeletonTheme
                          baseColor={theme ? "#353535" : "#aaaaaa"}
                          highlightColor={theme ? "#444" : "#b6b6b6"}
                        >
                          <div
                            className="no-skeleton"
                            style={
                              loading === true
                                ? { display: "flex" }
                                : { display: "none" }
                            }
                          >
                            <Skeleton
                              count={1}
                              width={150}
                              height={84}
                              style={{ marginLeft: "30px" }}
                            />
                          </div>
                        </SkeletonTheme>
                        <div
                          className="no-skeleton"
                          style={
                            loading === true
                              ? { visibility: "hidden", display: "none" }
                              : { visibility: "visible", display: "flex" }
                          }
                        >
                          <img
                            src={ads}
                            alt="thumbnail"
                            className="studio-video-thumbnail"
                            
                            style={{width: "11rem",height: "7rem",objectFit: "contain"}}
                          />
                          
                        </div>
                        <div className="studio-video-details">
                          <SkeletonTheme
                            baseColor={theme ? "#353535" : "#aaaaaa"}
                            highlightColor={theme ? "#444" : "#b6b6b6"}
                          >
                            <div
                              className="no-skeleton2"
                              style={
                                loading === true
                                  ? { display: "flex" }
                                  : { display: "none" }
                              }
                            >
                              <Skeleton
                                count={1}
                                width={250}
                                height={14}
                                style={{
                                  borderRadius: "3px",
                                  position: "relative",
                                  left: "25px",
                                }}
                              />
                              <Skeleton
                                count={1}
                                width={180}
                                height={10}
                                style={{
                                  borderRadius: "3px",
                                  position: "relative",
                                  top: "15px",
                                  left: "25px",
                                }}
                              />
                              <Skeleton
                                count={1}
                                width={140}
                                height={10}
                                style={{
                                  borderRadius: "3px",
                                  position: "relative",
                                  top: "18px",
                                  left: "25px",
                                }}
                              />
                            </div>
                          </SkeletonTheme>
                          <div
                            className="no-skeleton2"
                            style={
                              loading === true
                                ? { visibility: "hidden", display: "none" }
                                : { visibility: "visible", display: "flex" }
                            }
                          >
                            <p
                              className={
                                theme
                                  ? "studio-video-title"
                                  : "studio-video-title text-light-mode"
                              }
                              
                            >
                              {element.title.length <= 40
                                ? element.title
                                : `${element.title.slice(0, 40)}...`}
                            </p>
                            {element.description ? (
                              <p
                                className={
                                  theme
                                    ? "studio-video-desc"
                                    : "studio-video-desc text-light-mode2"
                                }
                              >
                                {element.description.length <= 85
                                  ? element.description
                                  : `${element.Description.slice(0, 85)}...`}
                              </p>
                            ) : (
                              <p>Add description</p>
                            )}
                          </div>
                          <div className="video-editable-section">
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Details"
                              placement="bottom"
                            >
                              <ModeEditOutlineOutlinedIcon
                                className={
                                  theme
                                    ? "video-edit-icons"
                                    : "video-edit-icons-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/edit/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Delete"
                              placement="bottom"
                            >
                              <DeleteForeverOutlined

                                className={
                                  theme
                                    ? "video-edit-icons"
                                    : "video-edit-icons-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/comments/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="privacy-table">
                          {element.visibility != "Public" ? (
                            <RemoveRedEyeOutlinedIcon
                              fontSize="small"
                              style={{ color: "#2ba640" }}
                            />
                          ) : (
                            <VisibilityOffOutlinedIcon
                              fontSize="small"
                              style={{
                                color: theme
                                  ? "rgb(170 170 170 / 53%)"
                                  : "#909090",
                              }}
                            />
                          )}
                          <p
                            className={theme ? "" : "text-light-mode2"}
                            style={{ marginLeft: "8px" }}
                          >
                            {element.visibility}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p className={theme ? "" : "text-light-mode2"}>
                          {uploaded.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </td>
                      <td>
                        <p className={theme ? "" : "text-light-mode2"}>
                          {element.click}
                        </p>
                      </td>
                      <td>
                        <p className={theme ? "" : "text-light-mode2"}>
                          {element.views}
                        </p>
                      </td>
                      <td>
                        <p className={theme ? "" : "text-light-mode2"}>
                          {Math.floor(element.CTR)}%
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div
          className="novideo-available"
          style={
            userVideos && userVideos.message === "USER DOESN'T EXIST"
              ? { display: "flex" }
              : { display: "none" }
          }
        >
          <img src={noImage} alt="no-video" className="no-content-img" />
          <p>No content available</p>
        </div>
      </div>
      <div
        className={
          theme
            ? "last-delete-warning"
            : "last-delete-warning light-mode text-light-mode"
        }
        style={
          isDeleteClicked === true && DeleteVideoData
            ? { display: "block" }
            : { display: "none" }
        }
      >
        <div className="delete-question">
          <p>Permanently delete this video?</p>
        </div>
        <div className="deleted-video-data">
          <div
            className={
              theme ? "thisdelete-data" : "thisdelete-data social-lightt"
            }
          >
            <img
              src={DeleteVideoData && DeleteVideoData.thumbnailURL}
              alt="thumbnail"
              className="deletevideo-thumbnail"
            />
            <p className="thisdelete-duration">
              {Math.floor(DeleteVideoData && DeleteVideoData.videoLength / 60) +
                ":" +
                (Math.round(
                  DeleteVideoData && DeleteVideoData.videoLength % 60
                ) < 10
                  ? "0" +
                    Math.round(
                      DeleteVideoData && DeleteVideoData.videoLength % 60
                    )
                  : Math.round(
                      DeleteVideoData && DeleteVideoData.videoLength % 60
                    ))}
            </p>
            <div className="thisdelete-video-details">
              <p className="delete-title">
                {DeleteVideoData && DeleteVideoData.Title.length <= 15
                  ? DeleteVideoData.Title
                  : `${
                      DeleteVideoData && DeleteVideoData.Title.slice(0, 15)
                    }...`}
              </p>
              <p
                className={
                  theme ? "delete-uploaded" : "delete-uploaded text-light-mode2"
                }
              >
                {"Uploaded " +
                  DeleteVideoUploadDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
              <p
                className={
                  theme ? "delete-views" : "delete-views text-light-mode2"
                }
              >
                {DeleteVideoData && DeleteVideoData.views + " views"}
              </p>
            </div>
          </div>
        </div>
        <div className="delete-consent">
          <CheckBoxOutlineBlankIcon
            onClick={() => {
              setBoxClicked(!boxclicked);
            }}
            fontSize="medium"
            style={
              boxclicked === false
                ? { color: theme ? "#aaa" : "#606060", cursor: "pointer" }
                : { display: "none" }
            }
          />
          <CheckBoxIcon
            onClick={() => {
              setBoxClicked(!boxclicked);
            }}
            fontSize="medium"
            style={
              boxclicked === true
                ? { color: theme ? "white" : "606060", cursor: "pointer" }
                : { display: "none" }
            }
          />
          <p>
            I understand that deleting a video from HGPIPELINE is permanent and
            cannot be undone.
          </p>
        </div>
        <div className="delete-video-buttons">
          <button
            className={
              theme
                ? "download-delete-video delete-css"
                : "download-delete-video delete-css blue-txt"
            }
            onClick={() => {
              if (DeleteVideoData) {
                downloadVideo(DeleteVideoData.videoURL);
              }
            }}
          >
            DOWNLOAD VIDEO
          </button>
          <div className="extra-two-delete-btns">
            <button
              className={
                theme
                  ? "cancel-delete delete-css"
                  : "cancel-delete delete-css blue-txt"
              }
              onClick={() => {
                setIsDeleteClicked(false);
                document.body.classList.remove("bg-css2");
                window.location.reload();
              }}
            >
              CANCEL
            </button>
            <button
              className={
                theme
                  ? "delete-video-btn delete-css"
                  : `delete-video-btn delete-css ${
                      !boxclicked ? "" : "blue-txt"
                    }`
              }
              disabled={!boxclicked}
              onClick={() => {
                if (boxclicked === true && DeleteVideoData) {
                  DeleteVideo(DeleteVideoData._id);
                  setTimeout(() => {
                    window.location.reload();
                  }, 300);
                }
              }}
              style={{
                opacity: boxclicked === false ? 0.7 : 1,
                color: boxclicked === false ? "#aaa" : "#3eaffe",
                cursor: boxclicked === false ? "not-allowed" : "pointer",
              }}
            >
              DELETE VIDEO
            </button>
          </div>
        </div>
      </div>

      <div className={theme ? "studio" : "studio studio-light"} style={{marginTop: "-1rem"}}>
        
        <div
          className={
            theme
              ? "upload-content"
              : "upload-content light-mode text-light-mode"
          }
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={
            isClicked === true
              ? { display: "flex" }
              : { display: "none" }
          }
        >
          <div className="top-head">
            {videoName.length <= 70
              ? videoName
              : `${videoName.slice(0, 40)}...`}{" "}
            <CloseRoundedIcon
              className="close"
              fontSize="large"
              style={{ color: "gray" }}
              onClick={() => {
                if (Progress !== 100 && selectedVideo !== null) {
                  cancelVideoUpload();
                  CancelNotify();
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                } else if (Progress === 100 && isPublished === false) {
                  CancelNotify();
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
                if (isClicked === true) {
                  ClearState();
                }
              }}
            />
          </div>
          <hr
            className={
              theme ? "seperate seperate2" : "seperate seperate2 seperate-light"
            }
          />
          <div
            className="middle-data"
            style={
              isVideoSelected === false
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            <img
              src={Upload}
              className={theme ? "upload-img" : "upload-img upload-img-light"}
              onClick={handleUploadImageClick}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            />
            <p>Drag and drop video files to upload</p>
            <p>Your videos will be private until you publish them.</p>
            <div className="upload-btn-wrapper">
              <button className={theme ? "btn" : "btn text-dark-mode"}>
                SELECT FILES
              </button>
              <input
                id="videoFileInput"
                type="file"
                name="videoFile"
                accept="video/mp4"
                onChange={handleVideoChange}
              />
            </div>
          </div>
          <div
            className="uploading-video-data"
            style={
              isVideoSelected === true
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            <div className="left-video-section">
              <form className="details-form">
                <div className="details-section">
                  <p>Details</p>
                  <input
                    type="text"
                    className={theme ? "video-title" : "video-title light-mode"}
                    value={videoName}
                    placeholder="Title (required)"
                    required
                    onChange={handleTitleChange}
                  />
                  <textarea
                    type="text"
                    className={
                      theme
                        ? "video-description"
                        : "video-description light-mode"
                    }
                    placeholder="Description"
                    onChange={(e) => setVideoDescription(e.target.value)}
                    spellCheck="true"
                  />

                  <input
                    type="text"
                    className={theme ? "video-tags" : "video-tags light-mode"}
                    placeholder="Website Link"
                    onChange={(e) => setLink(e.target.value)}
                  />
                  
                </div>
              </form>
              <div className="video-tag-section"></div>
            </div>
            <div className="right-video-section">
              <div
                className={
                  theme ? "preview-video" : "preview-video preview-light"
                }
              >
                <div
                  className="preview-img"
                  style={
                    Progress === 100 && VideoURL !== ""
                      ? { display: "none" }
                      : { display: "block" }
                  }
                >
                  <p className={theme ? "" : "text-light-mode"}>Uploading video...</p>
                </div>
                {Progress === 100 && VideoURL !== "" ? (
                  <iframe
                    width="284.44"
                    height="160"
                    src={VideoURL}
                    title="HGPIPELINE video player"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                ) : null}
              </div>

              <div
                className={
                  theme ? "preview-bottom" : "preview-bottom preview-light2"
                }
              >
                <div className="file-details">
                  <p>Filename</p>
                  <p>{videoName}</p>
                </div>
              </div>

            </div>
          </div>
          <div
            className="last-segment"
            style={
              isVideoSelected === true
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <hr
              className={
                theme
                  ? "seperate seperate2"
                  : "seperate seperate2 seperate-light"
              }
            />
            <div className="last-btn">
              <div className="left-icons">
                <CloudUploadIcon
                  className="left-ic"
                  fontSize="large"
                  style={
                    Progress === 100
                      ? { display: "none" }
                      : { color: "gray", marginRight: "6px" }
                  }
                />
                <SdIcon
                  className="left-ic"
                  fontSize="large"
                  style={
                    Progress >= 60
                      ? { display: "none" }
                      : { color: "gray", marginLeft: "6px" }
                  }
                />
                <CloudDoneRoundedIcon
                  className="left-ic"
                  fontSize="large"
                  style={
                    Progress === 100
                      ? {
                        display: "block",
                        color: "#3ea6ff",
                        marginRight: "6px",
                        animation: "none",
                      }
                      : { display: "none" }
                  }
                />
                <HdIcon
                  className="left-ic"
                  fontSize="large"
                  style={
                    Progress >= 60
                      ? {
                        display: "block",
                        color: "#3ea6ff",
                        marginLeft: "6px",
                        animation: "none",
                      }
                      : { display: "none" }
                  }
                />
                <p
                  style={
                    Progress === 100
                      ? { display: "none" }
                      : { marginLeft: "12px" }
                  }
                >
                  Uploading {Progress}% ...
                </p>
                <p
                  style={
                    Progress === 100
                      ? { marginLeft: "12px" }
                      : { display: "none" }
                  }
                >
                  Video ads uploaded
                </p>
              </div>
              {loading ? (
                <button
                  className={
                    loading || Progress !== 100
                      ? "save-video-data-disable"
                      : "save-video-data"
                  }
                  onClick={PublishData}
                  disabled={loading === true || Progress !== 100 ? true : false}
                >
                  <span className="loader3"></span>
                </button>
              ) : (
                <button
                  className={
                    loading || Progress !== 100
                      ? `save-video-data-disable ${theme ? "" : "text-dark-mode"
                      }`
                      : `save-video-data ${theme ? "" : "text-dark-mode"}`
                  }
                  onClick={PublishData}
                  disabled={loading === true || Progress !== 100 ? true : false}
                >
                  PUBLISH
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Content;

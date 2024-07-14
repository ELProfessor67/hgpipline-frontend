import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Tooltip from "@mui/material/Tooltip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import jwtDecode from 'jwt-decode';
import { Avatar } from '@mui/material';
import defaultAvatar from '../img/avatar.png';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import nocommentpng from '../img/no-comment.png'
const backendURL = "https://backend.hgpipeline.com";
import { Sheet } from 'react-modal-sheet';
import { styled } from 'styled-components';


const CustomSheet = styled(Sheet)`
  .react-modal-sheet-backdrop {
    /* custom styles */
  }
  .react-modal-sheet-container {
    
  }
  .react-modal-sheet-header {
    background: #292929;
  }
  .react-modal-sheet-drag-indicator {
    /* custom styles */
  }
  .react-modal-sheet-content {
    background: #292929;
  }
`;

const CommentsBoxPhone = ({ open, onClose, _id, usermail }) => {

  const [comments, setComments] = useState([]);
  const [commentsHeart, setCommentsHeart] = useState([]);
  const [commentsLike, setCommentsLikes] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [ChannelProfile, setChannelProfile] = useState(null)

  const [email, setEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

        if(token){

            let email = jwtDecode(token).email;
            setEmail(email)
            console.log(usermail, email, 'ssssssssssssss')
        }
  }, []);


  useEffect(() => {
    (async function () {
      const youtuberRes = await axios.get(`${backendURL}/subscribe/${usermail}`);
      const { channel, profile, channelid } = youtuberRes.data;
      setChannelProfile(profile);

    })()
  }, [_id])



  async function getComments(_id) {
    console.log("aaayaaa")
    try {
      const res = await axios.get(`${backendURL}/getcomments/${_id}`);
      console.log(res.data, "comments data")
      const result = res.data;
      setComments(result);
      return res.data

    } catch (error) {
      console.log(error.message, "While getting comments");
    }
  }

  async function getCommentsHearts(_id) {
    try {
      const res = await axios.get(`${backendURL}/getheartcomment/${_id}`);
      console.log(res.data, "comments heart data")
      const result = res.data;
      setCommentsHeart(result);
      return res.data
    } catch (error) {
      console.log(error.message, "While getting comments");
    }
  }

  async function getCommentsLikes(_id) {
    try {
      const res = await axios.get(`${backendURL}/likecomment/${_id}`);
      console.log(res.data, "comments like data")
      const result = res.data;
      setCommentsLikes(result);
      return res.data
    } catch (error) {
      console.log(error.message, "While getting comments");
    }
  }

  async function getData(_id) {
    try {
      setLoading(true)
      await Promise.all([getComments(_id), getCommentsLikes(_id), getCommentsHearts(_id)])
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error.message, "While getting comments");
    }
  }

  useEffect(() => {
    if (open && _id) {
      getData(_id);
    }
  }, [open, _id])



  useEffect(() => {
    const getChannel = async (email) => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `${backendURL}/getchannel/${email}`
          );
          const { channel, profile } = await response.json();
          setUserProfile(profile);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    if (email && !userProfile) {

      getChannel(email);
    }
  }, [email]);



  const handleUplaodComments = async () => {
    if (!email) {
      toast.error("pleae login first");
      return
    }
    if (!commentText) {
      toast.error("Please add text in commnet box.");
      return
    }
    try {

      const youtuberRes = await axios.get(`${backendURL}/subscribe/${usermail}`);
      const { channel, profile, channelid } = youtuberRes.data;
      const data = {
        comment: commentText,
        email,
        channelID: channelid,
      };
      const res = await axios.post(`${backendURL}/comments/${_id}`, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(res.data, "upload comments")
      toast.success("comment upload successfully")
      setCommentText('');

      await getData(_id)
    } catch (error) {

    }

  }


  const LikeComment = async (commentId) => {
    try {
      if (commentId && _id && email) {
        const response = await fetch(
          `${backendURL}/likecomment/${_id}/${commentId}/${email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        await response.json();
        await getData(_id)
      }
    } catch (error) {
      //console.log(error.message);
    }
  };



  const DeleteComment = async (commentId) => {
    try {


      const response = await fetch(
        `${backendURL}/deletecomment/${_id}/${commentId}/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data === "Comment Deleted") {
        toast.success("Comment delete successfully.")
      }
      await getData(_id);
      // window.location.reload();
    } catch (error) {
      //console.log(error.message);
    }
  };



  const HeartComment = async (commentID) => {
    try {

      if (_id) {
        const response = await fetch(
          `${backendURL}/heartcomment/${_id}/${commentID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        await response.json();
      }
      await getData(_id)
    } catch (error) {
      //console.log(error.message);
    }
  };
  return (
    <>
      <CustomSheet isOpen={open} onClose={onClose}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className='phone-comments-container'>
            {
                    !loading && comments.length != 0 &&
              <div className='comment-box-phone'>
                {
                  comments && comments.map((element, index) => {
                    return (

                      <div
                        className="comment-data"
                        key={index}
                        style={{
                          transition: "all 0.15s ease",
                          opacity: 1,
                        }}
                      >
                        <div className="comment-left-data">
                          <img
                            src={element.user_profile}
                            alt="commentDP"
                            className="commentDP"
                            loading="lazy"
                            onClick={() => {
                              if (element.channel_id !== undefined) {
                                window.location.href = `/channel/${element.channel_id}`;
                              }
                            }}
                          />
                        </div>
                        <div
                          className={
                            "comment-right-data"
                          }
                        >
                          <div className="comment-row1">
                            <p
                              onClick={() => {
                                if (element.channel_id !== undefined) {
                                  window.location.href = `/channel/${element.channel_id}`;
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {element.username}
                            </p>
                            <p className="comment-time">
                              {(() => {
                                const timeDifference =
                                  new Date() - new Date(element.time);
                                const minutes = Math.floor(
                                  timeDifference / 60000
                                );
                                const hours = Math.floor(
                                  timeDifference / 3600000
                                );
                                const days = Math.floor(
                                  timeDifference / 86400000
                                );
                                const weeks = Math.floor(
                                  timeDifference / 604800000
                                );
                                const years = Math.floor(
                                  timeDifference / 31536000000
                                );

                                if (minutes < 1) {
                                  return "just now";
                                } else if (minutes < 60) {
                                  return `${minutes} mins ago`;
                                } else if (hours < 24) {
                                  return `${hours} hours ago`;
                                } else if (days < 7) {
                                  return `${days} days ago`;
                                } else if (weeks < 52) {
                                  return `${weeks} weeks ago`;
                                } else {
                                  return `${years} years ago`;
                                }
                              })()}
                            </p>
                          </div>
                          <p className="main-comment">{element.comment}</p>
                          <div className="comment-interaction">
                            <ThumbUpIcon
                              fontSize="small"
                              style={{
                                color: "white",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                if (email) {
                                  LikeComment(element._id);
                                }
                              }}
                              className="comment-like"
                            />

                            <p style={{ marginLeft: "16px" }}>
                              {commentsLike &&
                                commentsLike[index] &&
                                commentsLike[index].likes}
                            </p>

                            {commentsHeart[index] === false ? (
                              <FavoriteBorderOutlinedIcon
                                fontSize="small"
                                style={
                                  email === usermail


                                    ? {
                                      color: "white",
                                      marginLeft: "20px",
                                      cursor: "pointer",
                                    }
                                    : { display: "none" }
                                }
                                className="heart-comment"
                                onClick={() => {
                                  if (email === usermail) {

                                    HeartComment(element._id);
                                  }
                                }}
                              />
                            ) : (
                              <Tooltip
                                // TransitionComponent={Zoom}
                                title="Liked!"
                                placement="bottom"
                              >
                                <div
                                  className="heart-liked"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (email === usermail) {
                                      HeartComment(element._id);
                                    }
                                  }}
                                >
                                  <img
                                    src={ChannelProfile}
                                    alt="commentDP"
                                    className="heartDP"
                                    loading="lazy"
                                  />
                                  <FavoriteIcon
                                    fontSize="100px"
                                    style={{ color: "rgb(220, 2, 2)" }}
                                    className="comment-heart"
                                  />
                                </div>
                              </Tooltip>
                            )}

                            {element.user_email === email ||
                              email === usermail ? (
                              <button
                                className={
                                  "delete-comment-btn"
                                }
                                style={{ marginLeft: "17px" }}
                                onClick={() => DeleteComment(element._id)}
                              >
                                Delete
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
}


              {
                    loading &&
                    <div className='loading-container-phone'>
                        <div className='loader'></div>
                    </div>
                }

                {
                    !loading && comments.length == 0 &&
                    <div className='loading-container-phone'>
                        <img src={nocommentpng} style={{width: '10rem'}}/>
                    </div>
                }
              <div className='comment-input-phone'>
                <Avatar src={userProfile || defaultAvatar} />
                <input type='text' placeholder='Add Comment' value={commentText} onChange={(e) => setCommentText(e.target.value)} />

                <button onClick={handleUplaodComments}>
                  <SendIcon />
                </button>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </CustomSheet>
    </>
  )
}

export default CommentsBoxPhone
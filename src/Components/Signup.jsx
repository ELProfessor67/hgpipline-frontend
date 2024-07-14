import { useState } from "react";
import "../Css/navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OtpInput from 'react-otp-input';

function Signup() {
  const backendURL = "https://backend.hgpipeline.com"
  const [data, setData] = useState({});
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [hash, setHash] = useState({});
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  //TOASTS

  const SignupNotify = () =>
    toast.success("Signup successfull!", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const ErrorNotify = () =>
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

  const EmailErrorNotify = (data) =>
    toast.error(data, {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const handleInputs = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitData = async (e) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.password) {
      ErrorNotify();
      return;
    }
    try {
      const response = await fetch(`${backendURL}/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message, encrypted } = await response.json();

      
      if (message === "OTP Send To Your email") {
        setHash(encrypted);
        setShowOtp(true);
        console.log(encrypted)
        toast.success(message)
      }
      else {
        EmailErrorNotify(message)
      }
    } catch (error) {
      alert(error.message);
    }
  };


  const handleVeify = async (e) => {
    e.preventDefault();
    
    try {

      const data = {
        hash,
        otp
      }
      const response = await fetch(`${backendURL}/verify`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message, token } = await response.json();

     
      if (message === "Login Successfully") {
        SignupNotify();
        localStorage.setItem("userToken", token);
        setTimeout(() => {
          window.location.reload();
          document.body.classList.remove("bg-class");
        }, 2000);
      }
      else {
        EmailErrorNotify(message)
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="above-data">
        <p className="signup-head">Create Your Account</p>
        <p className="signup-desc">
          Unlock Your World of Entertainment, Unlock Your World of
          Entertainment, Join the HGPIELINE Community
        </p>
      </div>
      <div className="signup-form">
        {
          showOtp ?
            (
              <div>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  containerStyle={{justifyContent: 'center'}}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} className={theme ? "input-box-dark": "input-box-light"}/>}
                  
                />
                <p className="signup-desc" style={{fontSize: '1rem',margin: '1.5rem 0 0 0'}}>An OTP has been send to your email. Please check your inbox.</p>
                <button
                  className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
                  type="submit"
                  style={{width: '100%',marginTop: "20px"}}
                  onClick={handleVeify}
                >
                  Verify
                </button>
              </div>
            )
            :
            (
              <form onSubmit={SubmitData}>
                <input
                  type="text"
                  name="name"
                  className={
                    theme
                      ? "username"
                      : "username email-light light-mode text-light-mode"
                  }
                  placeholder="Name"
                  required
                  onChange={handleInputs}
                />
                <input
                  type="email"
                  name="email"
                  className={
                    theme ? "email" : "email email-light light-mode text-light-mode"
                  }
                  placeholder="Email Address"
                  required
                  onChange={handleInputs}
                />
                <input
                  type="password"
                  name="password"
                  className={
                    theme
                      ? "password"
                      : "password email-light light-mode text-light-mode"
                  }
                  placeholder="Password"
                  required
                  onChange={handleInputs}
                />
                <button
                  className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
                  type="submit"
                >
                  Create Your Account
                </button>
              </form>
            )
        }

      </div>
    </>
  );
}

export default Signup;

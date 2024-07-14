import { useEffect, useState } from "react";
import "../Css/navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Reset from "./Reset";
import OtpInput from 'react-otp-input';

function Signin(prop) {
  const backendURL = "https://backend.hgpipeline.com"
  const [data, setData] = useState({});
  const [showReset, setShowReset] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [hash, setHash] = useState({});
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  useEffect(() => {
    if (prop.close === true) {
      setShowReset(false);
    }
  }, [prop.close]);

  useEffect(() => {
    if (prop.switch === false) {
      setShowReset(false);
    }
  }, [prop.switch]);

  //TOASTS

  const LoginNotify = () =>
    toast.success("Login successfull!", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const InvalidNotify = () =>
    toast.error("Invalid Credentials!", {
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

  const NoUserNotify = () =>
    toast.error("User doesn't exists.", {
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
    if (!data.email1 || !data.password1) {
      ErrorNotify();
      return;
    }
    try {
      const response = await fetch(`${backendURL}/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message, encrypted } = await response.json();

     
      
      if (message === "OTP send to your email") {
        setHash(encrypted);
        setShowOtp(true);
        console.log(encrypted)
        toast.success(message)
      } else if (message === "INVALID CREDENTIALS") {
        InvalidNotify();
      } else if (message === "USER DOESN'T EXIST") {
        InvalidNotify();
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
        LoginNotify();
        localStorage.setItem("userToken", token);
        setTimeout(() => {
          window.location.reload();
          document.body.classList.remove("bg-class");
        }, 2000);
      }
      else {
        toast.error(message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div
        className="above-data"
        style={{ display: showReset ? "none" : "block" }}
      >
        <p className="signup-head">Login to Your Account</p>
        <p className="signup-desc">
          Stay Connected-Stay Entertained, Step into the World of HGPIPELINE, Join
          the HGPIELINE Community
        </p>
      </div>
      <div
        className="signup-form"
        style={{ display: showReset ? "none" : "flex" }}
      >
        {
          showOtp ?

            (
              <div>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  containerStyle={{ justifyContent: 'center' }}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} className={theme ? "input-box-dark" : "input-box-light"} />}

                />

                <p className="signup-desc" style={{fontSize: '1rem',margin: '1.5rem 0 0 0'}}>An OTP has been send to your email. Please check your inbox.</p>
                <button
                  className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
                  type="submit"
                  style={{ width: '100%', marginTop: "20px" }}
                  onClick={handleVeify}
                >
                  Verify
                </button>
              </div>
            ) :
            (
              <form onSubmit={SubmitData}>
                <input
                  type="email"
                  name="email1"
                  className={
                    theme ? "email" : "email email-light light-mode text-light-mode"
                  }
                  placeholder="Email Address"
                  onChange={handleInputs}
                  required
                />
                <input
                  type="password"
                  name="password1"
                  className={
                    theme
                      ? "password"
                      : "password email-light light-mode text-light-mode"
                  }
                  placeholder="Password"
                  onChange={handleInputs}
                  required
                />
                <p
                  className={
                    theme ? "forgot-password" : "forgot-password text-light-mode"
                  }
                  onClick={() => setShowReset(true)}
                >
                  Forgot password?
                </p>
                <button
                  className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
                  type="submit"
                >
                  Login to Your Account
                </button>
              </form>
            )
        }

      </div>
      <div
        className="password-reset"
        style={{ display: showReset ? "block" : "none" }}
      >
        <Reset />
      </div>
    </>
  );
}

export default Signin;

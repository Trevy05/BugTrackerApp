import { useState, useEffect } from "react";

import "./SignInUp.css";

function SignInUp({ handleAuthentication }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    checkAuthentication();
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setFormError("Passwords do not match");
        return;
      }

      const { username, email, password } = formData;

      // Call sign up API endpoint
      try {
        const response = await fetch(
          "https://bug-tracker-av8h.onrender.com/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setFormError(errorData.message);
          return;
        }

        const savedUser = await response.json();
        localStorage.setItem("currentUser", JSON.stringify(savedUser)); // Save user to localStorage
        handleAuthentication(savedUser);
      } catch (error) {
        console.error(error);
        setFormError("Error creating user");
      }
    } else {
      // Perform sign in logic here
      const { email, password } = formData;

      // Call sign in API endpoint
      try {
        const response = await fetch(
          "https://bug-tracker-av8h.onrender.com/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setFormError(errorData.message);
          return;
        }

        const user = await response.json();
        localStorage.setItem("currentUser", JSON.stringify(user)); // Save user to localStorage
        handleAuthentication(user);
      } catch (error) {
        console.error(error);
        setFormError("Error signing in");
      }
    }

    // Call the handleAuthentication callback with the signed in user object
    handleAuthentication({ email: formData.email });
  };

  const handleSignUp = () => {
    setIsSignUp(true);
  };

  const handleSignIn = () => {
    setIsSignUp(false);
  };

  const checkAuthentication = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      // User is authenticated
      handleAuthentication(JSON.parse(currentUser));
    }
  };

  return (
    <div className="background-container">
      <div className="sign-in-up-container">
        <div className="sign-in-up-form-container">
          <div className="title">
            <a href="#Home">Bug Tracker</a>
            <img
              src={"https://cdn-icons-png.flaticon.com/128/3097/3097849.png"}
              id="logo"
              alt="pro"
            ></img>
          </div>
          <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
          <form onSubmit={handleFormSubmit}>
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="username"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            {formError && <div className="form-error">{formError}</div>}
            <button className="signup-form" type="submit">
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <div>
            {isSignUp ? (
              <div className="signup-form">
                <p>
                  Already have an account?{" "}
                  <button onClick={handleSignIn}>Sign In</button>
                </p>
              </div>
            ) : (
              <div className="signin-form">
                <p>
                  Need an account?{" "}
                  <button onClick={handleSignUp}>Sign Up</button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInUp;

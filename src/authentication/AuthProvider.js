// AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import axiosInstance from './axios.config';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
   // eslint-disable-next-line
  const [_, setRefreshToken] = useState(null);

  useEffect(() => {
    // Check if the user is already logged in (e.g., token in localStorage)
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedToken) {
      // Verify the token with the backend (this endpoint should validate the token)
      axiosInstance
        .post('/auth/verify-token/', { token: storedToken })
        .then((response) => {
          // Token is valid
          setUser(response.data.user);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          // Token is invalid or expired, try refreshing the token
          if (storedRefreshToken) {
            axiosInstance
              .post('/auth/token/refresh/', { refresh: storedRefreshToken })
              .then((response) => {
                const token = response.data.token;
                const newRefreshToken = response.data.refreshToken;
                localStorage.setItem('token', token);
                setRefreshToken(newRefreshToken);
                setUser(response.data.user);
                setIsAuthenticated(true);
              })
              .catch((error) => {
                // Refresh token failed, user needs to log in again
                console.error(error);
                logout();
              });
          } else {
            // User needs to log in again
            console.error(error);
            logout();
          }
        });
    }
  }, []);

  // Function to handle user registration and store the refresh token
  const signup = (userData) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post('/auth/signup/', userData)
        .then((response) => {
          // Registration successful, log in the user
          login(userData?.email, userData?.password);
          resolve(response.data); // Resolve with the response data if successful
        })
        .catch((error) => {
          // Handle the error and reject with an error message
          const errorMessage =
            error.response?.data?.message || 'Signup failed. Please try again.';
          reject(errorMessage);
        });
    });
  };
  // Function to handle user login and store the refresh token
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post('/auth/login/', { email, password })
        .then((response) => {
          const token = response?.data?.access;
          const newRefreshToken = response?.data?.refresh;
          const user = response?.data?.user;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          localStorage.setItem('user', JSON.stringify(user));
          setRefreshToken(newRefreshToken);
          setUser(user);
          setIsAuthenticated(true);
  
          // Resolve the Promise with the user data
          resolve(user);
        })
        .catch((error) => {
          console.error(error);
  
          // Reject the Promise with an error message
          const errorMessage = error?.response?.data?.message || 'Login failed. Please try again.';
          reject(errorMessage);
        });
    });
  };
  
  const changePassword = (email, old_password, new_password) => {
    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem('token');
  
      if (!accessToken) {
        reject('Access token not available.'); // Handle the case where the access token is not available
        return;
      }
  
      const headers = {
        Authorization: `Bearer ${accessToken}`, // Add the access token to the Authorization header
      };
  
      axiosInstance
        .post('/auth/change-password/', { old_password, new_password }, { headers })
        .then((response) => {
          resolve(response.data); // Resolve with the response data if successful
        })
        .catch((error) => {
          // Handle the error and reject with an error message
          const errorMessage =
            error.response?.data?.message || 'Password Change failed. Please try again.';
          reject(errorMessage);
        });
    });
  };
  

  // Function to update the user's profile with optional parameters
  const updateProfile = ({
    email,
    first_name,
    last_name,
    bio,
    phone_number,
    profile_image,
  }) => {
    const formData = new FormData();
    if (email) formData.append('email', email);
    if (first_name) formData.append('first_name', first_name);
    if (last_name) formData.append('last_name', last_name);
    if (bio) formData.append('bio', bio);
    if (phone_number) formData.append('phone_number', phone_number);
    if (profile_image && profile_image?.length > 0 && profile_image[0]?.originFileObj) {
      formData.append('profile_image', profile_image[0]?.originFileObj);
    }

    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem('token');

    if (!accessToken) {
      reject('Access token not available.'); // Handle the case where the access token is not available
      return;
    }


    const headers = {
      Authorization: `Bearer ${accessToken}`, // Add the access token to the Authorization header
      'Content-Type': 'multipart/form-data', // Add the content type header for FormData
    };
      axiosInstance
        .put('/auth/update-profile/', formData, { headers })
        .then((response) => {
          // Update the user object in the state with the new profile data
          setUser((prevUser) => ({
            ...prevUser,
            email: email || prevUser.email,
            first_name: first_name || prevUser.first_name,
            last_name: last_name || prevUser.last_name,
            bio: bio || prevUser.bio,
            phone_number: phone_number || prevUser.phone_number,
            profile_image: response?.data?.profile_image || null,
          }));
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const resetPasswordLinkRequest = (email) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post('/auth/generate-reset-link/', {email })
        .then((response) => {
          // Registration successful, log in the user
          resolve(response.data); // Resolve with the response data if successful
        })
        .catch((error) => {
          // Handle the error and reject with an error message
          const errorMessage = "Email not found. Please try again."
          reject(errorMessage);
        });
    });
  };

  const resetPassword = (token, new_password) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post('/auth/reset-password/', {token, new_password })
        .then((response) => {
          // Registration successful, log in the user
          resolve(response.data); // Resolve with the response data if successful
        })
        .catch((error) => {
          // Handle the error and reject with an error message
          const errorMessage =
            error.response?.data?.message || 'Password reset failed. Please try again.';
          reject(errorMessage);
        });
    });
  };
  // Function to handle user logout and clear the refresh token
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    setRefreshToken(null);
  };

  // Function to check if the user is logged in
  const checkAuthStatus = () => {
    return isAuthenticated;
  };

  return (
    <AuthContext.Provider 
      value={{ user, isAuthenticated, login, logout, checkAuthStatus, signup, changePassword, updateProfile, resetPasswordLinkRequest, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        // Make a POST request to your server's /oauth2callback endpoint
        const tokens = await axios.post(
          `http://localhost:3000/oauth2callback`,
          // `https://bookshelf-registry-backend-server.onrender.com/oauth2callback`
          {
            code,
          }
        );
        console.log("Tokens:", tokens.data.access_token);
        console.log("Tokens:", tokens.data);
        setToken(tokens.data.access_token);
        setUser(tokens.data);
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
    flow: "auth-code",
    onError: (error) => {
      console.log(error);
    },
  });


  const logOut = () => {
    googleLogout();
    setUser(null);
  };

  const signUp = async (email, name) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/signup/${email}/${name}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/signup/${email}/${name}`
      );
      return response.data;
    } catch (error) {
      console.error("Error signing up user:", error);
      throw new Error("Failed to sign up user.");
    }
  };

  const loginEndpoint = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/login/${email}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/login/${email}`
      );
      return response.data;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw new Error("Failed to log in user.");
    }
  };

  const renameUser = async (email, name) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/rename/${email}/${name}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/rename/${email}/${name}`
      );
      return response.data;
    } catch (error) {
      console.error("Error renaming user:", error);
      throw new Error("Failed to rename user.");
    }
  };

  const clearUserData = async (email) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/cleardata/${email}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/cleardata/${email}`
      );
      return response.data;
    } catch (error) {
      console.error("Error clearing user data:", error);
      throw new Error("Failed to clear user data.");
    }
  };

  const setHomeBook = async (email, id) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/sethomebook/${email}/${id}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/sethomebook/${email}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error setting homebook:", error);
      throw new Error("Failed to set homebook.");
    }
  };

  const removeHomeBook = async (email) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/removehomebook/${email}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/removehomebook/${email}`
      );
      return response.data;
    } catch (error) {
      console.error("Error removing homebook:", error);
      throw new Error("Failed to remove homebook.");
    }
  };

  const rateBook = async (email, id, rating) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/ratebook/${email}/${id}/${rating}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/ratebook/${email}/${id}/${rating}`
      );
      return response.data;
    } catch (error) {
      console.error("Error rating book:", error);
      throw new Error("Failed to rate book.");
    }
  };

  const updatePage = async (email, id, page) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/updatepage/${email}/${id}/${page}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/updatepage/${email}/${id}/${page}`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating page:", error);
      throw new Error("Failed to update page.");
    }
  };

  const updateReview = async (email, id, review) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/updatereview/${email}/${id}/${review}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/updatereview/${email}/${id}/${review}`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw new Error("Failed to update review.");
    }
  };

  const updateNotes = async (email, id, notes) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/updatenotes/${email}/${id}/${notes}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/updatenotes/${email}/${id}/${notes}`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating notes:", error);
      throw new Error("Failed to update notes.");
    }
  };

  const deleteReview = async (email, id) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/deletereview/${email}/${id}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/deletereview/${email}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw new Error("Failed to delete review.");
    }
  };

  const getBook = async (email, id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/getbook/${email}/${id}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/getbook/${email}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting book:", error);
      throw new Error("Failed to get book.");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        setUser,
        loading,
        setLoading,
        login,
        logOut,
        signUp,
        loginEndpoint,
        renameUser,
        clearUserData,
        setHomeBook,
        removeHomeBook,
        rateBook,
        updatePage,
        updateReview,
        updateNotes,
        deleteReview,
        getBook,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

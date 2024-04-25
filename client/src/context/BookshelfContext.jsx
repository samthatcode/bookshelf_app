// BookshelfContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import {useUserContext} from "./UserContext";

const BookshelfContext = createContext();

export const useBookshelfContext = () => useContext(BookshelfContext);

export const BookshelfProvider = ({ children }) => {
  const [error, setError] = useState(null);
  // const { token } = useUserContext();

  const handleBookSearch = async (searchQuery, currentPage) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/searchAll/${searchQuery}/${currentPage}`
        //  `https://bookshelf-registry-backend-server.onrender.com/api/v1/searchAll/${searchQuery}/${currentPage}`
      );
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const getBookDetail = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/getDetail/${id}`
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/getDetail/${id}`
      );
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const getMyBooks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/getMyBooks?token=${token}`,
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/getMyBooks?token=${token}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const getOneBookshelf = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/getOneBookshelf/${id}?token=${token}`,
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/getOneBookshelf/${id}?token=${token}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const addBook = async (shelf, volume) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/addBook/${shelf}/${volume}?token=${token}`,
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/addBook/${shelf}/${volume}?token=${token}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const moveBook = async (from, to, volume) => {
    try {
      await axios.post(
        `http://localhost:3000/api/v1/moveBook/${from}/${to}/${volume}?token=${token}`,     
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/moveBook/${from}/${to}/${volume}?token=${token}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setError(error);
      throw error;
    }  
  };

  const removeBook = async (shelf, volume) => {
    try {
      await axios.post(
        `http://localhost:3000/api/v1/removeBook/${shelf}/${volume}?token=${token}`,
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/removeBook/${shelf}/${volume}?token=${token}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const clearShelf = async (shelf) => {
    try {
      await axios.post(
        `http://localhost:3000/api/v1/clearShelf/${shelf}?token=${token}`,
        // `https://bookshelf-registry-backend-server.onrender.com/api/v1/clearShelf/${shelf}?token=${token}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  return (
    <BookshelfContext.Provider
      value={{
        handleBookSearch,
        getBookDetail,
        getMyBooks,
        getOneBookshelf,
        addBook,
        moveBook,
        removeBook,
        clearShelf,
        error,
      }}
    >
      {children}
    </BookshelfContext.Provider>
  );
};

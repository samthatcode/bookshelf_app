import React, { useEffect, useState } from "react";
import { useBookshelfContext } from "../context/BookshelfContext";
import { useUserContext } from "../context/UserContext";

export default function AddBooKButton({ volumeId }) {
  const [shelves, setShelves] = useState([]);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [isShelfListVisible, setIsShelfListVisible] = useState(false);
  const { getMyBooks, addBook } = useBookshelfContext();
  const { token } = useUserContext();


  useEffect(() => {
    // Fetch shelves associated with the user
    const fetchShelves = async () => {
      try {       
        const shelvesData = await getMyBooks(token);
        setShelves(shelvesData);
      } catch (error) {
        console.error("Error fetching shelves:", error);
      }
    };

    fetchShelves();
  }, [getMyBooks]);
  // Function to add book to the bookshelf
  const handleAddBook = async () => {
    try {
      // Ensure a shelf is selected before adding the book
      if (!selectedShelf) {
        console.error("No shelf selected.");
        return;
      }     
      await addBook(selectedShelf.id, volumeId, token);
      alert("Book added successfully!");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };



  const handleShelfSelection = (shelf) => {
    setSelectedShelf(shelf);
    handleAddBook();
    setIsShelfListVisible(false); 
  };

  const toggleShelfListVisibility = () => {
    setIsShelfListVisible(!isShelfListVisible);
  };


  return (
    <div className="">
      <button
        onClick={toggleShelfListVisibility}
        className={`bg-green-500 text-white px-4 py-2 mt-2 rounded hover:bg-green-600 focus:outline-none focus:bg-green-600`}
      >
        Add to Bookshelf
      </button>
      {isShelfListVisible && (
        <div>
          <h2>Select a Shelf</h2>
          <ul>
            {shelves.map((shelf) => (
              <li key={shelf.id} onClick={() => handleShelfSelection(shelf)}>
                {shelf.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useContext } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaBook,
  FaCheck,
  FaGraduationCap,
  FaBookmark,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { useBookshelfContext } from "../context/BookshelfContext";
import { useUserContext } from "../context/UserContext";

export default function Bookdrawer() {
  const [bookshelves, setBookshelves] = useState([]);
  const [currentshelf, setCurrentShelf] = useState(null);
  const [instructionModal, setInstructionModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const { token } = useUserContext();
  const { getMyBooks, addBook } = useBookshelfContext();

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleShelfClick = (shelf) => {
    setCurrentShelf(shelf);
    toggleDrawer(); // Close the drawer after selecting a shelf (optional)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current shelf data
        const currentShelfResponse = await addBook(token);
        const currentShelfData = currentShelfResponse.data;
        setCurrentShelf(currentShelfData);

        // Fetch bookshelves data
        const shelvesResponse = await getMyBooks(token);
        const shelvesData = shelvesResponse.data;
        setBookshelves(shelvesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentshelf, token]);

  return (
    <>
      {isOpen ? (
        <FaTimes onClick={toggleDrawer} className={`cursor-pointer`} />
      ) : (
        <FaBars onClick={toggleDrawer} className={`cursor-pointer`} size={40} />
      )}
      {/* <UserBookSearch/> */}
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
        className=""
      >
        <aside className={`w-full flex z-0 bg-white border-r overflow-y`}>
          <div className="pl-3">
            <p>Library</p>
            <ul className="">
              <li key={-1}>
                <span className={`block text-black text-lg`}>&nbsp;</span>
              </li>
              <li key={-2}>
                <span className={`block text-black text-lg`}>&nbsp;</span>
              </li>
              {bookshelves.map((shelf, index) => (
                <li
                  className={`cursor-pointer flex items-center py-2 pl-3`}
                  key={index}
                  onClick={() => handleShelfClick(shelf)}
                >
                  {shelf.id === 0 && <FaHeart className={`h-5 w-5`} />}
                  {shelf.id === 1 && <FaBook className={`h-5 w-5`} />}
                  {shelf.id === 2 && <FaGraduationCap className={`h-5 w-5`} />}
                  {shelf.id === 3 && <FaCheck className={`h-5 w-5`} />}
                  {shelf.id > 9 && <FaBookmark className={`h-5 w-5`} />}
                  <span
                    className={`ml-2 ${
                      currentshelf && currentshelf.id === shelf.id
                        ? "text-blue-500"
                        : "text-black"
                    }`}
                  >
                    {shelf.title} ({shelf.volumeCount})
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-b" />
            <ul className="divide-y">
              <li className={`py-2 pl-3`}>
                <Link
                  onClick={() => setInstructionModal(!instructionModal)}
                  underline="always"
                  className={`text-blue-500 text-sm`}
                >
                  How can I create bookshelf?
                </Link>
              </li>
              {instructionModal ? (
                <p className={`pl-3 text-sm`}>
                  Unfortunately, Google book doesn't support creating new
                  bookshelf through its API yet. <br />
                  <br /> However, you can create new bookshelf at{" "}
                  <a
                    href="https://books.google.com/books"
                    target="_blank"
                    rel="noreferrer"
                    className={`text-blue-500`}
                  >
                    Google books
                  </a>
                  .{" "}
                </p>
              ) : (
                <div></div>
              )}
            </ul>
          </div>
        </aside>
      </Drawer>
    </>
  );
}

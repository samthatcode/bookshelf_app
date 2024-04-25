import React, { useState, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { IconContext } from "react-icons";
import Book from "../components/Book";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import ReactPaginate from "react-paginate";
import { useBookshelfContext } from "../context/BookshelfContext";
import { AddBook } from "../components";

export default function UserBookSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const { handleBookSearch, getMyBooks } = useBookshelfContext();

  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearching(true);

    try {
      const response = await handleBookSearch(searchQuery, currentPage);
      setBooks(response.data);
      setTotalResults(response.total);
    } catch (error) {
      console.error("Error searching for books:", error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const handleBookClick = (id) => {
    setSelectedBookId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBookId(null);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalResults / 12);

  useEffect(() => {
    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * 12;
    const endIndex = Math.min(startIndex + 12, totalResults);

    // Slice the books array to get the books for the current page
    const booksForPage = books.slice(startIndex, endIndex);

    // Set the filtered books for the current page
    setFilteredBooks(booksForPage);
  }, [books, currentPage, totalResults]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchQuery]); // Add searchQuery as a dependency to re-focus when it changes

  return (
    <>
      <div className={`flex flex-col md:flex-row items-center justify-center`}>
        <form onSubmit={handleSubmit} className={``}>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter a book title"
            className={`border border-gray-300 rounded px-4 py-2 mr-2`}
            required
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600`}
            disabled={searching} // Disable button while searching
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
      <div className={`flex flex-col md:flex-row items-center justify-center`}>
        {loading && (
          <div
            className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50`}
          >
            <FaSpinner className={`animate-spin`} size={40} />
          </div>
        )}

        {books ? (
          <div>
            {totalResults > 0 && (
              <h2 className={`text-center my-7`}>
                Total Results:{" "}
                <span className={`text-xl text-blue-500`}>{totalResults}</span>
              </h2>
            )}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4`}>
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className={`border p-4 rounded cursor-pointer`}
                  onClick={() => handleBookClick(book.id)}
                >
                  {book.volumeInfo?.imageLinks && (
                    <img
                      src={book.volumeInfo?.imageLinks.thumbnail}
                      alt={book.volumeInfo?.title}
                      className={`w-full h-auto mb-4 rounded`}
                    />
                  )}
                  <h3 className={`font-bold text-lg mb-2`}>
                    {book.volumeInfo?.title}
                  </h3>
                  {book.volumeInfo.authors && (
                    <p className={`text-sm`}>
                      Authors: {book.volumeInfo?.authors.join(", ")}
                    </p>
                  )}
                  {book.volumeInfo.publisher && (
                    <p className={`text-sm`}>
                      Publisher: {book.volumeInfo?.publisher}
                    </p>
                  )}
                  {book.volumeInfo.publishedDate && (
                    <p className={`text-sm`}>
                      Published Date: {book.volumeInfo?.publishedDate}
                    </p>
                  )}
                  {book.volumeInfo.description && (
                    <p className={`text-sm truncate`}>
                      {book.volumeInfo?.description}
                    </p>
                  )}
                  <AddBook />
                </div>
              ))}
            </div>
            <ReactPaginate
              previousLabel={
                <IconContext.Provider
                  value={{ color: "#B8C1CC", size: "36px" }}
                >
                  <AiFillLeftCircle />
                </IconContext.Provider>
              }
              nextLabel={
                <IconContext.Provider
                  value={{ color: "#B8C1CC", size: "36px" }}
                >
                  <AiFillRightCircle />
                </IconContext.Provider>
              }
              breakLabel={"..."}
              breakClassName={"page-item"}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakLinkClassName={"page-link"}
              renderOnZeroPageCount={null}
            />
          </div>
        ) : (
          <p className={`text-center text-2xl`}>No books found</p>
        )}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal",
          }}
        >
          {selectedBookId && <Book id={selectedBookId} />}
        </Modal>
      </div>
    </>
  );
}

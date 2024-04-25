import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useBookshelfContext } from "../context/BookshelfContext";
import { AddBook } from "../components";


export default function Book({ id }) {
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getBookDetail } = useBookshelfContext();

  useEffect(() => {
    // console.log("Book ID:", id);
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);

      try {
        const response = await getBookDetail(id);
        setBookData(response);
      } catch (error) {
        console.error("Error fetching book detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      {loading && (
        <div className={`flex justify-center items-center h-72`}>
          <FaSpinner className={`animate-spin`} />
        </div>
      )}
      {bookData && (
        <div className={`grid md:grid-cols-2 gap-4 mx-10 mt-20`}>
          <div className={`col-span-1`}>
            <img
              src={bookData.volumeInfo?.imageLinks?.thumbnail}
              alt={bookData.volumeInfo?.title}
              className={`h-72 w-full object-contain `}
            />
          </div>
          <div className={`col-span-1`}>
            <h1 className={`text-xl font-bold mb-2`}>
              {bookData.volumeInfo?.title}
            </h1>
            <p className={`text-sm text-gray-500 mb-4`}>
              {(bookData.volumeInfo?.authors || []).join(", ")}{" "}
              {bookData.volumeInfo?.publishedDate}
            </p>
            <p className={`text-sm text-gray-700 overflow-y-auto max-h-72`}>
              {bookData.volumeInfo?.description}
            </p>
            <a
              href={bookData.volumeInfo?.previewLink}
              target="_blank"
              rel="noreferrer"
              className={`text-blue-500 block mb-4`}
            >
              See Preview at Google books
            </a>
          </div>
          <AddBook />
        </div>
      )}
    </div>
  );
}

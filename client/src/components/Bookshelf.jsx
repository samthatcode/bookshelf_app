import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTab, setcurrentshelf } from "../actions";
import { FaHeart, FaCheck, FaBookmark } from "react-icons/fa";


export default function Bookshelf() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const bookshelves = useSelector((state) => state.bookshelves);

  const handleClick = (pos) => {
    dispatch(setcurrentshelf({ shelf: bookshelves[pos], pos }));
    navigate("/MyBooks");
    dispatch(setTab(2));
  };

  return (
    <div className="w-64">
      <ul className="border border-gray-300 rounded">
        <li
          className="text-left px-4 py-2"
          key={-1}
          onClick={() => handleClick(0)}
        >
          <FaHeart className="w-6 h-6 text-primary" />
          <span className="ml-2">Favorites</span>
        </li>
        <li
          className="text-left px-4 py-2"
          key={-2}
          onClick={() => handleClick(3)}
        >
          <FaCheck className="w-6 h-6 text-primary" />
          <span className="ml-2">Have Read</span>
        </li>
        <li className="border-t border-gray-300" key={-3}></li>
        {bookshelves.map((n, i) => {
          if (n.id > 9 && i < 7) {
            return (
              <li
                className="text-left px-4 py-2"
                key={i}
                onClick={() => handleClick(i)}
              >
                <FaBookmark className="w-6 h-6 text-primary" />
                <span className="ml-2">{n.title}</span>
              </li>
            );
          } else return <div key={i}></div>;
        })}
      </ul>
    </div>
  );
}

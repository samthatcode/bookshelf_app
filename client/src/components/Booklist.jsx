import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Empty, message } from "antd";
import info_icon from "../assets/images/info_icon.svg";
import read_icon from "../assets/images/read_icon.svg";
import useWindowSize from "../hooks/useWindowSize";
import {
  bopen,
  setcurrentbook,
  nbopen,
  setcurrentshelf,
  sethomebook,
  rnopen,
} from "../actions";

export default function Booklist({ pos, title, info }) {
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const defaultshelves = useSelector((state) => state.defaultshelves);
  const bookshelves = useSelector((state) => state.bookshelves);
  const homebook = useSelector((state) => state.homeBook);

  const showBookInfo = (e) => {
    dispatch(setcurrentbook(defaultshelves[pos][e.target.id]));
    dispatch(bopen());
  };

  const readnow = (e) => {
    if (homebook.id !== null && pos !== 0) {
      dispatch(setcurrentbook(defaultshelves[pos][e.target.id]));
      dispatch(rnopen(true));
    } else {
      dispatch(sethomebook(defaultshelves[pos][e.target.id]));
      message.success({
        content: `You have started reading.`,
        style: { marginTop: "90vh" },
      });
    }
  };

  const showNotes = (e) => {
    if (info)
      dispatch(
        setcurrentshelf({
          shelf: pos === 0 ? bookshelves[2] : bookshelves[1],
          pos: pos === 0 ? 2 : 1,
        })
      );
    dispatch(setcurrentbook(defaultshelves[pos][e.target.id]));
    dispatch(nbopen());
  };

  return (
    <div className={`ml-5`}>
      <p className={`text-xl h-12`}>{title}</p>
      <div className={`flex flex-nowrap overflow-x-auto`}>
        {defaultshelves[pos].length === 0 ? (
          <div key={-1}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="no book"
              style={{ paddingTop: "30px" }}
            />
          </div>
        ) : (
          defaultshelves[pos].map((n, i) => (
            <div key={i} className={`relative`}>
              {info && (
                <div className={`absolute top-0 left-0 z-10`}>
                  <button onClick={readnow} id={i}>
                    <img className={`w-7 h-7`} src={read_icon} alt="Read now" />
                  </button>
                  <button onClick={showBookInfo} id={i}>
                    <img
                      className={`w-7 h-7`}
                      src={info_icon}
                      alt="Show info"
                    />
                  </button>
                </div>
              )}
              <img
                onClick={info ? showNotes : showBookInfo}
                id={i}
                className={`hover:w-48 hover:h-64`}
                alt={n.volumeInfo.title ? n.volumeInfo.title.slice(0, 25) : ""}
                src={
                  n.volumeInfo.imageLinks
                    ? n.volumeInfo.imageLinks.thumbnail
                    : ""
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

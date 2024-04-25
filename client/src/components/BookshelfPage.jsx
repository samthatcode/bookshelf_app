import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "@chakra-ui/react";
import Skeleton from "react-loading-skeleton";
import info_icon from "../assets/images/info_icon.svg";
import read_icon from "../assets/images/read_icon.svg";
import { message } from "antd";

import {
  bopen,
  setcurrentbook,
  nbopen,
  loadbooks,
  sethomebook,
  rnopen,
  setcurrentshelf,
} from "../actions";

export default function BookshelfPage() {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const currentshelf = useSelector((state) => state.currentshelf);
  const bookshelves = useSelector((state) => state.bookshelves);
  const homebook = useSelector((state) => state.homeBook);
  const [stat, setStat] = useState("loading");
  const userdata = useSelector((state) => state.userData);

  const showBookInfo = (e) => {
    dispatch(setcurrentbook(currentshelf.books.data[e.target.id]));
    dispatch(bopen());
  };

  const readNow = (e) => {
    if (homebook.id !== null) {
      dispatch(setcurrentbook(currentshelf.books.data[e.target.id]));
      dispatch(rnopen(true));
    } else {
      dispatch(sethomebook(currentshelf.books.data[e.target.id]));
      message.success({
        content: `You have started reading. Check out your home page`,
        style: { marginTop: "90vh" },
      });
    }
  };

  const showNotes = (e) => {
    dispatch(setcurrentbook(currentshelf.books.data[e.target.id]));
    dispatch(nbopen());
  };

  useEffect(() => {
    async function fetchData() {
      const { data, status } = await getOneBookshelf(
        currentshelf.id,
        userdata.token
      );
      if (status < 300) {
        dispatch(
          loadbooks({ books: data === "" ? [] : data, pos: currentshelf.pos })
        );
        setStat("ok");
      } else {
        setStat("error");
      }
    }
    if (currentshelf.pos === -1) {
      dispatch(setcurrentshelf({ shelf: bookshelves[0], pos: 0 }));
    } else if (!bookshelves[currentshelf.pos].books && userdata.token) {
      setStat("loading");
      fetchData();
    } else {
      setStat("ok");
    }
  }, [currentshelf]);

  return (
    <div>
      <p className="text-left text-2xl text-gray-700">{currentshelf.title}</p>
      <div ref={gridRef} className="h-96 overflow-y-scroll">
        <div className="grid grid-cols-8 gap-4">
          {stat === "loading" || !bookshelves[currentshelf.pos].books ? (
            [...Array(currentshelf.volumeCount)].map((n, i) => (
              <div key={i}>
                <Skeleton height={198} width={128} />
              </div>
            ))
          ) : stat === "error" ? (
            <div>Server error</div>
          ) : (
            currentshelf.books.data.map((n, i) => (
              <div key={i}>
                <Tooltip title="Read Now" position="top">
                  <img
                    onClick={readNow}
                    id={i}
                    className="readicon"
                    src={read_icon}
                    style={{ marginTop: "0px", height: "27px", width: "27px" }}
                  />
                </Tooltip>
                <Tooltip title="Show Info" position="top">
                  <img
                    onClick={showBookInfo}
                    id={i}
                    className="readicon"
                    src={info_icon}
                    style={{ marginTop: "0px", height: "25px", width: "25px" }}
                  />
                </Tooltip>
                <img
                  onClick={showNotes}
                  id={i}
                  alt={
                    n.volumeInfo.title ? n.volumeInfo.title.slice(0, 25) : ""
                  }
                  src={
                    n.volumeInfo.imageLinks
                      ? n.volumeInfo.imageLinks.thumbnail
                      : ""
                  }
                  style={{ height: "198px", width: "128px" }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


import { FaCheckCircle } from "react-icons/fa";
import Bookshelf from "./Bookshelf";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useDB from "../hooks/useDB";
import { savedbinfo, savepagenow, rnopen, validatenote } from "../actions";
import { format } from "date-fns";

export default function HomeBook() {
  const dispatch = useDispatch();
  const book = useSelector((state) => state.homeBook);
  const currentbook = useSelector((state) => state.currentBook);
  const notesBoxModal = useSelector((state) => state.notesBoxModal);
  const settingModal = useSelector((state) => state.settingModal);
  const savedbooks = useSelector((state) => state.booksInfo);
  const userData = useSelector((state) => state.userData);
  const [value, setValue] = useState(0);
  const [maxvalue, setMaxvalue] = useState(100);
  const { updatepageDB, getbookDB, updatenotesDB } = useDB();
  const [todaynote, settodaynote] = useState("");
  const [todayString, settodayString] = useState("");
  const [notes, setnotes] = useState([]);

  const handleSliderChange = (event, newValue) => {
    if (newValue !== value) {
      setValue(newValue);
      dispatch(savepagenow({ id: book.id, pagenow: newValue }));
      updatepageDB({ mail: userData.mail, id: book.id, page: newValue });
    }
  };

  useEffect(() => {
    if (!settingModal.open && settingModal.clear === 1) {
      setnotes([]);
      settodaynote("");
      setValue(0);
    }
  }, [settingModal]);

  useEffect(() => {
    if (!notesBoxModal && book.id === currentbook.id) {
      let today = format(new Date(), "yyyy-MM-dd");
      let bookdata = savedbooks.find((n) => n.id === book.id);
      if (bookdata?.db) {
        setnotes(
          bookdata.db.notes && bookdata.db.notes[0]
            ? bookdata.db.notes.filter((n) => n.time !== today)
            : []
        );
        let note = bookdata.db.notes?.find((n) => n.time === today);
        settodaynote(note?.content ? note.content : "");
      }
    }
  }, [notesBoxModal]);

  const handleInputChange = (event) => {
    if (event.target.value === "" && value !== 0) {
      setValue(0);
      dispatch(savepagenow({ id: book.id, pagenow: 0 }));
      updatepageDB({ mail: userData.mail, id: book.id, page: 0 });
    } else {
      let num = Number(event.target.value);
      if (value !== num) {
        setValue(num);
        dispatch(savepagenow({ id: book.id, pagenow: num }));
        updatepageDB({ mail: userData.mail, id: book.id, page: num });
      }
    }
  };
  const [saved, setsaved] = useState(true);
  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > maxvalue) {
      setValue(maxvalue);
    }
  };

  useEffect(() => {
    if (value === maxvalue) {
      console.log(maxvalue);
      dispatch(rnopen(false));
      setValue(0);
    }
  }, [value]);

  useEffect(() => {
    let today = format(new Date(), "yyyy-MM-dd");
    settodayString(today);
    const fetchBook = async () => {
      const { data, status } = await getbookDB({
        mail: userData.mail,
        id: book.id,
      });
      if (status === 204) {
        dispatch(
          savedbinfo({
            id: book.id,
            db: { rating: 0, review: "", notes: [], pagenow: 0 },
          })
        );
        setValue(0);
        setnotes([]);
        settodaynote("");
        return;
      }
      if (data.pagenow) {
        setValue(data.pagenow);
        dispatch(savedbinfo({ id: book.id, db: data }));
      } else {
        setValue(0);
      }

      if (data.notes && data.notes[0]) {
        //remove today from notes
        setnotes(data.notes.filter((n) => n.time !== today));
      } else {
        setnotes([]);
      }

      let note = await data.notes?.find((n) => n.time === today);
      settodaynote(note?.content ? note.content : "");
    };

    if (!book.id || !userData.mail) return;
    if (book.volumeInfo && book.volumeInfo.pageCount) {
      setMaxvalue(book.volumeInfo.pageCount);
    } else {
      setMaxvalue(100);
    }

    let bookdata = savedbooks.find((n) => n.id === book.id);
    if (bookdata?.db) {
      setValue(bookdata.db.pagenow ? bookdata.db.pagenow : 0);
      //remove today from
      setnotes(
        bookdata.db.notes && bookdata.db.notes[0]
          ? bookdata.db.notes.filter((n) => n.time !== today)
          : []
      );
      let note = bookdata.db.notes?.find((n) => n.time === today);
      settodaynote(note?.content ? note.content : "");
    } else {
      fetchBook();
    }
  }, [book]);

  useEffect(() => {
    const updateNote = async () => {
      dispatch(
        validatenote({ id: book.id, date: todayString, content: todaynote })
      );
      //save to db
      let bookdata = await savedbooks.find((n) => n.id === book.id);
      if (bookdata?.db.notes) {
        await updatenotesDB({
          id: book.id,
          mail: userData.mail,
          notes: bookdata.db.notes,
        });
      }
      setsaved(true);
    };
    if (!saved) {
      updateNote();
    }
  }, [saved]);

  return (
    <div className="flex flex-row">
      <div className="mt-10 pl-4 text-left">
        <p className="text-2xl mb-2">
          {book.volumeInfo.title ? book.volumeInfo.title.slice(0, 21) : ""}
        </p>
        <p className="text-sm text-darkgray">
          {book.volumeInfo.authors ? book.volumeInfo.authors[0] : ""}
        </p>
        <div className="py-4 w-96">
          <div className="grid grid-cols-2 items-center">
            <input
              type="range"
              min={0}
              max={maxvalue}
              value={typeof value === "number" ? value : 0}
              onChange={handleSliderChange}
              className="w-48"
            />
            <input
              type="number"
              value={value}
              onChange={handleInputChange}
              onBlur={handleBlur}
              min={0}
              max={maxvalue}
              step={10}
              className="w-16"
            />
            <span className="text-darkgray">
              {book.volumeInfo && book.volumeInfo.pageCount ? "pages" : "%"}
            </span>
          </div>
        </div>
        <div>
          <ul className="h-36 overflow-y-scroll">
            {notes.length !== 0 ? (
              notes.map((n, i) => (
                <li key={i} className="h-10">
                  <span className="text-gray-500 pr-2">
                    {n.time.replaceAll("-", "/")}
                  </span>
                  {n.content}
                </li>
              ))
            ) : (
              <p className="text-gray-500">no previous notes</p>
            )}
          </ul>
        </div>
        <div className="mt-4 mb-2">
          <p className="text-sm">Your thoughts after today's reading:</p>
          <textarea
            value={todaynote}
            onChange={(e) => {
              if (e.target.value.length <= 150) {
                settodaynote(e.target.value);
                setsaved(false);
              }
            }}
            className="w-full mt-1 py-1 px-2 border border-gray-300 rounded"
            placeholder="Write something..."
            rows={2}
          />
        </div>
        {saved ? (
          <p className="mt-4">
            <FaCheckCircle className="inline-block align-middle" /> It's
            saved
          </p>
        ) : (
          <p className="mt-4">
            <FaCheckCircle
              size={15}
              className="inline-block align-middle"
            />{" "}
            Saving...
          </p>
        )}
      </div>
      <div className="mt-20 ml-8 w-72 pt-4 flex flex-col">
        <Bookshelf />
      </div>
    </div>
  );
};


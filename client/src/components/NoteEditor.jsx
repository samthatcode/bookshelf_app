import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { copen, neclose, updatenote, validatenote } from "../actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormControl, Tooltip } from "@chakra-ui/react";
import { FaTrash, FaCheck } from "react-icons/fa";

export default function NoteEditor() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.noteeditorModal);
  const book = useSelector((state) => state.currentBook);
  const savedbooks = useSelector((state) => state.booksInfo);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [today, settoday] = useState(new Date());
  const [notecontent, setnotecontent] = useState("");

  useEffect(() => {
    if (modal.open) {
      settoday(new Date());
      if (modal.notepos === -3) {
        setSelectedDate(new Date());
        setnotecontent("");
      } else {
        let bookdata = savedbooks.find((n) => n.id === book.id);
        let note = bookdata.db.notes[modal.notepos];
        setnotecontent(note.content);
        setSelectedDate(new Date(note.time));
      }
    }
  }, [modal]);

  const handleCancel = () => {
    dispatch(neclose(-1));
  };

  const handleDelete = () => {
    dispatch(copen("delete this note"));
  };

  const handleSave = async () => {
    if (modal.notepos !== -3) {
      if (notecontent === "") {
        handleDelete();
      } else {
        dispatch(
          updatenote({
            id: book.id,
            notepos: modal.notepos,
            content: notecontent,
            time: format(selectedDate, "yyyy-MM-dd"),
          })
        );
        dispatch(neclose(-2));
      }
    } else {
      dispatch(
        validatenote({
          id: book.id,
          content: notecontent,
          date: format(selectedDate, "yyyy-MM-dd"),
        })
      );
      dispatch(neclose(-2));
    }
  };

  return (
    <div>
      <Modal show={modal.open} onHide={handleCancel}>
        <ModalHeader>
          Select Date
        </ModalHeader>
        <ModalBody>
          <DatePicker
            maxDate={today}
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <FaCheck /> Save
          </Button>
        </ModalFooter>
      </Modal>
      <FormControl
        as="textarea"
        rows={4}
        placeholder="Enter your note here..."
        value={notecontent}
        onChange={(e) => {
          // set max word
          if (e.target.value.length <= 150) {
            setnotecontent(e.target.value);
          }
        }}
      />
      <div>
        {modal.notepos !== -3 && (
          <Tooltip title="Delete">
            <FaTrash />
          </Tooltip>
        )}
        <Button
          onClick={handleCancel}
          variant="secondary"
          style={{ marginRight: "10px" }}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} variant="primary">
          <FaCheck /> Save
        </Button>
      </div>
    </div>
  );
};


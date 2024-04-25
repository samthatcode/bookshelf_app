import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Tooltip } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import { BsTrash, BsX } from "react-icons/bs";
import useDB from "../hooks/useDB";
import { copen, reclose, savereview } from "../actions"; // Correctly imported actions

export default function ReviewEditor({ review, setreview }) {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.revieweditorModal);
  const [saved, setsaved] = useState(true);
  const confirmModal = useSelector((state) => state.confirmModal);
  const [savedContent, setsavedContent] = useState(null);
  const [deleting, setdeleting] = useState(false);
  const [confirmOpen, setconfirmOpen] = useState(false);
  const book = useSelector((state) => state.currentBook);
  const userData = useSelector((state) => state.userData);
  const editor = useRef(null);
  const { updatereviewDB } = useDB();

  const [content, setContent] = useState(review);

  useEffect(() => {
    if (modal) {
      // Set initial content
      setContent(review);
      setsavedContent(JSON.parse(review));
      setsaved(true);
    }
  }, [modal, review]);

  const handleContentChange = (event) => {
    const newContent = event.target.innerHTML;
    setContent(newContent);
    // Check if the new content is different from the saved content
    if (JSON.stringify(newContent) !== JSON.stringify(savedContent)) {
      setsaved(false); // Content has been modified
    }
  };

  const handleClose = () => {
    if (saved) {
      dispatch(reclose());
    } else {
      setconfirmOpen(true);
    }
  };

  const handleDelete = () => {
    dispatch(copen("delete this review"));
    setdeleting(true);
  };

  useEffect(() => {
    if (deleting && confirmModal.title === "review deleted") {
      setreview("");
      setdeleting(false);
    }
  }, [confirmModal]);

  const handleSave = async () => {
    setreview(content);
    setsavedContent(JSON.parse(content));
    dispatch(savereview({ id: book.id, review: content }));
    const { status } = await updatereviewDB({
      id: book.id,
      mail: userData.mail,
      review: content,
    });
    if (status >= 300) {
      message.error("review is not saved due to technical issues");
    } else {
      setsaved(true);
    }
  };

  return (
    <div>
      <Modal show={modal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Review Editor</Modal.Title>
          <Tooltip title="delete">
            <Button variant="link" onClick={handleDelete}>
              <BsTrash />
            </Button>
          </Tooltip>
        </Modal.Header>
        <Modal.Body>
          <div
            contentEditable="true"
            onInput={handleContentChange}
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              height: "600px",
              width: "560px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
            ref={editor}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={saved} onClick={handleSave} variant="primary">
            Save
          </Button>
          <Tooltip title="close">
            <Button onClick={handleClose} variant="secondary">
              <BsX />
            </Button>
          </Tooltip>
        </Modal.Footer>
      </Modal>
      <Modal show={confirmOpen} onHide={() => setconfirmOpen(false)}>
        <Modal.Header>
          <Modal.Title>Do you want to save the changes you made?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The changes will be lost if you don't save them.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => {
              setconfirmOpen(false);
              dispatch(reclose());
            }}
          >
            Don't save
          </Button>
          <Button variant="secondary" onClick={() => setconfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSave();
              setconfirmOpen(false);
              dispatch(reclose());
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog } from "@headlessui/react";
import { googleLogout } from "@react-oauth/google";
import {
  cclose,
  setTab,
  deletebook,
  deleteDefaultBook,
  nbclose,
  sethomebook,
  savereview,
  reclose,
  deletenote,
  neclose,
  cleardata,
  sbclose,
  logout,
} from "../actions";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import useDB from "../hooks/useDB";

export default function ConfirmBox() {
  const dispatch = useDispatch();
  const { removeBook } = useApi();
  const confirmModal = useSelector((state) => state.confirmModal);
  const currentshelf = useSelector((state) => state.currentshelf);
  const currentbook = useSelector((state) => state.currentBook);
  const noteEditorModal = useSelector((state) => state.noteeditorModal);
  const userData = useSelector((state) => state.userData);
  let navigate = useNavigate();
  const { deletereviewDB, cleardataDB } = useDB();


  const remove = async () => {
    if (currentshelf.pos === -1) {
      dispatch(sethomebook({ id: null }));
      message.success({
        content: `You have stop reading it.`,
        style: { marginTop: "90vh" },
      });
    } else {
      const status = await removeBook(
        currentshelf.id,
        currentbook.id,
        userData.token
      );
      if (status < 300) {
        if (currentshelf.id === 3)
          dispatch(deleteDefaultBook({ pos: 0, id: currentbook.id }));
        else if (currentshelf.id === 2)
          dispatch(deleteDefaultBook({ pos: 1, id: currentbook.id }));
        dispatch(deletebook({ id: currentbook.id, pos: currentshelf.pos }));
        message.success({
          content: `The book have been deleted`,
          style: { marginTop: "90vh" },
        });
      } else {
        message.error({
          content: `Failed to delete, try again`,
          style: { marginTop: "90vh" },
        });
      }
    }
    dispatch(nbclose());
  };

  const deleteReview = async () => {
    const { status } = await deletereviewDB({
      id: currentbook.id,
      email: userData.email,
    });
    if (status === 200) {
      dispatch(savereview({ id: currentbook.id, review: null }));
      dispatch(cclose("review deleted"));
      dispatch(reclose());
    }
  };

  const deleteNote = async () => {
    dispatch(
      deletenote({ id: currentbook.id, notepos: noteEditorModal.notepos })
    );
    dispatch(neclose(-2));
  };

  const logOut = () => {
    dispatch(logout());
    googleLogout();
    navigate("/");
    dispatch(setTab(0));
    localStorage.removeItem("user");
    message.success({
      content: "You have logged out.",
      style: { marginTop: "90vh" },
    });
    dispatch(cclose());
  };

  const clearAllData = () => {
    const clear = async () => {
      const { status } = await cleardataDB({ email: userData.email });
      dispatch(sbclose(1));
      if (status < 300) {
        dispatch(cleardata());
        message.success({
          content: "All the notes/reviews have been cleared.",
          style: { marginTop: "90vh" },
        });
      } else {
        message.error({
          content: "Clear data failed",
          style: { marginTop: "90vh" },
        });
      }
    };
    clear();
  };

  return (
    <div>
      <Dialog open={confirmModal.open} onClose={() => dispatch(cclose())}>
              <Dialog.Overlay />
        <Dialog.Title>
          Are you sure you want to {confirmModal.title}?
        </Dialog.Title>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => dispatch(cclose())}
            className="text-blue-500"
            autoFocus
          >
            No
          </button>
          {confirmModal.title !== "log out" ? (
            <button
              onClick={() => {
                switch (confirmModal.title) {
                  case "delete it":
                    remove();
                    break;
                  case "delete this review":
                    deleteReview();
                    break;
                  case "delete this note":
                    deleteNote();
                    break;
                  case "clear all data (notes/reviews)":
                    clearAllData();
                    break;
                  default:
                    break;
                }
                dispatch(cclose());
              }}
              className="text-red-500"
              autoFocus
            >
              Yes
            </button>
          ) : (     
              
                <button onClick={logOut} className="text-red-500">
                  Log out
                </button>
             
            
          )}
        </div>
      </Dialog>
    </div>
  );
}

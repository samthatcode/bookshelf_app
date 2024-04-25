import {
  FaTrash,
  FaPlus,
  FaArrowRight,
  FaEdit,
  FaStar,
  FaStarHalfAlt,
  FaBars,
} from "react-icons/fa";
import read_icon from "../assets/images/read_icon.svg";
import Rating from "react-rating";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import {
  Modal,
  Button,
  Box,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Image,
  Tooltip, 
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  nbclose,
  ssopen,
  copen,
  rnopen,
  sethomebook,
  savedbinfo,
  saverating,
  reopen,
  neopen,
} from "../actions";
import { message } from "antd";
import useDB from "../hooks/useDB";
import ReviewEditor from "./ReviewEditor";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NotesBox() {
  const dispatch = useDispatch();
  const notesBoxModal = useSelector((state) => state.notesBoxModal);
  const noteEditorModal = useSelector((state) => state.noteeditorModal);
  const settingModal = useSelector((state) => state.settingModal);
  const book = useSelector((state) => state.currentBook);
  const savedbooks = useSelector((state) => state.booksInfo);
  const homebook = useSelector((state) => state.homeBook);
  const shelf = useSelector((state) => state.currentshelf);
  const userData = useSelector((state) => state.userData);
  const handleClose = () => {
    dispatch(nbclose());
  };
  const gridRef = useRef(null);
  const { ratebookDB, getbookDB, updatenotesDB } = useDB();
  const [rating, setrating] = useState(0);
  const [review, setreview] = useState("");
  const [viewerState, setviewerState] = useState("");
  const [notes, setnotes] = useState([]);

  useEffect(() => {
    if (notesBoxModal && book.id === homebook.id) {
      let bookdata = savedbooks.find((n) => n.id === book.id);
      if (bookdata?.db) {
        setnotes(
          bookdata.db.notes && bookdata.db.notes[0] ? bookdata.db.notes : []
        );
      }
    }
  }, [notesBoxModal]);

  useEffect(() => {
    if (!settingModal.open && settingModal.clear === 1) {
      setnotes([]);
      setreview("");
      setrating(0);
    }
  }, [settingModal]);

  useEffect(() => {
    if (!noteEditorModal.open && noteEditorModal.notepos === -2) {
      let bookdata = savedbooks.find((n) => n.id === book.id);
      if (bookdata?.db) {
        setnotes(
          bookdata.db.notes && bookdata.db.notes[0] ? bookdata.db.notes : []
        );
        updatenotesDB({
          id: book.id,
          email: userData.email,
          notes: bookdata.db.notes,
        });
      }
    }
  }, [noteEditorModal]);

  useEffect(() => {
    const fetchBook = async () => {
      const { data, status } = await getbookDB({
        email: userData.email,
        id: book.id,
      });
      if (status !== 200) {
        setrating(0);
        setreview("");
        setnotes([]);
        return;
      }
      dispatch(savedbinfo({ id: book.id, db: data }));
      if (data.rating) {
        setrating(data.rating);
      } else {
        setrating(0);
      }
      if (data.review) {
        setreview(data.review);
      } else {
        setreview("");
      }
      if (data.notes && data.notes[0]) {
        setnotes(data.notes);
      } else {
        setnotes([]);
      }
    };

    if (!book.id) return;
    let bookdata = savedbooks.find((n) => n.id === book.id);
    if (bookdata?.db) {
      setrating(bookdata.db.rating ? bookdata.db.rating : 0);
      setreview(bookdata.db.review ? bookdata.db.review : "");
      setnotes(
        bookdata.db.notes && bookdata.db.notes[0] ? bookdata.db.notes : []
      );
    } else {
      fetchBook();
    }
  }, [book]);

  useEffect(() => {
    if (review !== "") {
      setviewerState(draftToHtml(JSON.parse(review)));
    }
  }, [review]);

  const readnow = () => {
    if (homebook.id !== null) {
      dispatch(rnopen(true));
    } else {
      dispatch(sethomebook(book));
      handleClose();
      message.success({
        content: `Homebook is updated.`,
        style: { marginTop: "90vh" },
      });
    }
  };

  return (
    <div>
      <Modal
        open={notesBoxModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="lg"
      >
        <Box
          style={{
            textAlign: "center",
            height: "95vh",
            color: "#37474F",
            fontSize: "30px",
            overflowY: "hidden",
          }}
        >
          <Box style={{ marginTop: "0px" }}>
            <p
              style={{
                marginRight: "16vw",
                textAlign: "left",
                marginBottom: "5px",
                width: "65vw",
              }}
            >
              <span>
                <Rating
                  initialRating={rating}
                  fullSymbol={
                    <FaStar
                      size={50}
                      style={{
                        color: rating > 0 ? "rgb(243, 216, 65)" : "black",
                      }}
                    />
                  }
                  emptySymbol={
                    <FaStarHalfAlt
                      size={50}
                      style={{
                        color: rating > 0 ? "rgb(243, 216, 65)" : "black",
                      }}
                    />
                  }
                  onChange={(num) => {
                    if (rating !== num) {
                      setrating(num);
                      dispatch(saverating({ id: book.id, rating: num }));
                      ratebookDB({
                        email: userData.email,
                        id: book.id,
                        rating: num,
                      });
                    }
                  }}
                />
              </span>
              <span
                style={{
                  fontSize: "19px",
                  fontWeight: "bold",
                  marginLeft: "20px",
                }}
              >
                {" "}
                {book.volumeInfo ? book.volumeInfo.title : ""}
              </span>
            </p>
            {/* <Link  onClick={()=>{
                dispatch(ssopen("Add"))
              }} color="primary" style={{fontSize:"17px", textAlign:"center", lineHeight:'40px', color:'rgb(75, 134, 99)' }}><FaPlus size={20} style={{paddingTop:"10px", color:'rgb(75, 134, 99)'}}/>Add to</Link>
              <Link onClick={()=>{
                dispatch(ssopen("Move"))
              }} color="primary" style={{fontSize:"17px", textAlign:"center", lineHeight:'40px', color:'rgb(24, 98, 163)'}}><FaArrowRight size={20} style={{paddingTop:"10px", color:'rgb(24, 98, 163)'}}/>Move to</Link>
              <IconButton style={{height:"40px", width:"40px"}} ><FaTrash style={{color:'rgb(156, 50, 50)', height:"28px", width: "28px"}} onClick={()=>{
                dispatch(copen("delete it"))
              }}  /></IconButton > */}
            <Popover onClose={handleClose}>
              <PopoverTrigger>
                <Button
                  icon={<FaBars />}
                  // onClick={handleOpen}
                  size="sm"
                  colorScheme="blue"
                >
                  Open Menu
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Confirmation!</PopoverHeader>
                <PopoverBody>
                  <Button
                    leftIcon={<FaPlus />}
                    colorScheme="blue"
                    onClick={() => {
                      dispatch(ssopen("Add"));
                      handleClose();
                    }}
                  >
                    Add this to other shelf
                  </Button>
                  <Button
                    leftIcon={<FaArrowRight />}
                    colorScheme="blue"
                    onClick={() => {
                      dispatch(ssopen("Move"));
                      handleClose();
                    }}
                    isDisabled={shelf.pos === -1}
                  >
                    Move this to other shelf
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
          <Divider />
          <div
            style={{
              height: "90%",
              width: "85.5vw",
              marginTop: "10px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "40vw", overflowY: "hidden" }}>
              <div
                style={{
                  width: "40vw",
                  height: "100%",
                  marginTop: "10px",
                  overflowY: "scroll",
                }}
              >
                {review !== "" ? (
                  <div
                    id="review_view"
                    style={{
                      height: "100%",
                      fontSize: "15px",
                      textAlign: "left",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: viewerState }}
                      style={{ wordWrap: "break-word" }}
                    ></div>
                    <Button
                      onClick={() => dispatch(reopen())}
                      id="review_edit_button"
                      color="primary"
                      style={{
                        zIndex: 1.1,
                        fontSize: "13px",
                        position: "absolute",
                        top: "84%",
                        left: "20%",
                      }}
                      variant="contained"
                      startIcon={<FaEdit color="secondary" />}
                    >
                      Edit
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p
                      style={{
                        marginLeft: "0%",
                        marginTop: "35%",
                        fontSize: "20px",
                      }}
                    >
                      You haven't review it yet.
                    </p>
                    <Button
                      onClick={() => {
                        dispatch(reopen());
                      }}
                      color="primary"
                      style={{ fontSize: "13px", opacity: 0.8 }}
                      variant="contained"
                      startIcon={<FaEdit color="secondary" />}
                    >
                      Write your Review
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <Divider orientation="vertical" flexItem />
            <div
              ref={gridRef}
              style={{
                width: "45vw",
                paddingLeft: "5px",
                overflowX: "hidden",
                overflowY: "scroll",
                height: "100%",
              }}
            >
              <Image
                cols={gridRef.current ? gridRef.current.offsetWidth / 317 : 2}
                rowHeight={125}
                gap={10}
              >
                {notes.map((n, i) => (
                  <Image>
                    <Box
                      key={i}
                      className="note_view"
                      style={{
                        backgroundColor: "rgb(250, 249, 246)",
                        height: "115px",
                      }}
                    >
                      <Box>
                        <p
                          style={{
                            marginRight: "7px",
                            color: "darkgray",
                            fontSize: "15px",
                            textAlign: "left",
                            marginBottom: "0px",
                            marginTop: "0px",
                          }}
                        >
                          {n.time.replaceAll("-", "/")}
                        </p>
                        <p
                          style={{
                            fontSize: "15px",
                            textAlign: "left",
                            wordWrap: "break-word",
                            whiteSpace: "pre-wrap",
                            overflowY: "scroll",
                            height: "70px",
                          }}
                        >
                          {n.content}
                        </p>
                      </Box>
                      <Box>
                        <Tooltip title="edit note">
                          <IconButton
                            className="edit_note_button"
                            onClick={() => {
                              dispatch(neopen(i));
                            }}
                            style={{
                              height: "30px",
                              width: "30px",
                              position: "absolute",
                              left: "89%",
                              top: "67%",
                            }}
                          >
                            <FaEdit color="primary" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Image>
                ))}
              </Image>
              <Tooltip title="add note">
                <Button
                  onClick={() => dispatch(neopen(-3))}
                  id="add_note_button"
                  color="primary"
                  style={{ position: "absolute", left: "90%", top: "80%" }}
                >
                  <FaPlus />
                </Button>
              </Tooltip>
            </div>
          </div>
        </Box>
        <Box>
          <Button
            variant="contained"
            style={{
              fontSize: "13px",
              backgroundColor: "rgb(156, 50, 50)",
              margin: "0px 11px 10px 0px",
            }}
            color="primary"
            startIcon={<FaTrash color="secondary" />}
            onClick={() => {
              dispatch(copen("delete it"));
            }}
          >
            {shelf.pos !== -1 ? "delete from shelf" : "delete from home"}
          </Button>
          <Button
            disabled={shelf.pos === -1}
            variant="contained"
            style={{ fontSize: "13px", margin: "0px 11px 10px 0px", zIndex: 3 }}
            color="primary"
            startIcon={
              <img
                src={read_icon}
                style={{
                  marginTop: "0px",
                  height: "27px",
                  width: "27px",
                  opacity: shelf.pos == -1 ? "50%" : "100%",
                }}
              />
            }
            onClick={readnow}
          >
            Read now
          </Button>
        </Box>
      </Modal>
      <ReviewEditor review={review} setreview={setreview} />
    </div>
  );
};


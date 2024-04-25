import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  Button,
  InputGroup,
  FormControl,
  Image,
  Alert,
  Pagination,
} from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { BsSearch } from "react-icons/bs"; 
import { Link } from "react-router-dom";
import { Empty } from "antd";
import useApi from "../hooks/useApi";
import { useSelector, useDispatch } from "react-redux";
import {
  srclose,
  setkeyword,
  setsearchInput,
  focus,
  blur,
  bopen,
  setcurrentbook,
  addsearchHistory,
} from "../actions";

export default function SearchResult() {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(srclose());
  };
  const searchResultModal = useSelector((state) => state.searchResultModal);
  const keyword = useSelector((state) => state.keyword);
  const searchInput = useSelector((state) => state.bookSearchInput);
  const resultTop = useRef(null);
  const scroll = async () => {
    await resultTop.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [loading, setloading] = useState(false);
  const [page, setpage] = useState(1);
  const [pageCount, setpageCount] = useState(1);
  const [openbook, setopenbook] = useState({});
  const { searchAll, searchdata } = useApi();

  useEffect(() => {
    setloading(false);
    setpageCount(Math.floor(searchdata.total / 40));
  }, [searchdata]);

  useEffect(() => {
    setloading(true);
    if (keyword === "") return;
    searchAll({ keyword, page });
  }, [page]);

  useEffect(() => {
    // Query data
    setpage(1);
    if (keyword === "") return;
    setloading(true);
    searchAll({ keyword, page: 1 });
    dispatch(addsearchHistory(keyword));
  }, [keyword]);

  useEffect(() => {
    dispatch(setcurrentbook(openbook));
  }, [openbook]);

  return (
    <div>
      <Modal show={searchResultModal} onHide={handleClose} size="lg" scrollable>
        <ModalHeader closeButton>
          <ModalTitle style={{ marginLeft: "10px" }}>
            Results for "{keyword}"
          </ModalTitle>
          <InputGroup className="ml-auto" style={{ width: "300px" }}>
            <FormControl
              placeholder="Search books"
              value={searchInput}
              onChange={(e) => dispatch(setsearchInput(e.target.value))}
              onFocus={() => dispatch(focus())}
              onBlur={() => dispatch(blur())}
            />
            <InputGroup>
              <Button
                variant="primary"
                onClick={() => {
                  if (searchInput !== "") dispatch(setkeyword(searchInput));
                }}
              >
                <BsSearch />
              </Button>
            </InputGroup>
          </InputGroup>
        </ModalHeader>
        <ModalBody>
          <div ref={resultTop}>
            {loading ? (
              <p>Searching...</p>
            ) : searchdata.status === 200 ? (
              searchdata.data !== "" ? (
                <div>
                  {/* Render search results */}
                  {searchdata.data.map((book) => (
                    <div key={book.id}>
                      <Link to={`/book/${book.id}`}>
                        <Image src={book.image} thumbnail />
                        <p>{book.title}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ margin: "auto", marginTop: "180px" }}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  <p style={{ fontSize: "25px" }}>No matching results.</p>
                </div>
              )
            ) : (
              <div style={{ margin: "auto", marginTop: "180px" }}>
                <Alert variant="danger">
                  <Alert>
                    Error {searchdata.status} (
                    {searchdata.data ? searchdata.data.statusText : ""})
                  </Alert>
                  <p>
                    Something went wrong with the server, please try again
                    later.
                  </p>
                </Alert>
              </div>
            )}
          </div>
        </ModalBody>
        {searchdata.data !== "" && searchdata.status === 200 && (
          <ModalFooter>
            <Pagination className="ml-auto" size="sm">
              {Array.from({ length: pageCount }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === page}
                  onClick={() => {
                    setpage(i + 1);
                    scroll();
                  }}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </ModalFooter>
        )}
      </Modal>
    </div>
  );
};

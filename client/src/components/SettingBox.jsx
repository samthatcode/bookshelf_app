import {
  Modal,
  Form,
  Button,
  FormControl,
  FormGroup,
  FormCheck,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { BsCheckCircleFill } from "react-icons/bs"; // Using React Bootstrap icons
import { copen, rename, sbclose, setremember, ssopen } from "../actions";
import useDB from "../hooks/useDB";
import { useState, useEffect } from "react";

export default function SettingBox() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.settingModal);
  const rememberme = useSelector((state) => state.rememberme);
  const [name, setname] = useState("");
  const [namesavedEffect, setnamesavedEffect] = useState(false);
  const userData = useSelector((state) => state.userData);
  const { renameDB } = useDB();

  useEffect(() => {
    if (modal) setname(userData.name);
  }, [modal]);

  const handleChangeName = () => {
    const changename = async () => {
      const { status } = await renameDB({ mail: userData.mail, name });
      dispatch(rename(name));
      if (status < 300) {
        setnamesavedEffect(true);
      }
    };
    changename();
  };

  const handleCheckbox = (e) => {
    dispatch(setremember(e.target.checked));
    if (e.target.checked) {
      localStorage.setItem("user", "exist");
    } else {
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    if (namesavedEffect) {
      setTimeout(() => {
        setnamesavedEffect(false);
      }, 3000);
    }
  }, [namesavedEffect]);

  return (
    <div>
      <Modal show={modal.open} onHide={() => dispatch(sbclose())}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>Setting</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: "350px", textAlign: "center" }}>
          <Form>
            <FormGroup>
              <Form.Label>Name</Form.Label>
              <FormControl
                type="text"
                value={name}
                onChange={(inp) => {
                  if (inp.target.value.length > 30) return;
                  setname(inp.target.value);
                }}
                placeholder="Enter name"
              />
              <Button
                onClick={handleChangeName}
                disabled={name === userData.name}
                size="sm"
                variant="primary"
                style={{ margin: "10px 0" }}
              >
                Change
              </Button>
              <BsCheckCircleFill
                style={{
                  color: "rgb(75, 134, 99)",
                  visibility: namesavedEffect ? "visible" : "hidden",
                }}
              />
              <FormCheck
                type="checkbox"
                id="rememberMeCheckbox"
                label="Remember me when logging in"
                checked={rememberme}
                onChange={handleCheckbox}
                style={{ margin: "20px 0" }}
              />
              <Button
                onClick={() => dispatch(ssopen("Clear"))}
                size="sm"
                variant="outline-danger"
                style={{ margin: "10px 0" }}
              >
                Clear Google bookshelf
              </Button>
              <Button
                onClick={() =>
                  dispatch(copen("Clear all data (notes/reviews)"))
                }
                size="sm"
                variant="outline-danger"
                style={{ margin: "10px 0 20px 0" }}
              >
                Clear all Notes/Reviews
              </Button>
            </FormGroup>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

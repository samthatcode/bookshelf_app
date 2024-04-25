import { Dialog } from "@headlessui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { message } from "antd";
import useDB from "../hooks/useDB";
import useApi from "../hooks/useApi";
import { useSelector, useDispatch } from "react-redux";
import {
  login,
  lclose,
  refresh,
  sopen,
  loadBookshelves,
  sethomebook,
  loadDefaultshelves,
  setcurrentshelf,
  setremember,
} from "../actions";

export default function LogInForm() {
  const dispatch = useDispatch();
  const logInModal = useSelector((state) => state.logInModal);
  const rememberme = useSelector((state) => state.rememberme);
  const logIn = useSelector((state) => state.logIn);
  const { loginDB, getbookDB } = useDB();
  const { getMyBooks, getOneBookshelf, getDetail } = useApi();
  const [result, setResult] = useState({ state: "waiting", data: {} });

  const handleClose = () => {
    dispatch(lclose());
    setResult({ state: "waiting", data: {} });
  };

  const handleCheckBox = (e) => {
    dispatch(setremember(e.target.checked));
  };

  const { login } = useGoogleLogin({
    onSuccess: async (res) => {
      try {
        // Handle login success
        console.log("Login Success:", res);
        if (logIn) {
          dispatch(refresh(res.tokenObj.access_token));
        } else {
          if (rememberme) {
            localStorage.setItem("user", "exist");
          } else {
            localStorage.removeItem("user");
          }
          const { data, status } = await loginDB(res.profileObj.email);
          if (status === 200) {
            data.logo = res.profileObj.imageUrl;
            data.token = res.tokenObj.access_token;
            setResult({ state: "sucess", data });
            if (data.homebook) {
              const homebookNotes = await getbookDB({
                email: data.email,
                id: data.homebook,
              });
              let homebookInfo = await getDetail(data.homebook);
              if (homebookInfo.status < 300) {
                if (homebookNotes === 200) {
                  homebookInfo.data.myInfo = homebookNotes.data;
                }
                dispatch(sethomebook(homebookInfo.data));
              }
            }
            const { data2, status2 } = await getMyBooks(
              res.tokenObj.access_token
            );
            if (status2 === 200) {
              //get default shelf
              const shelf2 = await getOneBookshelf(
                2,
                res.tokenObj.access_token
              );
              const shelf3 = await getOneBookshelf(
                3,
                res.tokenObj.access_token
              );
              const shelf8 = await getOneBookshelf(
                8,
                res.tokenObj.access_token
              );
              if (shelf3.status === 200 && shelf3.data !== "")
                dispatch(loadDefaultshelves({ id: 0, books: shelf3.data }));
              if (shelf2.status === 200 && shelf2.data !== "")
                dispatch(loadDefaultshelves({ id: 1, books: shelf2.data }));
              if (shelf8.status === 200 && shelf8.data !== "")
                dispatch(loadDefaultshelves({ id: 2, books: shelf8.data }));
              let bookshelves = data2.map((n) => ({
                id: n.id,
                title: n.title,
                volumeCount: n.volumeCount,
              }));
              dispatch(loadBookshelves(bookshelves));
              dispatch(setcurrentshelf({ shelf: bookshelves[5], pos: 0 }));
              dispatch(login(data));
              setTimeout(() => {
                handleClose();
                message.success({
                  content: "You have logged in.",
                  style: { marginTop: "90vh" },
                });
              }, 500);
            } else {
              setResult({
                state: "fail",
                data: { error: " google book error" },
              });
            }
          } else {
            setResult({
              state: "fail",
              data: { error: "server is not responding." },
            });
          }
        }
      } catch (error) {
        console.error("Error handling login success:", error);
        setResult({ state: "failure", data: error });
      }
    },
    onFailure: (res) => {
      try {
        // Handle login failure
        console.log("Login Failed:", res);
        setResult({ state: "failure", data: res });
      } catch (error) {
        console.error("Error handling login failure:", error);
        setResult({ state: "failure", data: error });
      }
    },
    onRequest: () => {
      setResult({ state: "loading", data: {} });
    },
  });

  const handleLogin = () => {
    // Call the login function with additional props
    login({
      cookiePolicy: "single_host_origin",
      scope: "https://www.googleapis.com/auth/books",
      isSignedIn: rememberme,
    });
  };

  return (
    <div>
      <Dialog open={logInModal} onClose={handleClose}>
        <div className="text-center p-5">
          <h2 className="text-lg font-bold mb-5">Log In</h2>
          {result.state === "waiting" ? (
            <div className="w-60 mx-auto">
              {logInModal === 3 ? (
                <></>
              ) : (
                <div style={{ height: "30px" }}></div>
              )}
              <div className="mb-10">
                <button onClick={handleLogin}>
                  Login with your Google Account
                </button>
                {logInModal === 3 ? (
                  <></>
                ) : (
                  <label className="text-gray-500 ml-12">
                    <input
                      type="checkbox"
                      checked={rememberme}
                      onChange={handleCheckBox}
                      className="mr-2"
                    />
                    Remember me
                  </label>
                )}
                {result.data.error && (
                  <div className="mt-3">
                    <p className="text-red-500">{result.data.error}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-96 w-80 mx-auto overflow-hidden">
              {result.state !== "loading" ? (
                result.state === "fail" ? (
                  <div>
                    <p className="text-red-500">{result.data.error}</p>
                    <button
                      className="text-blue-500 mt-2"
                      onClick={() => {
                        handleClose();
                        dispatch(sopen());
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <div>
                    <img
                      src={result.data.logo}
                      alt="profile"
                      className="rounded-full h-12 w-12"
                    />
                    <p className="text-gray-700 mt-2">{`Hi, ${result.data.name} !`}</p>
                    <p className="text-gray-700">
                      Welcome to your bookTracker. Redirecting ...
                    </p>
                  </div>
                )
              ) : (
                <div className="flex justify-center items-center h-full">
                  <svg
                    className="animate-spin h-6 w-6 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p>Loading...</p>
                </div>
              )}
            </div>
          )}
          {result.state === "waiting" && logInModal !== 3 && (
            <p className="text-gray-500 mt-2">
              Doesn't have an account?{" "}
              <button
                className="text-blue-500"
                onClick={() => {
                  handleClose();
                  dispatch(sopen());
                }}
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </Dialog>
    </div>
  );
}

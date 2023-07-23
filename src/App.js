import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import OTPInput from "react-otp-input";
import Navbar from "./components/Navbar";
import styled from "styled-components";
import { keyframes } from "styled-components";
import { IconButton } from "@material-ui/core";
import {
  AiOutlineShareAlt,
} from "react-icons/ai";
import { RxClipboardCopy } from "react-icons/rx";
import GetAppIcon from "@material-ui/icons/GetApp";
import {
  AttachFile,
  AudioTrack,
  Description,
  PictureAsPdf,
  Theaters,
} from "@material-ui/icons";
import { DropzoneDialog } from "material-ui-dropzone";
import Button from "@material-ui/core/Button";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { createTheme } from "@material-ui/core/styles";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  set,
  get,
  push,
  query,
  orderByChild,
  equalTo,
  remove,
} from "firebase/database";
import {
  getDownloadURL,
  ref as dbstorageref,
  uploadBytesResumable,
  getStorage,
  deleteObject,
} from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import toast, { Toaster } from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import JSZip from "jszip";
function App() {
  const [OTP, setOTP] = useState("");
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = useState();
  const [showProgress, setShowProgress] = useState(false);
  const [showUniqueID, setShowUniqueID] = useState(false);
  const [showshareButton, setShowShareButton] = useState(true);
  const [percentage, setPercentage] = useState(0);
  const [UniqueID, setUniqueID] = useState(12345);
  const [showshareUniqueID, setshowshareUniqueID] = useState(10000);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [showdownloadloader, setshowdownloadloader] = useState(false);
  const handleOTPChange = (otp) => {
    setOTP(otp);
  };

  const hue = keyframes`
  from {
    -webkit-filter: hue-rotate(0deg);
  }
  to {
    -webkit-filter: hue-rotate(-360deg);
  }
 `;

  const theme = createTheme({
    status: {
      danger: "#e53e3e",
    },
    palette: {
      primary: {
        main: "#FFFFFF",
        darker: "#FFFFFF",
      },

      neutral: {
        main: "#64748B",
        contrastText: "#fff",
      },
    },
  });
  const AnimatedGradientText = styled.h1`
    color: #f35626;
    background-image: -webkit-linear-gradient(92deg, #f35626, #feab3a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-animation: ${hue} 10s infinite linear;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-feature-settings: "kern";
    font-size: 45px;
    font-weight: 700;
    line-height: 60px;
    overflow-wrap: break-word;
    text-rendering: optimizelegibility;
    -moz-osx-font-smoothing: grayscale;
  `;

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const storage = getStorage(app);
  const handleFileDrop = (files) => {
    setPercentage(0);
    setFile(files);
    console.log(files);
    if (files.length > 1) {
      const zip = new JSZip();
      const promises = [];
      files.forEach((file, index) => {
        const fileReader = new FileReader();
        const promise = new Promise((resolve, reject) => {
          fileReader.onload = () => {
            const data = fileReader.result;
            console.log(files[index].name);
            zip.file(files[index].name, data);
            resolve();
          };
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
        fileReader.readAsArrayBuffer(file);
        promises.push(promise);
      });

      Promise.all(promises)
        .then(() => {
          zip.generateAsync({ type: "blob" }).then((content) => {
            const storageRef = dbstorageref(
              storage,
              "images/" + files[0].path + ".zip"
            );
            const uploadTask = uploadBytesResumable(storageRef, content);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setPercentage(progress);
              },
              (error) => {
                console.error(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((url) => {
                    setDownloadUrl(url);
                    console.log("File uploaded successfully");
                    console.log("Download URL:", url);
                    generateUniqueNumber()
                      .then((uniqueNumber) => {
                        console.log("Unique Number:", uniqueNumber);
                        setUniqueID(uniqueNumber);
                        return storeDataInDatabase(url, uniqueNumber);
                      })
                      .then(() => {
                        console.log(
                          "URL and Unique Number are stored in the database"
                        );
                      })
                      .catch((error) => {
                        console.error(
                          "Error storing URL and Unique Number:",
                          error
                        );
                      });
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            );
          });
        })
        .catch((error) => {
          console.error("Error creating the zip:", error);
        });
    } else {
      const storageRef = dbstorageref(storage, "images/" + files[0].path);
      const uploadTask = uploadBytesResumable(storageRef, files[0]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercentage(progress);
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              setDownloadUrl(url);
              console.log("File uploaded successfully");
              console.log("Download URL:", url);
              generateUniqueNumber()
                .then((uniqueNumber) => {
                  console.log("Unique Number:", uniqueNumber);
                  setUniqueID(uniqueNumber);
                  return storeDataInDatabase(url, uniqueNumber);
                })
                .then(() => {
                  console.log(
                    "URL and Unique Number are stored in the database"
                  );
                })
                .catch((error) => {
                  console.error("Error storing URL and Unique Number:", error);
                });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      );
    }
  };

  const generateUniqueNumber = () => {
    return new Promise((resolve, reject) => {
      const uniqueNumber = Math.floor(10000 + Math.random() * 90000);
      checkIfNumberExists(uniqueNumber)
        .then((exists) => {
          if (exists) {
            resolve(generateUniqueNumber());
          } else {
            resolve(uniqueNumber);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const checkIfNumberExists = (number) => {
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      const databaseRef = ref(database, "fileData");
      const checkQuery = query(
        databaseRef,
        orderByChild("unique"),
        equalTo(number)
      );

      onValue(
        checkQuery,
        (snapshot) => {
          resolve(snapshot.exists());
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const storeDataInDatabase = (url, uniqueNumber) => {
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      const databaseRef = ref(database, "fileData");
      const newDataRef = push(databaseRef);

      set(newDataRef, {
        url: url,
        unique: uniqueNumber,
      })
        .then(() => {
          toast.success("File Uploaded Successfully");
          setShowProgress(false);
          setshowshareUniqueID(uniqueNumber);
          setShowUniqueID(true);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  // Download Section

  const handleClick = () => {
    setshowdownloadloader(true);
    let otpp = parseInt(OTP);
    if (otpp >= 10000) {
      checkIfOTPExists(otpp)
        .then((exists) => {
          if (exists) {
            getDownloadURLFromOTP(otpp)
              .then((downloadUrl) => {
                console.log("why", downloadUrl);
                setshowdownloadloader(false);
                downloadAndDeleteFile(downloadUrl, otpp);
              })
              .catch((error) => {
                setshowdownloadloader(false);
                console.error("Error getting download URL:", error);
              });
          } else {
            setshowdownloadloader(false);
            toast.error("Invalid Unique ID", {
              style: {
                width: "2000px",
                height: "35px",
              },
            });
            setOTP("");
            console.log("Entered OTP does not exist in the database.");
          }
        })
        .catch((error) => {
          console.error("Error checking if OTP exists:", error);
        });
    } else {
      setshowdownloadloader(false);
      toast.error("Enter Proper unique ID");
    }
  };

  const checkIfOTPExists = (otp) => {
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      const databaseRef = ref(database, "fileData");

      const checkQuery = query(
        databaseRef,
        orderByChild("unique"),
        equalTo(otp)
      );

      onValue(
        checkQuery,
        (snapshot) => {
          resolve(snapshot.exists());
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const getDownloadURLFromOTP = (otp) => {
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      const databaseRef = ref(database, "fileData");

      const checkQuery = query(
        databaseRef,
        orderByChild("unique"),
        equalTo(otp)
      );

      onValue(
        checkQuery,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            resolve(Object.values(data)[0].url);
          } else {
            reject(new Error("No download URL found for the given OTP."));
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const downloadAndDeleteFile = (downloadUrl, otp) => {
    const downloadWindow = window.open(downloadUrl, "_blank");

    // After the download has started, we can delete the file from the database and storage
    setTimeout(() => {
      deleteFileFromDatabase(otp)
        .then(() => {
          console.log("File deleted from the database.");
        })
        .catch((error) => {
          console.error("Error deleting file from the database:", error);
        });

      deleteFileFromStorage(downloadUrl)
        .then(() => {
          console.log("File deleted from Firebase storage.");
        })
        .catch((error) => {
          console.error("Error deleting file from Firebase storage:", error);
        });
    }, 10000);
  };

  const deleteFileFromDatabase = (otp) => {
    const database = getDatabase();
    const databaseRef = ref(database, "fileData");

    const fileRef = query(databaseRef, orderByChild("unique"), equalTo(otp));

    return get(fileRef).then((snapshot) => {
      if (snapshot.exists()) {
        const key = Object.keys(snapshot.val())[0];
        const fileToDeleteRef = ref(database, `fileData/${key}`);
        return remove(fileToDeleteRef);
      } else {
        throw new Error("No file found for the given OTP.");
      }
    });
  };

  const deleteFileFromStorage = (downloadUrl) => {
    const storage = getStorage();
    const fileRef = dbstorageref(storage, downloadUrl);

    return deleteObject(fileRef);
  };
  const shareNewFile = () => {
    setShowUniqueID(false);
    setShowProgress(false);
    setShowShareButton(true);
    setOTP("");
    setUniqueID(10000);
    setPercentage(0);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(showshareUniqueID)
      .then(() => {
        console.log("Text copied to clipboard: ", showshareUniqueID);
        toast.success("Copied to Clipboard");
        // You can add additional handling here, such as showing a success message
      })
      .catch((error) => {
        console.error("Error copying text to clipboard: ", error);
        // You can add additional error handling here, such as showing an error message
      });
  };

  return (
    <div className="Maindiv">
      <Navbar />
      <div className="MobileViewOnly">
        <p>Now, share files online easily</p>
        <p>
          with just a{" "}
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            5-digit code
          </span>
        </p>
      </div>
      <div className="Appcontainer">
        <div className="LeftSide">
          <div className="TextContainer" style={{ marginTop: "-20%" }}>
            <h2 style={{ fontSize: "30px" }} className="textclass1">
              Now, share files online easily{" "}
            </h2>
            <AnimatedGradientText className="textclass2">
              with just a 5-digit code
            </AnimatedGradientText>
            <p style={{ fontSize: "20px" }} className="textclass3">
              No SignUp No Email No Phone Number
            </p>
          </div>
        </div>
        <div className="RightSide">
          <div className="FileUploadContainer">
            {!showUniqueID && <h2>Send Files For Free</h2>}
            {showUniqueID && <h1>Unique ID</h1>}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              {showshareButton && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                  >
                    Share Files{" "}
                    <AiOutlineShareAlt
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Button>
                </>
              )}
              {showProgress && (
                <div
                  style={{
                    width: "110px",
                    height: "110px",
                    marginTop: "-40px",
                  }}
                >
                  <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                  />
                </div>
              )}
              {showUniqueID && (
                <div>
                  <OTPInput
                    value={showshareUniqueID}
                    numInputs={5}
                    otpType="number"
                    disabled={true}
                    shouldAutoFocus={false}
                    inputStyle={{
                      width: "40px",
                      height: "40px",
                      margin: "0 5px",
                      marginTop: "-20px",
                      fontSize: "20px",
                      borderRadius: 4,
                      border: "1px solid rgba(0,0,0,0.3)",
                    }}
                    renderInput={(props) => <input {...props} />}
                    secure
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginTop: "10px" }}
                      onClick={copyToClipboard}
                    >
                      Copy to clipboard
                      <RxClipboardCopy
                        style={{ width: "20px", height: "20px" }}
                      />
                    </Button>
                  </div>
                  <a
                    href=""
                    style={{ textAlign: "center", marginBottom: "-10px" }}
                    onClick={shareNewFile}
                  >
                    <p>Share More Files?</p>
                  </a>
                </div>
              )}
            </div>

            <DropzoneDialog
              maxWidth="xs"
              // acceptedFiles={['*/*']}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              maxFileSize={100000000}
              open={open}
              // filesLimit={1}
              // onDrop={(event)=>{setOpen(false);}}
              onClose={() => setOpen(false)}
              onSave={(files) => {
                if (files[0].size > 100000000) {
                  toast.error("File Size exceeded the Limit(100MB)");
                  setOpen(false);
                } else {
                  console.log(files);
                  setFile(files);
                  setOpen(false);
                  setShowProgress(true);
                  setShowShareButton(false);
                  handleFileDrop(files);
                }
              }}
              showPreviews={true}
              showFileNamesInPreview={false}
              showAlerts={true}
              getFileAddedMessage={(files) => {
                return "File Added Succesfully";
              }}
              getFileRemovedMessage={(files) => {
                return "File Removed ";
              }}
              getFileLimitExceedMessage={(files) => {
                return "Upload only one file at a time";
              }}
              getDropRejectMessage={(files) => {
                return "Max Upload size exceeded(only 100MB)";
              }}
            />
          </div>
          <div className="DownloadSection">
            <h2>Download File</h2>
            <div className="OTPInputContainer">
              <OTPInput
                value={OTP}
                onChange={handleOTPChange}
                autoFocus
                OTPLength={5}
                numInputs={5}
                otpType="number"
                disabled={false}
                inputStyle={{
                  width: "2rem",
                  height: "2rem",
                  margin: "0 5px",

                  fontSize: "10px",
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.3)",
                }}
                renderInput={(props) => <input {...props} />}
                secure
              />
              <IconButton
                color="primary"
                aria-label="Download"
                onClick={handleClick}
                style={{
                  backgroundColor: "#547FD5",
                  width: "50px",
                  height: "40px",
                  borderRadius: "5px",
                  marginLeft: "5px",
                }}
              >
                {showdownloadloader && (
                  <ThreeDots
                    height="50"
                    width="30"
                    radius="9"
                    color="#FFFFFF"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                )}
                {!showdownloadloader && (
                  <GetAppIcon fontSize="medium" style={{ color: "#FFFFFF" }} />
                )}
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <div className="Footer">
        {" "}
        <div className="Wave"></div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;

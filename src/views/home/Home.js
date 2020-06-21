import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../../common/loader/Loader";

function Home() {
  const [boardData, setBoardData] = useState({});
  const [showBoard, setShowBoard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  document.title = "Pro Organizer";
  useEffect(() => {
    getBoardData();
  }, [showBoard]);

  const getBoardData = () => {
    axios
      .get("https://ga01-5e4a4.firebaseio.com//boardContents.json")
      .then((res) => {
        setTimeout(setBoardData(res.data), 50000);
        setIsLoading(false);
        if (boardData !== null) {
          setShowBoard(true);
        } else setShowBoard(false);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <br />
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <div className={styles.boardContainer}>
            <h3 className={styles.header}>Boards</h3>
            <br />
            {showBoard ? (
              <div className={styles.boardList}>
                {boardData &&
                  Object.entries(boardData).map((item) => (
                    <Link
                      to={{
                        pathname: "/" + item[1].boardName,
                        state: {
                          type: item[1].boardType,
                          members: item[1].members,
                          boardId: item[0],
                        },
                      }}
                    >
                      <div className={styles.boardItem}>
                        <h6 className={styles.boardHeader}>
                          {" "}
                          {item[1].boardName}{" "}
                        </h6>
                        {/* <Board setBoardData={setBoardData}></Board> */}
                      </div>
                    </Link>
                  ))}
              </div>
            ) : (
              <p>
                You haven't created any boards. Kindly click on the 'Create
                Board' button in the navigation bar to create a board.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;

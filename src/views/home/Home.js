import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../../common/loader/Loader";
import { db } from "../../service/firebase";
import { RenderArray } from "../../common/RenderArray";
import Axios from "axios";

function Home() {
  const [boards, setBoards] = useState({});
  const [showBoard, setShowBoard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  document.title = "Pro Organizer";
  useEffect(() => {
    getBoardData();
  }, [showBoard]);
  // useEffect(() => {
  //   if (boardData !== null) {
  //     setShowBoard(true);
  //   } else {
  //     setShowBoard(false);
  //   }
  // }, [boardData]);

  const getBoardData = () => {
    db.ref("trello/boards").on("value", function (snapshot) {
      var childData = snapshot.val();
      setBoards(Object.entries(childData ?? {}));
      setIsLoading(false);
      console.log(childData);

      // snapshot.forEach((childSnapshot) => {
      //   console.log('childSnapshot is ', childSnapshot);
      //   debugger;
      //   console.log('data is ', childSnapshot.val());
      // });
    });
  };
  /** renderProp */
  const renderBoard = (board) => {
    return (
      <Link
        to={{
          pathname: "/board/" + board[0],
          state: board[1],
        }}
      >
        <div className={styles.boardItem}>
          <h6 className={styles.boardHeader}> {board[1].boardName} </h6>
        </div>
      </Link>
    );
  };
  return (
    <div className={styles.boardContainer}>
      <h3 className={styles.header}>Boards</h3>
      <div className={boards.length > 0 ? styles.boardList : ""}>
        <RenderArray
          loading={isLoading}
          renderItem={renderBoard}
          items={boards}
          Fallback={
            <p>
              You haven't created any boards. Kindly click on the 'Create Board'
              button in the navigation bar to create a board.
            </p>
          }
        />
      </div>
    </div>
  );
}

export default Home;

import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import styles from "./Board.module.css";
import Axios from "axios";

import { AddColumnForm } from "../../components/addColumn/AddColumnForm";
import Card from "../../components/card/Card";
import Loader from "../../common/loader/Loader";
import { db } from "../../service/firebase";
import { ACard as CardList } from "../../components/card/ACard";
import { ColumnHeader } from "../../components/addColumn/ColumnHeader";
import CardStyles from "../../components/card/Card.module.css";
import { Modal } from "../../common/Modal/Modal";
import { AddCardForm } from "../../components/card/AddCardForm";
const Board = (props) => {
  const { boardId } = props.match?.params ?? {};
  debugger;
  // const { members, boardName } = props.location?.state ?? {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [columns, setColumns] = useState([]);
  const [showColumn, setShowColumn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCardDragged, setIsCardDragged] = useState(false);
  const [isColumnDelete, setIsColumnDelete] = useState(false);
  const history = useHistory();
  const [board, setBoard] = useState({});
  const [columnIdForAddCard, setColumnIdForAddCard] = useState("");

  // to set board title
  useEffect(() => {
    document.title = boardName + " | Pro Organizer";
  }, []);
  const getBoardData = (boardId) => {
    db.ref(`trello/boards/${boardId}`).on("value", function (snapshot) {
      var childData = snapshot.val();
      setBoard(childData ?? {});
      setIsLoading(false);
      console.log(childData);
    });
  };
  const { members = "", boardName = "" } = board;

  useEffect(() => {
    getBoardData(boardId);
  }, [boardId]);

  useEffect(() => {
    setShowColumn(false);
    setIsCardDragged(false);
    getColumnData();
    setIsColumnDelete(false);
  }, [showColumn, isColumnDelete, isCardDragged]);

  const getColumnData = () => {
    // to get column details from firebase
    db.ref(`/trello/columns/${boardId}`).on("value", function (snapshot) {
      var childData = snapshot.val();
      setColumns(Object.entries(childData ?? {}));
      setIsLoading(false);
      console.log(childData);
    });
  };

  // handle column delete

  // handle board delete
  const handleBoardDelete = (e) => {
    if (window.confirm("Are you sure you want to delete the board?")) {
      Axios.delete(
        `https://ga01-5e4a4.firebaseio.com//boardContents/${props.location.state.boardId}.json`
      )
        .then((res) => {
          alert("board deleted succesfully");
          history.push("/");
        })
        .catch((err) => console.log("Error" + err));
    }
  };
  //  handle card drop
  const handleCardDrop = async (droppedColumnId, e) => {
    e.preventDefault();
    var droppedCardData = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { cardId } = droppedCardData;
    try {
      const result = await db.ref(`/trello/cards/${boardId}/${cardId}`).update({
        columnId: droppedColumnId,
      });
      console.log("successfully transferred card to new column", result);
    } catch (err) {
      console.log("Got error while transferring card", err);
    }
  };
  const closeModal = () => setIsModalVisible(false);
  const renderColumn = (item) => {
    const columnId = item[0];
    return (
      <div className={styles.columnItem} key={item[0]}>
        <ColumnHeader
          columnId={item[0]}
          columnName={item[1]?.name}
          boardId={boardId}
        />
        <br />
        {/* Card Container component comes here */}
        <div
          className={styles.cardContainer}
          onDrop={(e) => handleCardDrop(item[0], e)}
          onDragOver={(e) => {
            e.preventDefault();
            console.log(e.target);
          }}
        >
          <CardList boardId={boardId} columnId={columnId} />
          {/* <Card
            members={members}
            columnId={item[0]}
            boardId={boardId}
            boardTitle={boardName}
            isCardDragged={isCardDragged}></Card> */}
        </div>
        <button
          id="addCardBox"
          className={CardStyles.addCardBox}
          onClick={() => {
            setColumnIdForAddCard(columnId);
            setIsModalVisible(true);
          }}
          // onDragOver={allowDrop}
        >
          Add a card
        </button>
      </div>
    );
  };

  // debugger;
  return (
    <div>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <div className={styles.columnsContainer}>
          <br />
          <div className={styles.boardHeader}>
            <h3>{boardName}</h3>
            <button
              className={styles.deleteBoardBtn}
              type="button"
              onClick={handleBoardDelete}
            >
              Delete Board
            </button>
          </div>

          <br />
          <br />
          <div className={styles.addColumnContainer}>
            {columns.map(renderColumn)}
            <AddColumnForm
              boardName={boardName}
              boardId={boardId}
              setShowColumn={setShowColumn}
            ></AddColumnForm>
          </div>
        </div>
      )}
      <Modal isModalVisible={isModalVisible} closeModal={closeModal}>
        <AddCardForm
          closeForm={closeModal}
          boardId={boardId}
          board={board}
          columnId={columnIdForAddCard}
        />
      </Modal>
    </div>
  );
};

export default withRouter(Board);

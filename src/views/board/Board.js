import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import styles from "./Board.module.css";
import Axios from "axios";

import AddColumn from "../../components/addColumn/AddColumn";
import Card from "../../components/card/Card";
import Loader from "../../common/loader/Loader";

function Board(props) {
  const name = props.match.params.boardName;

  const members = props.location.state.members;
  const [columnData, setColumnData] = useState({});
  const [showColumn, setShowColumn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCardDragged, setIsCardDragged] = useState(false);
  const [isColumnDelete, setIsColumnDelete] = useState(false);
  // to use history function
  const history = useHistory();

  // to set board title
  document.title = name + " | Pro Organizer";

  useEffect(() => {
    setShowColumn(false);
    setIsCardDragged(false);
    getColumnData();
    setIsColumnDelete(false);
  }, [showColumn, isColumnDelete, isCardDragged]);

  const getColumnData = () => {
    // to get column details from firebase
    Axios.get(
      `https://ga01-5e4a4.firebaseio.com//boardContents/${props.location.state.boardId}/column.json`
    )
      .then((res) => {
        setColumnData(res.data);
        setIsLoading(false);

        // if (Object.keys(columnData).length > 0) {
        //   setShowColumn(true);
        // } else {
        //   setShowColumn(false);
        // }
      })
      .catch((err) => console.log(err));
  };

  // handle column delete
  const handleColumnDelete = (columnId, e) => {
    Axios.delete(
      `https://ga01-5e4a4.firebaseio.com//boardContents/${props.location.state.boardId}/column/${columnId}.json`
    )
      .then((res) => {
        alert("column deleted succesfully");
        setIsColumnDelete(true);
      })
      .catch((err) => console.log("Error" + err));
  };

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
  const handleCardDrop = (droppedColumnId, e) => {
    e.preventDefault();
    var droppedCardData = JSON.parse(e.dataTransfer.getData("text/plain"));
    console.log(droppedCardData);

    const prevColId = droppedCardData.columnId;
    const prevCardId = droppedCardData.dragCardId;
    const draggedCardData = droppedCardData.cardData;

    if (draggedCardData !== null) {
      //   // Delete from previous column
      Axios.delete(
        `https://ga01-5e4a4.firebaseio.com//boardContents/${props.location.state.boardId}/column/${prevColId}/card/${prevCardId}.json`
      )
        .then((res) => {
          console.log("card removed");
        })
        .catch((err) => console.log("Error" + err));

      // Add card to new column
      Axios.post(
        `https://ga01-5e4a4.firebaseio.com//boardContents/${props.location.state.boardId}/column/${droppedColumnId}/card.json`,
        {
          cardTitle: draggedCardData.cardTitle,
          team: draggedCardData.team,
          descrptn: draggedCardData.descrptn,
          dueDate: draggedCardData.dueDate,
        }
      )
        .then((res) => {
          console.log("card added in new column");
          // call new card
        })
        .catch((err) => console.log("Error" + err));
      setIsCardDragged(true);
    }
  };
  return (
    <div>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <div className={styles.columnsContainer}>
          <br />
          <div className={styles.boardHeader}>
            <h3>{name}</h3>
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
            {columnData &&
              Object.entries(columnData).map((item) => (
                <div className={styles.columnItem} key={item[0]}>
                  <div className={styles.columnHeader}>
                    <div className={styles.columnTitle}>{item[1].name}</div>
                    <div className={styles.deleteColumn}>
                      <i
                        className="fas fa-trash-alt"
                        onClick={(e) => handleColumnDelete(item[0], e)}
                      ></i>
                    </div>
                  </div>
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
                    <Card
                      members={members}
                      columnId={item[0]}
                      boardId={props.location.state.boardId}
                      boardTitle={name}
                      isCardDragged={isCardDragged}
                    ></Card>
                  </div>
                </div>
              ))}
            <AddColumn
              pathname={props.location.pathname}
              boardId={props.location.state.boardId}
              getColumnData={getColumnData}
              setShowColumn={setShowColumn}
            ></AddColumn>
          </div>
        </div>
      )}
    </div>
  );
}

export default withRouter(Board);

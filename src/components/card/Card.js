import React, { useState, useEffect } from "react";
import styles from "./Card.module.css";
import modalStyles from "../Modal/Modal.module.css";
import { Modal } from "../Modal/Modal";
import Axios from "axios";

function Card(props) {
  const [showModal, setShowModal] = useState(false);
  const { members, columnId, boardId, boardTitle, isCardDragged } = props;
  // to split members list string into array
  const memberArr = members.split(",");

  const [isCardAdded, setIsCardAdded] = useState(false);
  const [isCardDelete, setIsCardDelete] = useState(false);
  const [isCardEdited, setIsCardEdited] = useState(false);
  // card states
  const [cardTitle, setCardTitle] = useState("");
  const [team, setTeam] = useState([]);
  const [descrptn, setDescrptn] = useState("");
  const [dueDate, setDueDate] = useState("");
  //const [showCard, setShowCard] = useState(false);

  // to get column data
  const [cardData, setCardData] = useState({});

  // to handle details of card
  const [showDetails, setShowDetails] = useState(false);
  const [cardName, setCardName] = useState("");
  const [descDetails, setDescDetails] = useState("");
  const [dateDetails, setDateDetails] = useState("");
  const [teamDetail, setTeamDetails] = useState([]);
  const [editDetails, setEditDetails] = useState(false);
  const [cardId, setCardId] = useState("");

  // to get today's date iin yyyy-mm-dd format
  var today = new Date();
  var month,
    day = null;
  if (today.getMonth() < 10 || today.getDate() < 10) {
    month = "0" + (today.getMonth() + 1);
    day = "0" + today.getDate();
  }
  var date = today.getFullYear() + "-" + month + "-" + day;

  useEffect(() => {
    setIsCardAdded(false);
    setIsCardDelete(false);
    setIsCardEdited(false);
    getCardData();
  }, [isCardAdded, isCardDragged, isCardDelete, isCardEdited]);

  // to get card details from firebase
  const getCardData = () => {
    Axios.get(
      `https://ga01-5e4a4.firebaseio.com//boardContents/${boardId}/column/${columnId}/card.json`
    )
      .then((res) => {
        setCardData(res.data);
        // if (cardData !== null) {
        //   setShowCard(true);
        // } else {
        //   setShowCard(false);
        // }
      })
      .catch((err) => console.log("Error in getCardData" + err));
  };

  //  to handle add card modal click
  const handleAddCardClick = (e) => {
    //   check if all input is taken
    if (
      (cardTitle === "" || descrptn === "" || dueDate === "") &&
      editDetails === false
    ) {
      document.getElementById("cardInputError").innerHTML =
        "<strong>Note</strong>: All the fields are required!!!";
    } else {
      // if user wants to edit then put request is used
      if (editDetails) {
        Axios.put(
          `https://ga01-5e4a4.firebaseio.com//boardContents/${boardId}/column/${columnId}/card/${cardId}.json`,
          {
            cardTitle: cardTitle === "" ? cardName : cardTitle,
            team: team.length === 0 ? teamDetail : team,
            descrptn: descrptn === "" ? descDetails : descrptn,
            dueDate: dueDate === "" ? dateDetails : dueDate,
          }
        )
          .then((res) => {
            alert("card edited succesfully");
            setIsCardEdited(true);
          })
          .catch((err) => console.log("Error in editDetails" + err));
      }
      //  if user wants to add a new card
      else {
        Axios.post(
          `https://ga01-5e4a4.firebaseio.com//boardContents/${boardId}/column/${columnId}/card.json`,
          {
            cardTitle: cardTitle,
            team: team,
            descrptn: descrptn,
            dueDate: dueDate,
          }
        )
          .then((res) => {
            alert("card added succesfully");
            // call new card
            // getCardData();
            setIsCardAdded(true);
          })
          .catch((err) => console.log("Error" + err));
      }

      setShowModal(false);
      setEditDetails(false);

      setCardTitle("");
      setTeam([]);
      setDescrptn("");
      setDueDate("");
    }
  };

  // on click of card this function shows details
  const onCardClick = (
    cardName,
    descDetails,
    dateDetails,
    teamDetails,
    cardId,
    e
  ) => {
    setShowDetails(true);

    setCardName(cardName);
    setDescDetails(descDetails);
    setDateDetails(dateDetails);

    setTeamDetails(teamDetails);
    setCardId(cardId);
  };
  // handles edit button click
  const handleEdit = (e) => {
    setShowDetails(false);
    setShowModal(true);
    setEditDetails(true);
  };
  // handles archive on card archive click
  const handleArchive = (e) => {
    Axios.delete(
      `https://ga01-5e4a4.firebaseio.com//boardContents/${boardId}/column/${columnId}/card/${cardId}.json`
    )
      .then((res) => {
        alert("card archived succesfully");
        setIsCardDelete(true);
      })
      .catch((err) => console.log("Error" + err));

    setShowDetails(false);
  };

  const onSelectChange = (e) => {
    const values = [...e.target.selectedOptions].map((opt) => opt.value);
    setTeam(values);
  };

  const drag = (itemData, dragCardId, e) => {
    var draggedCard = {
      columnId: columnId,
      dragCardId: dragCardId,
      cardData: itemData,
    };

    e.dataTransfer.setData("text/plain", JSON.stringify(draggedCard));
    console.log(e.dataTransfer.getData("text/plain"));
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };
  return (
    <>
      {/* to show card html part starts here */}
      <div className={styles.showCardContainer}>
        {cardData &&
          Object.entries(cardData).map((item) => (
            <div key={item[0]}>
              <div
                className={styles.cardHeader}
                id={item[0]}
                value={item[1].cardTitle}
                onClick={(e) =>
                  onCardClick(
                    item[1].cardTitle,
                    item[1].descrptn,
                    item[1].dueDate,
                    item[1].team,
                    item[0],
                    e
                  )
                }
                draggable="true"
                onDragStart={(e) => drag(item[1], item[0], e)}
              >
                {item[1].cardTitle}
                <div className={styles.cardContent}>
                  <div>
                    <i className="fas fa-list"></i>
                  </div>
                  <div>
                    {item[1].team !== undefined ? (
                      item[1].team.map((i) => (
                        <span className={styles.cardMembers} key={i}>
                          {i.charAt(0)}
                        </span>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/*to show card html part End here  */}
      <button
        id="addCardBox"
        className={styles.addCardBox}
        onClick={() => setShowModal(true)}
        onDragOver={allowDrop}
      >
        Add a card
      </button>
      <br />
      {showModal && (
        <Modal flag={"addCard"}>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            style={{ width: "5%", height: "10%" }}
            onClick={() => {
              setShowModal(false);
              setEditDetails(false);
            }}
          >
            &times;
          </button>
          <h5 className={modalStyles.modalTitle}>Add Card</h5>
          <br />
          <div className={modalStyles.cardFormContainer}>
            <label htmlFor="title" className={modalStyles.cardInputTitle}>
              Enter a title for your task:
            </label>
            <input
              id="title"
              type="text"
              className={modalStyles.cardInputBox}
              defaultValue={editDetails ? cardName : ""}
              placeholder="e.g. Add a new icon"
              onChange={(e) => setCardTitle(e.target.value)}
            ></input>
            <br />

            <label htmlFor="members" className={modalStyles.cardInputTitle}>
              Choose members for this task(select multiple,if needed)
            </label>
            <select
              id="membersList"
              name="membersList"
              defaultValue={editDetails ? teamDetail : ""}
              className={modalStyles.cardInputBox}
              multiple
              onChange={onSelectChange}
            >
              {memberArr.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            <br />

            <label htmlFor="description" className={modalStyles.cardInputTitle}>
              Add the description for your task
            </label>
            <input
              id="description"
              type="text"
              className={modalStyles.cardInputBox}
              defaultValue={editDetails ? descDetails : ""}
              placeholder="Add your description here"
              onChange={(e) => setDescrptn(e.target.value)}
            ></input>
            <br />

            <label htmlFor="due_date" className={modalStyles.cardInputTitle}>
              Select the due-date for this task
            </label>
            <input
              id="due_date"
              type="date"
              min={date}
              className={modalStyles.cardInputBox}
              defaultValue={editDetails ? dateDetails : ""}
              onChange={(e) => setDueDate(e.target.value)}
            ></input>
            <br />

            <button
              id="CreateCard"
              className="btn btn-primary"
              onClick={handleAddCardClick}
            >
              Add Card
            </button>
            <br />
          </div>
          <div id="cardInputError" style={{ color: "red" }}></div>
        </Modal>
      )}
      <br />
      {showDetails && (
        <Modal>
          <div>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              style={{ width: "5%" }}
              onClick={() => setShowDetails(false)}
            >
              &times;
            </button>
            <div className={styles.cardDetailContainer}>
              <div className={styles.cardDetailHeader}>
                <h3>{cardName}</h3>
                <div className={styles.editAndArcbtn}>
                  <button
                    type="button"
                    id="editBtn"
                    className="btn btn-primary"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    id="archiveBtn"
                    style={{ marginLeft: "10px" }}
                    className="btn btn-danger"
                    onClick={handleArchive}
                  >
                    Archive
                  </button>
                </div>
              </div>
              <div>in {boardTitle}</div>
              <br />
              <h5>Description</h5>
              <div>{descDetails}</div>
              <br />
              <h5>Members</h5>
              <div>
                {teamDetail !== undefined &&
                  teamDetail.map((i) => (
                    <span className={styles.cardMembers} key={i}>
                      {i.charAt(0)}
                    </span>
                  ))}
              </div>
              <br />
              <h5>Due Date</h5>
              <div>{dateDetails}</div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Card;

import React, { useState, useEffect } from 'react';
import modalStyles from '../Modal/Modal.module.css';
import { db } from '../../service/firebase';
export const AddCardForm = (props) => {
  const { columnId, boardId, isCardDragged, board, closeForm } = props;
  const { members, boardName } = board;
  // to split members list string into array

  const memberArr = members?.split(',') ?? [];

  // card states
  const [cardTitle, setCardTitle] = useState('');
  const [team, setTeam] = useState([]);
  const [descrptn, setDescrptn] = useState('');
  const [dueDate, setDueDate] = useState('');

  // to handle details of card
  const [showDetails, setShowDetails] = useState(false);
  const [cardName, setCardName] = useState('');
  const [descDetails, setDescDetails] = useState('');
  const [dateDetails, setDateDetails] = useState('');
  const [teamDetail, setTeamDetails] = useState([]);
  const [editDetails, setEditDetails] = useState(false);
  const [cardId, setCardId] = useState('');
  const onSelectChange = (e) => {
    const values = [...e.target.selectedOptions].map((opt) => opt.value);
    setTeam(values);
  };
  // to get today's date iin yyyy-mm-dd format
  var today = new Date();
  var month,
    day = null;
  if (today.getMonth() < 10 || today.getDate() < 10) {
    month = '0' + (today.getMonth() + 1);
    day = '0' + today.getDate();
  }
  var date = today.getFullYear() + '-' + month + '-' + day;

  //  to handle add card modal click
  const handleAddCardClick = async (e) => {
    //   check if all input is taken
    if (
      (cardTitle === '' || descrptn === '' || dueDate === '') &&
      editDetails === false
    ) {
      document.getElementById('cardInputError').innerHTML =
        '<strong>Note</strong>: All the fields are required!!!';
    } else {
      // if user wants to edit then put request is used
      if (editDetails) {
        /*         Axios.put(
          `https://ga01-5e4a4.firebaseio.com//boardContents/${boardId}/column/${columnId}/card/${cardId}.json`,
          {
            cardTitle: cardTitle === '' ? cardName : cardTitle,
            team: team.length === 0 ? teamDetail : team,
            descrptn: descrptn === '' ? descDetails : descrptn,
            dueDate: dueDate === '' ? dateDetails : dueDate,
          }
        )
          .then((res) => {
            alert('card edited succesfully');
            // TODO: CHECK if below line is required
            // setIsCardEdited(true);
          })
          .catch((err) => console.log('Error in editDetails' + err)); */
      }
      //  if user wants to add a new card
      else {
        try {
          const result = await db.ref(`/trello/cards/${boardId}`).push({
            cardTitle: cardTitle,
            team: team,
            descrptn: descrptn,
            dueDate: dueDate,
            columnId,
          });
          console.log(
            `card = ${cardTitle} added successfully on board`,
            result
          );
          closeForm();
          // setShowModal(false);
        } catch (error) {
          console.log('there was a error adding card Name', cardTitle);
        }
        /* Axios.post(
          `https://ga01-5e4a4.firebaseio.com//boardContents/${boardId}/column/${columnId}/card.json`,
          {
            cardTitle: cardTitle,
            team: team,
            descrptn: descrptn,
            dueDate: dueDate,
          }
        )
          .then((res) => {
            alert('card added succesfully');
            // call new card
            // getCardData();
            // TODO: CHECK if below line is required
            // setIsCardAdded(true);
          })
          .catch((err) => console.log('Error' + err)); */
      }

      closeForm();
      setEditDetails(false);

      setCardTitle('');
      setTeam([]);
      setDescrptn('');
      setDueDate('');
    }
  };

  return (
    <div>
      {/*       <button
        type="button"
        className="close"
        data-dismiss="modal"
        style={{ width: '5%', height: '10%' }}
        onClick={() => {
          setShowModal(false);
          setEditDetails(false);
        }}>
        &times;
      </button> */}
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
          defaultValue={editDetails ? cardName : ''}
          placeholder="e.g. Add a new icon"
          onChange={(e) => setCardTitle(e.target.value)}></input>
        <br />

        <label htmlFor="members" className={modalStyles.cardInputTitle}>
          Choose members for this task(select multiple,if needed)
        </label>
        <select
          id="membersList"
          name="membersList"
          defaultValue={editDetails ? teamDetail : ''}
          className={modalStyles.cardInputBox}
          multiple
          onChange={onSelectChange}>
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
          defaultValue={editDetails ? descDetails : ''}
          placeholder="Add your description here"
          onChange={(e) => setDescrptn(e.target.value)}></input>
        <br />

        <label htmlFor="due_date" className={modalStyles.cardInputTitle}>
          Select the due-date for this task
        </label>
        <input
          id="due_date"
          type="date"
          min={date}
          className={modalStyles.cardInputBox}
          defaultValue={editDetails ? dateDetails : ''}
          onChange={(e) => setDueDate(e.target.value)}></input>
        <br />

        <button
          id="CreateCard"
          className="btn btn-primary"
          onClick={handleAddCardClick}>
          Add Card
        </button>
        <br />
      </div>
      <div id="cardInputError" style={{ color: 'red' }}></div>
    </div>
  );
};

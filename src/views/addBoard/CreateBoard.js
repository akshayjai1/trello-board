import React, { useState } from 'react';
import style from './CreateBoard.module.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { db } from '../../service/firebase';

function CreateBoard() {
  // all states are mentioned here
  const [boardName, setBoardName] = useState('');
  const [members, setMembers] = useState('');
  const [type, setType] = useState('');
  // to use history function
  const history = useHistory();

  // function to handle button click
  const handleClick = async (e) => {
    e.preventDefault();
    if (boardName === '' || members === '') {
      document.getElementById('showError').innerHTML =
        'Board Name and members fields are important!!';
    } else {
      try {
        const res = await db.ref('trel').push({
          boardName: boardName,
          members: members,
          boardType: type,
        });
        console.log('added board to trel', res);
        history.push('/');
      } catch (err) {
        console.log('Got error while pushing board', err);
      }
    }
  };
  return (
    <div className={style.createBoard}>
      <br />
      <header>
        <h3 className={style.header}>Create A Board</h3>
      </header>
      <br />

      <form className={style.boardInput}>
        <label htmlFor="name">
          <strong>Enter a name for your board:</strong>
        </label>
        <input
          id="name"
          className={style.inputElement}
          type="text"
          placeholder="e.g. Agile Sprint Board"
          onChange={(e) => setBoardName(e.target.value)}></input>
        <br />
        <br />
        <label htmlFor="team">
          <strong>Add your team members:</strong>
        </label>
        <input
          id="team"
          className={style.inputElement}
          type="text"
          placeholder="Add your team(separated by commas)"
          onChange={(e) =>
            setMembers(e.target.value.split(' ').toString())
          }></input>
        <br />
        <br />
        <label htmlFor="type">
          <strong>Enter the type of your board:</strong>
        </label>
        <input
          id="type"
          className={style.inputElement}
          type="text"
          placeholder="e.g. Design UX"
          onChange={(e) => setType(e.target.value)}></input>
        <br />
        <br />
        <button
          type="submit"
          id="CreateBoard"
          className="btn btn-primary"
          onClick={handleClick}>
          Create
        </button>
      </form>
      <br />
      <div id="showError" style={{ color: 'red' }}></div>
    </div>
  );
}

export default CreateBoard;

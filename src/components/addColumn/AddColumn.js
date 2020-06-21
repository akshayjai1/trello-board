import React, { useState, useEffect } from "react";
import styles from "./AddColumn.module.css";
import modalStyles from "../Modal/Modal.module.css";

import { Modal } from "../Modal/Modal";
import Axios from "axios";

function AddColumn(props) {
  const [showModal, setShowModal] = useState(false);
  const [columnName, setColumnName] = useState("");
  useEffect(() => {
    handleClick();
  }, [showModal]);

  const handleClick = () => {
    let colBox = document.getElementById("addColumnBox");
    colBox.addEventListener("click", () => {
      setShowModal(true);
    });
  };

  const handleAddColumnClick = (e) => {
    if (columnName === "") {
      document.getElementById("inputError").innerHTML =
        "Please fill the column name field";
    } else {
      // add column name in firebase
      Axios.post(
        `https://ga01-5e4a4.firebaseio.com//boardContents/${props.boardId}/column.json`,
        {
          name: columnName,
        }
      )
        .then((res) => {
          alert("column added succesfully");
          // props.getColumnData();
          props.setShowColumn(true);
        })
        .catch((err) => console.log(err));

      setShowModal(false);
    }
  };
  //console.log(showModal);
  return (
    <>
      <div className={styles.addColumnBox} id="addColumnBox">
        <div>Add a Column</div>
      </div>
      <br />
      {showModal && (
        <Modal flag={"addColumn"}>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            style={{ width: "5%" }}
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
          <h5 className={modalStyles.modalTitle}>Add column</h5>
          <br />
          <div className={modalStyles.addColumnInput}>
            <label htmlFor="column_name">Enter a column name:</label>
            <input
              id="column_name"
              type="text"
              value={columnName}
              className={modalStyles.inputBox}
              onChange={(e) => {
                e.preventDefault();
                setColumnName(e.target.value);
              }}
            ></input>
            <br />
            <br />
          </div>
          <br />
          <button
            className="btn btn-primary"
            id="CreateColumn"
            onClick={handleAddColumnClick}
          >
            Add Column
          </button>
          <br />
          <br />
          <div id="inputError"></div>
        </Modal>
      )}
    </>
  );
}

export default AddColumn;

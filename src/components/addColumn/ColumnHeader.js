import React from 'react';
import styles from '../../views/board/Board.module.css';
import { db } from '../../service/firebase';

export const ColumnHeader = (props) => {
  const { columnName, columnId, boardId } = props;
  const handleColumnDelete = async (columnId, e) => {
    try {
      const result = await db
        .ref(`/trello/columns/${boardId}/${columnId}`)
        .remove();
      console.log(`column = ${columnName} deleted successfully`, result);
      // TODO: refresh board
    } catch (error) {
      console.log('there was error deleting column', error);
    }
  };
  //   Axios.delete(
  //     `https://ga01-5e4a4.firebaseio.com//boardContents/${props.location.state.boardId}/column/${columnId}.json`
  //   )
  //     .then((res) => {
  //       alert('column deleted succesfully');
  //       setIsColumnDelete(true);
  //     })
  //     .catch((err) => console.log('Error' + err));
  // };
  return (
    <div className={styles.columnHeader}>
      <div className={styles.columnTitle}>{columnName}</div>
      <div className={styles.deleteColumn}>
        <i
          className="fas fa-trash-alt"
          onClick={(e) => handleColumnDelete(columnId, e)}></i>
      </div>
    </div>
  );
};

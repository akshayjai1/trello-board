import React, { useState, useEffect } from "react";
import { RenderArray } from "../../common/RenderArray";
import styles from "./Card.module.css";
import { db } from "../../service/firebase"; //named export
export const ACard = (props) => {
  const { boardId, columnId } = props;
  const [cards, setCards] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  const getCards = async (boardId) => {
    db.ref(`/trello/cards/${boardId}`)
      .orderByChild("columnId")
      .equalTo(columnId)
      .on("value", function (snapshot) {
        var childData = snapshot.val();
        debugger;
        setCards(Object.entries(childData ?? {}));
        // setIsLoading(false);
        console.log(childData);
      });
  };
  useEffect(() => {
    getCards(boardId);
  }, [boardId]);
  const drag = (itemData, dragCardId, e) => {
    var draggedCard = {
      initialColumnId: columnId,
      cardId: dragCardId,
      cardData: itemData,
    };

    e.dataTransfer.setData("text/plain", JSON.stringify(draggedCard));
    console.log(e.dataTransfer.getData("text/plain"));
  };
  const renderCard = (card) => {
    debugger;
    return (
      <div
        className={styles.cardHeader}
        id={card[0]}
        value={card[1].cardTitle}
        onClick={(e) => {
          /* onCardClick(
            card[1].cardTitle,
            card[1].descrptn,
            card[1].dueDate,
            card[1].team,
            card[0],
            e
          ); */
        }}
        draggable="true"
        onDragStart={(e) => {
          console.log("on drag start");
          drag(card[1], card[0], e);
        }}
      >
        {card[1].cardTitle}
        <div className={styles.cardContent}>
          <div>
            <i className="fas fa-list"></i>
          </div>
          <div>
            {card[1].team !== undefined ? (
              card[1].team.map((i) => (
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
    );
  };
  return (
    <div>
      <RenderArray items={cards} renderItem={renderCard} />
    </div>
  );
};

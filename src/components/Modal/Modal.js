import React from "react";
import Backdrop from "./backdrop/backdrop";

export const Modal = (props) => {
 
  var inlineStyles = {
    addColumn: {
      height: "250px",
      textAlign: "center",
      position: "fixed",
      backgroundColor: "#fff",
      zIndex: "500",
      left: "15%",
      top: "20%",
      boxSizing: "border-box",
      width: "70%",
      borderRadius: "10px",
    },
    addCard: {
      height: "600px",
      textAlign: "center",
      position: "fixed",
      backgroundColor: "#fff",
      zIndex: "500",
      left: "15%",
      top: "10%",
      boxSizing: "border-box",
      width: "70%",
      borderRadius: "10px"
    },
    showCard: {
      height: "450px",
      textAlign: "center",
      position: "fixed",
      backgroundColor: "#fff",
      zIndex: "500",
      left: "15%",
      top: "10%",
      boxSizing: "border-box",
      width: "70%",
      borderRadius: "10px"
    }
  };
  var style = props.flag==='addColumn'? inlineStyles.addColumn : (props.flag==='addCard'?inlineStyles.addCard:inlineStyles.showCard);

 

  return (
    <div>
      <Backdrop></Backdrop>

      <div style={style}>{props.children}</div>
    </div>
  );
};

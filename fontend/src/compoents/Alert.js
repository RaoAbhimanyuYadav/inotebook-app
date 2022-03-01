import React from "react";

export default function Alert(props) {
  const capatalise = (word) => {
    if (word === "danger") {
      word = "error";
    }
    let text = word.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  return (
    <div style={{ height: "50px" }}>
      {props.alert && (
        <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
          <strong>{capatalise(props.alert.type)}</strong>: {props.alert.msg}
        </div>
      )}
    </div>
  );
}

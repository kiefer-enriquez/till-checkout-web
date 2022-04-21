import React from "react";

const Input = ({ onEdit, name, label, id }) => {
  return (
    <>
      <label style={styles.label}>{label}</label>
      <br />
      <input
        id={id}
        type="text"
        name={name}
        onChange={onEdit}
        size={setwidth(name)}
      />
    </>
  );
};

const Error = ({ err }) => {
  return (
    <>
      <br />
      <span style={{ fontSize: 12, color: "red" }}> {err} </span>
    </>
  );
};

const styles = {
  label: {
    fontSize: "12px",
    color: "#a89f9e",
    paddingTop: 15,
    paddingLeft: 0,
  },
};

const setwidth = (name) => {
  return name == "month" || name == "year" ? "5" : "";
};

export { Input, Error };

import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import CharacterContext from "../../characters/CharacterContext";
import styles from "../../styles/Form.module.css";
import { firestore } from "../../firebase";
import { formattedTime } from "../../helper/formatTime";

const Backdrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Form = ({ closeModal, endTime, resetTime, map }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const leaderboardRef = firestore.collection("leaderboard");

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    await leaderboardRef.add({
      map: map.selectedMap || map.backup,
      name,
      time: endTime,
    });

    closeModal();
    resetTime();
    setName("");
    setSubmitting(false);
    navigate("/leaderboard");
  };

  return (
    <div className={styles.form}>
      <h2>
        Good job!
        <span onClick={closeModal}>X</span>
      </h2>
      <h3>Your time: {formattedTime(endTime)}</h3>
      <form onSubmit={submitHandler}>
        <label htmlFor="name">Enter your name: </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength="20"
          required
        />
        <button type="submit">
          {submitting ? "Submitting..." : "Submit to Leaderboard"}
        </button>
      </form>
    </div>
  );
};

const Modal = () => {
  const { closeModal, isFinished, endTime, resetTime, backup, selectedMap } =
    useContext(CharacterContext);

  return (
    <React.Fragment>
      {isFinished && (
        <div>
          {ReactDOM.createPortal(
            <Form
              closeModal={closeModal}
              endTime={endTime}
              resetTime={resetTime}
              map={{ backup, selectedMap }}
            />,
            document.getElementById("modal")
          )}
          {ReactDOM.createPortal(
            <Backdrop />,
            document.getElementById("backdrop")
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Modal;

Backdrop.propTypes = {
  closeModal: PropTypes.func,
};

Form.propTypes = {
  closeModal: PropTypes.func,
  endTime: PropTypes.number,
  resetTime: PropTypes.func,
  map: PropTypes.object,
};

import React from "react";
import "./MsgOverlay.css";

function MsgOverlay({ closeOverlay, message, handleYes }) {
    return (
        <div className="overlay">
            <div className="popup">
                <p className="message">{message}</p>
                <div className="popup__resp">
                    <button className="popup__button" onClick={handleYes}>
                        YES
                    </button>
                    <button className="popup__button" onClick={closeOverlay}>
                        NO
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MsgOverlay;

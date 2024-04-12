import React from "react";
import "./MobileInput.css";

function MobileInput({ buttons, handleUndo, handleMobileInput, handleMobileDelete }) {
    return (
        <div className="input__main">
            <div className="input__undo">
                <div 
                    className="undo sqr disabled"
                    id="undo"
                    onClick={(e)=>handleUndo(e.target.id)}
                >
                    ↩
                </div>
                <div 
                    className="redo sqr disabled"
                    id="redo"
                    onClick={(e)=>handleUndo(e.target.id)}
                >
                    ↪
                </div>
            </div>
            <div className="before__start input__bg">
                <div className="input__numbers">
                    {buttons.map((value) => {
                        return (
                            <div
                                className="numbers sqr"
                                id={value}
                                key={value}
                                onClick={()=>handleMobileInput(value)}
                                onMouseDown={(e)=>e.preventDefault()}
                            >
                                {value}
                            </div>
                        );
                    })}
                </div>
                <div className="input__tools">
                    <div
                        className="delete sqr"
                        onClick={()=>handleMobileDelete()}
                        onMouseDown={(e)=>e.preventDefault()}
                    >
                    ⌫   
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileInput;

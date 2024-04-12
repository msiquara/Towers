import React from "react";
import "./Grid.css";

function Grid({ grid, tgrid, lgrid, rgrid, bgrid, selectSquare, blurClick }) {
    return (
        <div className="grid__main">
            <div className="top__tips">
                {tgrid.map((item, index) => (
                    <div className="sqr black" key={index}>
                        {item}
                    </div>
                ))}

            </div>
            <div className="second__line">
                <div className="left__tips">
                    {lgrid.map((item, index) => (
                        <div className="sqr black" key={index}>
                            {item}
                        </div>
                    ))}

                </div>
                <div id="grid">
                    {grid.map((item, index) => (
                        <div
                            className="sqr game"
                            id={index}
                            key={index}
                            onClick={() => selectSquare(index)}   
                            onBlur={() => blurClick()}                     
                            tabIndex={-1}      
                        ></div>
                    ))}
                </div>
                <div className="right__tips">
                    {rgrid.map((item, index) => (
                        <div className="sqr black" key={index}>
                            {item}
                        </div>
                    ))}

                </div>                
            </div>
            <div className="bottom__tips">
                {bgrid.map((item, index) => (
                    <div className="sqr black" key={index}>
                        {item}
                    </div>
                ))}

            </div>
        </div>
    );
}

export default Grid;

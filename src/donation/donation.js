import React from 'react'
import ReactDOM from 'react-dom'

// const Test = () => {
//     // return <div>Hello THIS IS REACT COMPONENT</div>
// };

document.addEventListener('DOMContentLoaded', () => {
    // ReactDOM.render(<Test />, document.getElementById('react'))

    //add click event to the one-time tab
    document.getElementById("One-time").addEventListener("click", () => {
        console.log("1");
        document.getElementsByClassName("input-selected")[0].setAttribute("value", "1");
        document.getElementById("One-time").style.backgroundColor ="#ff8000";
        document.getElementById("One-time").style.color ="white";
        document.getElementById("Monthly").style.color ="black";
        document.getElementById("Monthly").style.background ="none";

        }
    )

    //add click event to the one-time tab
    document.getElementById("Monthly").addEventListener("click", () => {
        console.log("2");
        document.getElementsByClassName("input-selected")[0].setAttribute("value", "2");
        document.getElementById("Monthly").style.backgroundColor ="#ff8000";
        document.getElementById("Monthly").style.color ="white";
        document.getElementById("One-time").style.color ="black";
        document.getElementById("One-time").style.background ="none";
        }
    )

})


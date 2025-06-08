alert("Welcome to the Game of Tic Tac Toe");
alert("Chalo khela shuru krte hai");
let boxes = document.querySelectorAll(".box");
let winnermsg = document.querySelector(".winnermsg");
let wmsg = document.querySelector("#wmsg");
let newbtn = document.querySelector("#newbtn");

let resetbtn = document.querySelector("#resetbtn");

let turnO = true;  //player 1(0),player2(X)

const winpattern = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];

boxes.forEach((box) => {
    box.addEventListener("click",() =>
       {
        if(turnO)
          {
            box.innerText="O";
            turnO=false;
          }
         else
         {
            box.innerText="X";
            turnO=true;
         } 
         box.disabled=true;
         checkwinner();
       }
    );
});
 
const checkwinner=()=>
{
    for(let pattern of winpattern)
    {
        let pos1value=boxes[pattern[0]].innerText; 
        let pos2value=boxes[pattern[1]].innerText;
        let pos3value=boxes[pattern[2]].innerText;
        
        if(pos1value!=""&&pos2value!=""&&pos3value!="")
        {
            if(pos1value===pos2value&&pos2value===pos3value)
            {
                showwinner(pos1value);
            }
        }

    }
};

const showwinner=(winner)=>
{
    wmsg.innerText=`Congratulation, Winner is ${winner}`;
    winnermsg.classList.remove("hide");
    disabledBoxes();

};

const disabledBoxes=()=>
{
    for(let box of boxes)
    {
        box.disabled=true;

    }
};

const resetGame=()=>
{
    turnO=true;
    enableBoxes();
    winnermsg.classList.add("hide");
};

const enableBoxes=()=>
{
    for(let box of boxes)
    {
        box.disabled=false;
        box.innerText="";
    }
};

resetbtn.addEventListener("click",resetGame);
newbtn.addEventListener("click",resetGame);
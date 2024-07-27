function btnclick(val)
{
    document.getElementById("screen").value+=val;
}

function clearing()
{
    document.getElementById("screen").value="";
}

function myresult()
{
    let text=document.getElementById("screen").value;
    document.getElementById("screen").value=text +"="+ eval(text);
}

let btn_mode=document.querySelector('#btn');
let mode="light";

btn_mode.addEventListener("click",btnmode());

function btnmode()
{
if (mode==="light")
{
    mode="dark";
    document.querySelector("body").style.backgroundColor="black";
}
else
{
    mode="light";
    document.querySelector("body").style.backgroundColor="white";
}
}
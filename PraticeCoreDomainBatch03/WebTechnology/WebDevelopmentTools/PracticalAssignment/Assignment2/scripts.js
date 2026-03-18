function addTask(){

let input=document.getElementById("taskInput");
let taskText=input.value;

if(taskText===""){
alert("Please enter a task");
return;
}

let li=document.createElement("li");

/* Checkbox */

let checkbox=document.createElement("input");
checkbox.type="checkbox";

checkbox.onclick=function(){

li.classList.toggle("completed");

};

/* Task text */

let span=document.createElement("span");
span.textContent=taskText;

/* Delete button */

let deleteBtn=document.createElement("button");
deleteBtn.textContent="Delete";
deleteBtn.className="delete-btn";

deleteBtn.onclick=function(){

li.remove();

};

li.appendChild(checkbox);
li.appendChild(span);
li.appendChild(deleteBtn);

document.getElementById("taskList").appendChild(li);

input.value="";

}
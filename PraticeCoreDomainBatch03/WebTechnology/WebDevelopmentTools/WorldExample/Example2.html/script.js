function addPost(){

let title=document.getElementById("title").value;
let author=document.getElementById("author").value;
let content=document.getElementById("content").value;

let postDiv=document.createElement("div");

postDiv.className="post";

postDiv.innerHTML=`
<h3>${title}</h3>
<p><b>Author:</b> ${author}</p>
<p>${content}</p>
<p><i>${new Date().toLocaleDateString()}</i></p>
`;

document.getElementById("posts").appendChild(postDiv);

}

function addComment(){

let name=document.getElementById("name").value;
let comment=document.getElementById("comment").value;

let li=document.createElement("li");

li.textContent=name+" : "+comment;

document.getElementById("commentList").appendChild(li);

}
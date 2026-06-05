
window.addEventListener("load",()=>{

setTimeout(()=>{
document.getElementById("preloader").style.display="none";
},2000);

});

const menuBtn=document.querySelector(".menu-btn");
const nav=document.querySelector(".nav-links");

if(menuBtn){
menuBtn.addEventListener("click",()=>{
nav.classList.toggle("active");
});
}

window.addEventListener("scroll",()=>{

document.querySelector(".navbar")
.classList.toggle(
"sticky",
window.scrollY>50
);

});

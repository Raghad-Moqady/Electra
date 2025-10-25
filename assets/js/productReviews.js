const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
 
const productInfo= JSON.parse(localStorage.getItem("productInfo"));
// console.log(productInfo.reviews); //array
 

// add productName
document.querySelector(".productName").textContent=productInfo.title;
// show reviews
const htmlResult= productInfo.reviews.map((review)=>{
    return`
       <p class="m-0">${review.rating} ⭐ <strong>${review.comment}</strong></p>
          <p class="m-0 text-black-50">${review.date}</p>
          <strong class="m-0">${review.reviewerName}</strong>
          <p class="m-0 text-black-50">${review.reviewerEmail}</p>
          <hr />
    `
}).join(' ');
document.querySelector(".reviews_info").innerHTML=htmlResult;

   
// nav btns
document.querySelector(".detailsBtn").addEventListener("click",(e)=>{
e.target.classList.add("active");
document.querySelector(".reviewsBtn").classList.remove("active");
e.target.setAttribute("href",`./productDetails.html?id=${productId}`);
});

document.querySelector(".reviewsBtn").addEventListener("click",(e)=>{
e.target.classList.add("active");
document.querySelector(".detailsBtn").classList.remove("active");
 });

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const loader = document.querySelector(".loader");



const getProductData=async()=>{
    const response= await axios.get(`https://dummyjson.com/products/${productId}`);
    return response;
}

const showProductDetails= async()=>{
    try{
        loader.classList.add("show_loader");
        const response= await getProductData();
        const productInfo= response.data;
        console.log(productInfo);

        // الشق الايسر
        document.querySelector(".productName").textContent= productInfo.title;
        document.querySelector(".main_img").setAttribute("src", productInfo.thumbnail);
        
        // sub Imgs
        const subImgsSRC= productInfo.images;
        const resultHTML = subImgsSRC.map((src)=>{
                return `
                 <li class="nav-item me-3">
                  <div class=" border " style="width: 90px; height: 90px;">
                  <img
                  src="${src}"
                    alt="product_Img"
                    class="w-100 object-fit-contain sub_img"
                  />
                </div>
                </li>
                `
        }).join(" ");
        document.querySelector(".sub_imgs").innerHTML=resultHTML;
 
        // change photos() handel 
        handelingChangeImags();

        // الشق الايمن 
        const prices= document.querySelector(".prices");

        const discountedPrice = productInfo.price - (productInfo.price * (productInfo.discountPercentage / 100));
        
        prices.innerHTML=`
                <div >
                   <div class="text-success fw-bold fs-4 priceAfterDiscount">
                  $ ${discountedPrice.toFixed(2)}
                      <span
                        class="text-danger text-decoration-line-through fs-6 realPrice"
                      >
                        $ ${productInfo.price}</span
                      >
                    </div>
                </div>
                <div class="ms-3">
                    <p class="bg-danger-subtle px-3 py-1 m-0">-${productInfo.discountPercentage} %</p>
                </div>
        `
        document.querySelector(".rate").textContent=`⭐ ${productInfo.rating}`;
        document.querySelector(".reviews_num").textContent=`${(productInfo.reviews).length} reviews`;
        document.querySelector(".description").textContent=productInfo.description;
        document.querySelector(".dimensions").innerHTML=`
             <p class="m-0 p-0">width: <strong>${productInfo.dimensions.width}</strong></p>
              <p class="m-0 p-0">height: <strong>${productInfo.dimensions.height}</strong></p>
              <p class="m-0 p-0">depth: <strong>${productInfo.dimensions.depth}</strong></p>
        `;
        document.querySelector(".general_info").innerHTML=`
         <p class="m-0"><strong>${productInfo.stock}</strong> items left in stock!</p>
                <hr />
                <p class="m-0">
                  Warranty Information: <strong>${productInfo.warrantyInformation}</strong>
                </p>
                <p class="m-0">
                  Shipping Information:
                  <strong>${productInfo.shippingInformation}</strong>
                </p>
                <p class="m-0">Minimum Order Quantity: <strong> ${productInfo.minimumOrderQuantity}</strong></p>
        `;

        document.querySelector(".QrCode").setAttribute("src",productInfo.meta.qrCode);

        // local storage and get this item in productReviews page without call api again
        localStorage.setItem("productInfo",JSON.stringify(productInfo));
        loader.classList.remove("show_loader");

    }catch{
Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Something went wrong!",
 });
    } 
}
  

showProductDetails();

const changeImg=(main_img, sub_img)=>{
   const sub_img_src= sub_img.getAttribute("src");
   main_img.setAttribute("src",sub_img_src);
}

const handelingChangeImags = ()=>{
  const main_img= document.querySelector(".main_img");
  const sub_imgs= Array.from(document.querySelectorAll(".sub_img"));

  sub_imgs.forEach((sub_img)=>{
    sub_img.addEventListener("click",()=>changeImg(main_img, sub_img));
  })

}

// nav btns
document.querySelector(".detailsBtn").addEventListener("click",(e)=>{
e.target.classList.add("active");
document.querySelector(".reviewsBtn").classList.remove("active");
});

document.querySelector(".reviewsBtn").addEventListener("click",(e)=>{
e.target.classList.add("active");
document.querySelector(".detailsBtn").classList.remove("active");
e.target.setAttribute("href",`./productReviews.html?id=${productId}`);
});
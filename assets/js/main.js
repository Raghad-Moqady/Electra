//  header Swiper
 const swiper = new Swiper('.header_swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  autoplay:{
    delay:3000,
  },
  effect:"fade",
  speed:1500
});

// categories Swiper
 const swiper2 = new Swiper('.categories_swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
 
  autoplay:{
    delay:2000,
  },

  slidesPerView:3.5,
  spaceBetween:10,
  speed: 1500,
  freeMode: true,
 freeModeMomentum: true,
});

const loader= document.querySelector(".loader");
const categories_slides=document.querySelector(".categories_slides");

const getCategories = async()=>{
  const response= await axios.get("https://dummyjson.com/products/category-list");
  return response;
}
const showCategories=async()=>{
    try{
    loader.classList.add("show_loader");
    const categories = await getCategories();
    console.log(categories);
    const result = categories.data.map((categoryName)=>{
       return `
       <div class="swiper-slide">
         <div class="card rounded-0 p-4 text-center">
          <a class="btn category_btn" href="./products.html?categoryName=${categoryName}">${categoryName}</a>
         </div>
        </div>
       `
    }).join(" ");
     categories_slides.innerHTML=result;
      loader.classList.remove("show_loader");
    }catch{
Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Something went wrong!",
 });
    } 
}

const productLoader= document.querySelector(".productLoader");

const getTenProduct=async()=>{
    const response = await axios.get("https://dummyjson.com/products?limit=10");
    return response;
}

const showProducts=async()=>{
  try{
    productLoader.classList.add("show_loader");
    const tenProducts= await getTenProduct();
    console.log(tenProducts.data.products);

    const htmlResult= tenProducts.data.products.map((product)=>{
      return `
       <div class="col-md-3 mb-5 text-center" >
              <div class="card h-100" data-aos="zoom-in" data-aos-duration="1300">
                <!-- Product image-->
                <div style="width: 100%; height: 200px;">
                  <img
                    src="${product.thumbnail}"
                    alt="product_Img"
                    class="w-100 h-100 object-fit-contain"
                  />
                </div>

                <!-- Product details-->
                <div class="card-body  p-4">
                  <div class=" ">
                    <h5 class="fw-bolder">${product.title}</h5>
                    <p>${product.rating}⭐</p>
                    <!-- swiper -->
                    <div class="swiper productContent_swiper">
                      <!-- Additional required wrapper -->
                      <div class="swiper-wrapper">
                        <!-- Slides -->
                        <div class="swiper-slide">$ ${product.price}</div>
                        <div class="swiper-slide text-danger">
                          ${product.discountPercentage} % OFF
                        </div>
                      <div class="swiper-slide">
                      <p><strong>${product.stock}</strong> items left in stock!</p>
                      </div>

                      </div>
                    </div>
                  </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div>
                    <a
                      class="btn btn-secondary rounded-5 w-75"
                      href="./productDetails.html?id=${product.id}"
                       >More Details</a
                    >
                  </div>
                </div>
              </div>
            </div>
      `
    }).join(' ');
    document.querySelector(".productCards").innerHTML= htmlResult;
    callSwiper();
    productLoader.classList.remove("show_loader");

  }catch{
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Something went wrong!",
 });
  }
}

showCategories();
showProducts();

const callSwiper = () => {
  // product swiper
     const swiper = new Swiper(".productContent_swiper", {
      loop: true,

      autoplay: {
        delay: 2000,
      },
      effect: "fade",
      speed: 1500,
    });
 
};

const params = new URLSearchParams(window.location.search);
const categoryName = params.get("categoryName");
// categoryName => has 2 cases :
// 1. category name is exist=> when we arrive to this products page from category Name to show all products that follow to this category

// 2. Null => when we arrive to this page to show all products
// console.log(categoryName);

const loader = document.querySelector(".loader");
const title = document.querySelector(".title");

// Pagination
const limit = 4;

const getAllProducts = async (page,search_word,sortBy,order) => {
  // 2 cases : sortby and order => موجودة 
  //         : sortby and order='' => ما بتم ارسالهم للرابط وهي فارغة 
 let response;
 const skip = (page-1) * limit;
 if(sortBy=='' && order==''){
 response = await axios.get(`https://dummyjson.com/products/search?q=${search_word}&limit=${limit}&skip=${skip}`);
 }else{
  response = await axios.get(`https://dummyjson.com/products/search?q=${search_word}&limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`);
 }
return response;
};
const getProductsOfCategory = async (page) => {
   const skip = (page-1) * limit;
  const response = await axios.get(
    `https://dummyjson.com/products/category/${categoryName}?limit=${limit}&skip=${skip}`);
  return response;
};

// start from hear
const showProducts = async (page=1, search_word='',sortBy='',order='') => {
  try {
    let products;
    loader.classList.add("show_loader");
     document.querySelector(".alert").setAttribute("hidden" ,true);
     document.querySelector(".pagination").removeAttribute("hidden");
    //  if(search_word=='' && sortBy=='' && order=='' ){
    //   document.forms["search_sort_form"].searchWord.value=" ";
    //   document.forms["search_sort_form"].setAttribute("placeholder","Search...");
    //  } 

    if (categoryName == null) {
      //   get all products
      title.textContent = "All Products";
      products = await getAllProducts(page,search_word,sortBy,order);
      // search_sort : exist
      document.querySelector(".search_sort_box").removeAttribute("hidden");
    } else {
      // get productsOfCategories
      title.innerHTML = `Products of Category <span class="fw-bold">${categoryName}</span>`;
      products = await getProductsOfCategory(page);
      // search_sort :not exist
      document.querySelector(".search_sort_box").setAttribute("hidden",true);
    }
    console.log(products);
    const arrayOfProducts = products.data.products;
    const htmlResult = arrayOfProducts
      .map((product) => {
        return `
             <div class="col-md-3 mb-5 text-center">
              <div class="card h-100" data-aos="zoom-in" data-aos-duration="1300">
                <!-- Product image-->
                <div style="width: 100%; height: 200px; overflow: hidden">
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
            `;
      })
      .join(" ");
    document.querySelector(".productCards").innerHTML = htmlResult;
    callSwiper();

    // pagination start
    const totalCount=products.data.total;
    if(totalCount==0){
     document.querySelector(".alert").removeAttribute("hidden");
     document.querySelector(".pagination").setAttribute("hidden",true);
    }
    //  numOfPages= totalCount/ limit (frontend choose it and send it to backend )
    const numOfPages= Math.ceil(totalCount/limit);
    // page=i
    handle_pagination(numOfPages , page, search_word,sortBy,order);

    loader.classList.remove("show_loader");
  } catch {
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Something went wrong!",
 });
  } 
};
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

const handle_pagination=(numOfPages, page, search_word, sortBy,order)=>{
  let pagination_result= '';

  // Previous => page
  // 1.onclick 2.if(page==1)
if(page==1){
pagination_result+=`
  <li class="page-item ">
      <button class="page-link bg-dark-subtle" disabled onclick="showProducts(${page-1},'${search_word}','${sortBy}','${order}')" > < </button>
   </li>
  `;
  }else{
    pagination_result+=`
  <li class="page-item">
      <button class="page-link"  onclick="showProducts(${page-1},'${search_word}','${sortBy}','${order}')" > < </button>
   </li>
  `;
  }
  

  // pages  => i
  //1. onclick 2.add active 3.if(i==1|| i==numOfPages ||i==page ||i==page+1 || i==page-1)
  for(let i=1; i<=numOfPages; i++){
   if(i==1|| i==numOfPages ||i==page ||i==page+1 || i==page-1){
 pagination_result+=`
     <li class="page-item"><button class="page-link ${i==page?"active bg-secondary":""}" onclick="showProducts(${i},'${search_word}','${sortBy}','${order}')">${i}</button></li> 
     `; 
   }

  }

   //next => page
  //  1.onclick 2.if(page==numOfPages)
  if(page==numOfPages){
pagination_result+=`
  <li class="page-item">
  <button class="page-link bg-dark-subtle" disabled onclick="showProducts(${parseInt(page)+1},'${search_word}','${sortBy}','${order}')">> </button>
  </li>
  `;
  }else{
  pagination_result+=`
  <li class="page-item"><button class="page-link" onclick="showProducts(${parseInt(page)+1},'${search_word}','${sortBy}','${order}')">> </button></li>
  `;
  }
   
    document.querySelector(".pagination").innerHTML= pagination_result;
}
// search : send request to backend
const search_sort_form= document.forms["search_sort_form"];
// console.log(search_form.searchWord); input
// console.log(search_sort_form.sortIndex.value);
search_sort_form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const search_word=search_sort_form.searchWord.value;
    const sort_choice=search_sort_form.sortIndex.value;
    let sortBy;
    let order;
    if(sort_choice=="Sort by"){
      sortBy='';
      order='';
    }else if(sort_choice=="title_asc"){
      sortBy='title';
      order='asc';
    }else if(sort_choice=="title_desc"){
      sortBy='title';
      order='desc';
    }else if(sort_choice=="price_asc"){
       sortBy='price';
      order='asc';
    }else if(sort_choice=="price_desc"){
      sortBy='price';
      order='desc';
    }
     
    showProducts(1,search_word,sortBy,order);
 });


//  عند تحميل هذه الصفحة او الرجوع لهذه الصفحة بعد الفلترة => تصبح قيم البحث فارغة 
//:مثلا عند الفلترة وعرض تفاصيل منتج معين ثم العودة لهذه الصفحة =>تصبح قيم البحث فارغة والمنتجات تكون ايضا تلقائيا غير مفلترة وذلك بسبب استدعاء 
// showProducts(); قتكون القيم اولية ولا يوجد اي فلترة 
window.addEventListener("pageshow", function () {
  search_sort_form.searchWord.value = "";
  search_sort_form.sortIndex.selectedIndex = 0;
});

 
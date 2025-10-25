const loader = document.querySelector(".loader");
const limit=3;


const getProducts = async (page) => {
  const skip = (page-1) * limit;
  const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  return response;
};

const showProducts = async (page=1) => {
  try {
    loader.classList.add("show_loader");
    const response = await getProducts(page);

    const htmlResult = response.data.products
      .map((product) => {
        return `
               <tr>
                <th scope="row">${product.id}</th>
                <td>${product.title}</td>
                 <td>${product.price}</td>
                <td class="d-flex justify-content-center">
                 <div class="w-25" >
                    <img src="${product.thumbnail}" alt="product_name" class="w-100">
                </div>
                </td>
                <td>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id},event)">Delete</button>
                </td>
              </tr>
        `;
      })
      .join(" ");
    document.querySelector(".products_rows").innerHTML = htmlResult;



    // Pagination
    //  numOfPages= totalCount/ limit (frontend choose it and send it to backend )
     const totalCount=response.data.total;
    const numOfPages= Math.ceil(totalCount/limit);
    handle_pagination(numOfPages, page);


 
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

const deleteProduct = async (id , event) => {
  try {
    loader.classList.add("show_loader");
    const response = await axios.delete(`https://dummyjson.com/products/${id}`);
    if (response.status == 200) {
      Swal.fire({
        title: "Deleted Successfully!",
        icon: "success",
        draggable: true,
      });
       event.target.closest("tr").remove();
    }
    loader.classList.remove("show_loader");
  } catch {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
};

const handle_pagination=(numOfPages, page)=>{
  let pagination_result= '';

  // Previous => page
  // 1.onclick 2.if(page==1)
if(page==1){
pagination_result+=`
  <li class="page-item ">
      <button class="page-link bg-dark-subtle" disabled onclick="showProducts(${page-1})" > < </button>
   </li>
  `;
  }else{
    pagination_result+=`
  <li class="page-item">
      <button class="page-link"  onclick="showProducts(${page-1})" > < </button>
   </li>
  `;
  }
  

  // pages  => i
  //1. onclick 2.add active 3.if(i==1|| i==numOfPages ||i==page ||i==page+1 || i==page-1)
  for(let i=1; i<=numOfPages; i++){
   if(i==1|| i==numOfPages ||i==page ||i==page+1 || i==page-1){
 pagination_result+=`
     <li class="page-item"><button class="page-link ${i==page?"active bg-secondary":""}" onclick="showProducts(${i})">${i}</button></li> 
     `; 
   }

  }

   //next => page
  //  1.onclick 2.if(page==numOfPages)
  if(page==numOfPages){
pagination_result+=`
  <li class="page-item">
  <button class="page-link bg-dark-subtle" disabled onclick="showProducts(${parseInt(page)+1})">> </button>
  </li>
  `;
  }else{
  pagination_result+=`
  <li class="page-item"><button class="page-link" onclick="showProducts(${parseInt(page)+1})">> </button></li>
  `;
  }
   
    document.querySelector(".pagination").innerHTML= pagination_result;
}

const createProductForm= document.forms["createProductForm"];
const inputs = Array.from(document.querySelectorAll(".target_input"));
const loader= document.querySelector(".loader");
const add_btn= document.querySelector(".add_btn");

// validation

const nameErrorMsg=document.querySelector(".nameErrorMsg");
const priceErrorMsg= document.querySelector(".priceErrorMsg");

const validateName=()=>{
  const regex = /^[A-Za-z0-9_]{3,20}$/;
  if (!regex.test(createProductForm.title.value)) {
    createProductForm.title.classList.remove("is-valid");
    createProductForm.title.classList.add("is-invalid");
    nameErrorMsg.textContent =
      "Product name must be 3–20 characters long and can include letters, numbers, and underscores only.";
    return false;
  } else {
    createProductForm.title.classList.remove("is-invalid");
    createProductForm.title.classList.add("is-valid");
    nameErrorMsg.textContent = "";
    return true;
  }
}
const validatePrice=()=>{
 const regex = /^(?!0\d)\d+(\.\d{1,2})?$/;

  const priceValue = createProductForm.price.value.trim();

  if (!regex.test(priceValue) || parseFloat(priceValue) <= 0) {
    createProductForm.price.classList.remove("is-valid");
    createProductForm.price.classList.add("is-invalid");
    priceErrorMsg.textContent =
      "Please enter a valid price greater than 0 (up to two decimal places).";
    return false;
  } else {
    createProductForm.price.classList.remove("is-invalid");
    createProductForm.price.classList.add("is-valid");
    priceErrorMsg.textContent = "";
    return true;
  }
}

createProductForm.title.addEventListener("input",validateName);
createProductForm.price.addEventListener("input",validatePrice);


//file reader && show selected image before submit
const preview_box= document.querySelector(".preview_box");
const preview= document.querySelector(".preview");

createProductForm.image.addEventListener("change", () => {
 
  const file = createProductForm.image.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener("load", (e) => {
    preview_box.classList.remove("d-none");
    // console.log( e.target);
    preview.setAttribute("src", e.target.result);
  });
});

//on submit
createProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // 1.
  let isValid = true;
  if (!validateName()) {
    isValid = false;
  }
  if (!validatePrice()) {
    isValid = false;
  }
 
  if (!isValid) {
    add_btn.setAttribute("disabled", true);
    // إضافة أحداث input لإعادة تفعيل الزر عند تصحيح الأخطاء
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (
          validateName() &&
          validatePrice() 
        ) {
          add_btn.removeAttribute("disabled");
        }
      });
    });
    return;
  }
  // 2.
  try{
  loader.classList.add("show_loader");
  add_btn.classList.add("disabled");
  const product={
    title: createProductForm.title.value,
    price: createProductForm.price.value
  } 
  const response = await axios.post("https://dummyjson.com/products/add",product);
  console.log(response);
  if (response.status == 201) {
    Swal.fire({
  title: "Added Successfully",
  icon: "success",
  draggable: true
     }); 
   createProductForm.reset();  
   createProductForm.price.classList.remove("is-valid");
   createProductForm.price.classList.remove("is-invalid");
    createProductForm.title.classList.remove("is-valid");
   createProductForm.title.classList.remove("is-invalid");
   preview_box.classList.add("d-none");
  }
  }catch{
Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Something went wrong!",
});
  }finally{
  loader.classList.remove("show_loader");
  add_btn.classList.remove("disabled");
  }
});
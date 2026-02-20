   const btncart = document.getElementById("btncart")
 
function handleOutofStock()
{
    const imgproduct = document.getElementById("imgproduct")
    btncart.disabled = true;
    btncart.innerText = "out of stock"
    btncart.classList.add("out-of-stock-btn")
    imgproduct.classList.add("out-of-stock-image")
}
btncart.addEventListener("click",handleOutofStock)
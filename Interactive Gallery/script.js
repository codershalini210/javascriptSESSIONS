// main-image" src="./images/p1.jfif"/>
//     <div id="thumbnail-container">
const thumbnail_container = document.getElementById("thumbnail-container")
const main_image = document.getElementById("main-image")
function updateMainImage(event)
{
    console.log(event.target.tagName)
   if(event.target.tagName==="IMG")
   {
            main_image.src = event.target.src
   }
}
thumbnail_container.addEventListener("click",updateMainImage)
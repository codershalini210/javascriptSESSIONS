/* fav-item">
        
        <p class="faq-answer hidden */
let questions = document.querySelectorAll(".faq-question")
console.log(questions)
questions.forEach( function(question){
        question.addEventListener("click",function(){
            const answerElement = this.nextElementSibling;
            answerElement.classList.toggle("hidden")

        })
})
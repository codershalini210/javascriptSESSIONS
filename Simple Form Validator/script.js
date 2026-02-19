
    let emailForm = document.getElementById("email-form")
    let txtEmail = document.getElementById("email-input")
    let pmsg = document.getElementById("error-message")
    emailForm.addEventListener("submit",function(event){

        event.preventDefault()
        pmsg.classList.remove("error","success")
        if(txtEmail.value == "")
        {
            pmsg.innerText = "please fill email"
            pmsg.classList.add("error")
            return
        }
        pmsg.innerText = "Form Submitted Successfully"
        pmsg.classList.add("success")
    })
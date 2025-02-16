let prompt = document.querySelector("#prompt");
let summitbtn = document.querySelector("#summit");
let chatContainer = document.querySelector(".chat-container")
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input")
const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBNWPq-xBbRhQNh2A_ewS3WY9gw7EdT-fU"

let user={
    message:null,
    file:{
          mime_type:null,
          data: null
    }
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area")
    let RequestOption = {
        method:"Post",
        headers : {'Content-Type': 'application/json'},
        body:JSON.stringify(
            {
                "contents": [{
                  "parts":[{"text": user.message},(user.file.data?[{"inline_data":user.file}]:[])]
                  }] 
                 }
        )
    }
   try{
    let response = await fetch(Api_Url,RequestOption)
    let data = await response.json()
   let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
    text.innerHTML = apiResponse
   }
   catch(error){
    console.log(error);
   }
   finally{
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
    image.src =`imageimg.jpeg`
    image.classList.remove("choose")
    user.file = {}
   }



}

function createCheatBox(html,classes){
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes)
    return div
}
function handleCharResponse(message){
    user.message = message
    let html = ` 
     <img src="https://cdn.pixabay.com/photo/2014/04/03/11/56/avatar-312603_640.png" alt="" id="userimage" width="5%">
     <div class="user-chat-area">
     ${user.message}
     ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>`:""}
     </div>`
     prompt.value=""
     let userChatBox = createCheatBox(html,"user-chat-box");
     chatContainer.appendChild(userChatBox);
     chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

     setTimeout(()=>{
        let html = `<img src="https://www.cio.com/wp-content/uploads/2023/08/chatbot_ai_machine-learning_emerging-tech-100778305-orig.jpg?quality=50&strip=all&w=1024" alt="" id="ai-image" width = "8%">
     <div class="ai-chat-area">
     <img src="lg.gif" alt="" class="load" width="50px">
     </div>`
     let aiChatBox = createCheatBox(html,"ai-chat-box");
     chatContainer.appendChild(aiChatBox);
     generateResponse(aiChatBox)

     },600)

}

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { // Use strict equality
     handleCharResponse(prompt.value);
    }
})
summitbtn.addEventListener("click",()=>{
    handleCharResponse(prompt.value);
})
imageinput.addEventListener("change",()=>{
    const file =imageinput.files[0]
    if(!file) return
    let reader =new FileReader()
    reader.onload = (e) =>{
    let based64string = e.target.result.split(",")[1]
    user.file={
        mime_type:file.type,
        data: based64string
        
  }
    image.src =` data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add("choose")
    }
  
    reader.readAsDataURL(file)
})


imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click();
})
let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input");
let submitBtn = document.querySelector("#submit");

const Api_Url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyC7XlZmt3vydEoU4T7TqjZSGl2CuBi6Y2M";

let user = {
  message: null,
  file: {
    mime_type: null,
    data: null,
  },
};

function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

async function generateResponse(aiChatBox) {
  let text = aiChatBox.querySelector(".ai-chat-area");

  let parts = [{ text: user.message }];

  if (user.file && user.file.data) {
    parts.push({
      inline_data: {
        mime_type: user.file.mime_type,
        data: user.file.data,
      },
    });
  }

  let RequestOption = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
    }),
  };

  try {
    let response = await fetch(Api_Url, RequestOption);
    let data = await response.json();

    let apiResponse =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "No response";

    text.innerHTML = apiResponse;
  } catch (error) {
    console.error(error);
    text.innerHTML = "❌ Error occurred";
  } finally {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
    image.src = "img.svg";
    image.classList.remove("choose");
    user.file = {};
  }
}

function handlechatResponse(message) {
  user.message = message;

  let html = `
    <img src="userimage.png" id="userImage">
    <div class="user-chat-area">
      ${user.message}
      ${
        user.file.data
          ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />`
          : ""
      }
    </div>
  `;

  prompt.value = "";

  let userChatBox = createChatBox(html, "user-chat-box");
  chatContainer.appendChild(userChatBox);

  setTimeout(() => {
    let html = `
      <img src="aiimage.png" id="aiImage">
      <div class="ai-chat-area">
        <img src="loading2-unscreen.gif" class="load" width="80">
      </div>
    `;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 600);
}

/* EVENTS */
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && prompt.value.trim() !== "") {
    handlechatResponse(prompt.value);
  }
});

submitBtn.addEventListener("click", () => {
  if (prompt.value.trim() !== "") {
    handlechatResponse(prompt.value);
  }
});

imagebtn.addEventListener("click", () => {
  imageinput.click();
});

imageinput.addEventListener("change", () => {
  const file = imageinput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result.split(",")[1];
    user.file = { mime_type: file.type, data: base64 };
    image.src = `data:${file.type};base64,${base64}`;
    image.classList.add("choose");
  };
  reader.readAsDataURL(file);
});

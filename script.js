let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input");
let submitBtn = document.querySelector("#submit");

/* 🔐 OpenRouter API KEY */
const API_KEY =
  "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";

/* 🌐 OpenRouter Endpoint */
const Api_Url = "https://openrouter.ai/api/v1/chat/completions";

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

  let messages = [
    {
      role: "user",
      content: user.message,
    },
  ];

  let RequestOption = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "HTTP-Referer": window.location.href, // required by OpenRouter
      "X-Title": "AI Chat App",
    },
    body: JSON.stringify({
      model: "model: "openai/gpt-4o-mini"", // you can change model later
      messages: messages,
    }),
  };

  try {
    let response = await fetch(Api_Url, RequestOption);
    let data = await response.json();

    let apiResponse =
      data.choices[0].message.content
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

    text.innerHTML = apiResponse;
  } catch (error) {
    console.error(error);
    text.innerHTML = "❌ Error generating response";
  } finally {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
    image.src = `img.svg`;
    image.classList.remove("choose");
    user.file = {};
  }
}

function handlechatResponse(message) {
  user.message = message;

  let html = `
    <img src="userimage.png" alt="" id="userImage" width="9%">
    <div class="user-chat-area">
      ${user.message}
    </div>
  `;

  prompt.value = "";

  let userChatBox = createChatBox(html, "user-chat-box");
  chatContainer.appendChild(userChatBox);

  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });

  setTimeout(() => {
    let html = `
      <img src="aiimage.png" alt="" id="aiImage" width="9%">
      <div class="ai-chat-area">
        <img src="loading2-unscreen.gif" alt="" class="load" width="100px">
      </div>
    `;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 600);
}

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
  imagebtn.querySelector("input").click();
});

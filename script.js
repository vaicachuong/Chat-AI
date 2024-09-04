const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const API_KEY = "sk-bd4m6wJgHRDBwkJEd9XFdMTp6w5-Y3eraY0tBPA5U0T3BlbkFJq2A1RTg6YFOw5Rztw_YjB2bzkcmW12RLrVsGCc_38A";

let isWaiting = false; // Biến này để kiểm soát thời gian chờ

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" 
        ? `<p>${message}</p>` 
        : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

const generateResponse = (userMessage) => {
    const API_URL = "https://api.openai.com/v1/chat/completions"; 
    const requestOptions = { 
        method: "POST", 
        headers: {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", 
            messages: [{ role: "user", content: userMessage }]
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.choices && data.choices.length > 0) {
                const botMessage = data.choices[0].message.content;
                chatbox.appendChild(createChatLi(botMessage, "incoming"));
            } else {
                chatbox.appendChild(createChatLi("No response from API.", "incoming"));
            }
        })
        .catch((error) => {
            console.error("Error:", error); 
            chatbox.appendChild(createChatLi(`Error: ${error.message}`, "incoming"));
        });
};

const handleChat = () => {
    if (isWaiting) return; // Nếu đang trong thời gian chờ, không gửi yêu cầu mới

    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatInput.value = ""; // Xóa nội dung ô nhập tin nhắn

    setTimeout(() => {
        chatbox.appendChild(createChatLi("Thinking...", "incoming"));
        generateResponse(userMessage);
    }, 600); 

    // Kích hoạt chế độ chờ và đặt thời gian chờ
    isWaiting = true;
    setTimeout(() => {
        isWaiting = false; // Sau khoảng thời gian chờ, cho phép gửi yêu cầu mới
    }, 10000); // Chờ 10 giây trước khi có thể gửi yêu cầu tiếp theo
};

sendChatBtn.addEventListener("click", handleChat);

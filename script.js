// החלף במפתח החדש שלך!
const API_KEY = "AIzaSyDn7WzWDdvuhcuzHgSG3g_DF35N0ovDWHI";

// נסה את האופציות האלו לפי הסדר:
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// אם לא עובד, נסה:
// const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

// המתן שהדף יטען לגמרי
document.addEventListener('DOMContentLoaded', () => {
    const outputDiv = document.getElementById('chat-output');
    const inputField = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    console.log("✅ הסקריפט נטען!");
    console.log("outputDiv:", outputDiv);
    console.log("inputField:", inputField);
    console.log("sendBtn:", sendBtn);

    let conversationHistory = [];

    async function askGemini(prompt) {
        try {
            conversationHistory.push({
                role: "user",
                parts: [{ text: prompt }]
            });

            const requestBody = {
                contents: conversationHistory
            };

            console.log("📤 שולח בקשה:", requestBody);

            const response = await fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("שגיאה:", data);
                let errorMsg = "שגיאה: ";
                if (data.error?.code === 403) {
                    errorMsg += "המפתח לא תקין. צור מפתח חדש!";
                } else if (data.error?.code === 404) {
                    errorMsg += "המודל לא נמצא.";
                } else {
                    errorMsg += data.error?.message || "שגיאה לא ידועה";
                }
                return errorMsg;
            }
            
            if (data.candidates && data.candidates.length > 0) {
                const assistantText = data.candidates[0].content.parts[0].text;
                conversationHistory.push({
                    role: "model",
                    parts: [{ text: assistantText }]
                });
                return assistantText;
            } else {
                return "לא התקבלה תשובה מהמודל.";
            }

        } catch (error) {
            console.error("שגיאת רשת:", error);
            return "שגיאה בחיבור לאינטרנט.";
        }
    }

    async function sendMessage() {
        const question = inputField.value.trim();
        
        console.log("📝 sendMessage called! שאלה:", question);
        
        if (!question) {
            console.log("⚠️ השדה ריק!");
            return;
        }

        // הצגת השאלה
        outputDiv.innerHTML += `<div style="color: blue; margin: 8px 0; text-align: right;"><strong>אתה:</strong> ${question}</div>`;
        inputField.value = '';
        
        // סימן טעינה
        const loadingId = "loading-" + Date.now();
        outputDiv.innerHTML += `<div id="${loadingId}" style="color: gray; text-align: right;"><em>⏳ חושב...</em></div>`;
        outputDiv.scrollTop = outputDiv.scrollHeight;

        // קבלת תשובה
        const answer = await askGemini(question);
        
        // הסרת הטעינה
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        
        // הצגת התשובה
        outputDiv.innerHTML += `<div style="color: black; margin: 8px 0; text-align: right; white-space: pre-wrap;"><strong>🤖 סוכן:</strong> ${answer}</div>`;
        outputDiv.innerHTML += `<hr style="margin: 10px 0;">`; 
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    // כפתור שליחה
    sendBtn.addEventListener('click', (e) => {
        console.log("🖱️ כפתור נלחץ!");
        e.preventDefault();
        sendMessage();
    });

    // Enter
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log("⌨️ Enter נלחץ!");
            e.preventDefault();
            sendMessage();
        }
    });

    console.log("✅ Event listeners נוספו!");
});
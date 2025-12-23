import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 1. הגדרות וחיבור ל-API
const API_KEY = ""; 
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "אתה סוכן למידה מומחה להיסטוריה הלניסטית באתר של אליאב. ענה בעברית, היה סבלני ומקצועי.",
});

// 2. בחירת האלמנטים מה-HTML (ודא שה-IDs האלו קיימים ב-HTML שלך)
const outputDiv = document.getElementById('chat-output');
const inputField = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 3. פונקציה לשליחת שאלה ל-Gemini
async function askLearningAgent(prompt) {
    try {
        const chat = model.startChat({ history: [] });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("שגיאה בחיבור ל-Gemini:", error);
        return "מצטער, חלה שגיאה בחיבור לסוכן.";
    }
}

// 4. האזנה ללחיצה על הכפתור
sendBtn.addEventListener('click', async () => {
    const question = inputField.value;
    if (!question) return;

    // הצגת השאלה של המשתמש
    outputDiv.innerHTML += `<div><strong>אתה:</strong> ${question}</div>`;
    inputField.value = ''; // ניקוי השדה
    
    // הודעת טעינה
    const loadingId = "loading-" + Date.now();
    outputDiv.innerHTML += `<div id="${loadingId}"><em>הסוכן חושב...</em></div>`;
    outputDiv.scrollTop = outputDiv.scrollHeight;

    // קבלת תשובה מה-AI
    const answer = await askLearningAgent(question);
    
    // הסרת הודעת הטעינה והצגת התשובה
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();
    
    outputDiv.innerHTML += `<div><strong>סוכן:</strong> ${answer}</div>`;
    outputDiv.scrollTop = outputDiv.scrollHeight;
});
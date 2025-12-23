window.addEventListener("load", () => {
    if (typeof EmbedGPT === "undefined") {
        console.error("EmbedGPT לא נטען");
        return;
    }

    EmbedGPT.init({
        apiKey: "gpt.com",
        title: "עוזר היסטוריה",
        placeholder: "שאל אותי על ההלניזם...",
        openOnStart: false
    });
});
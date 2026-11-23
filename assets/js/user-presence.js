(() => {
    const sendPresence = () => {
        if (document.visibilityState === "hidden") return;
        fetch("controller/presence_ping.php", {
            method: "POST",
            credentials: "same-origin",
            headers: { "X-Requested-With": "XMLHttpRequest" }
        }).catch(() => {});
    };

    document.addEventListener("DOMContentLoaded", () => {
        sendPresence();
        window.setInterval(sendPresence, 30000);
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") sendPresence();
        });
    });
})();

// Load cookie consent banner
window.addEventListener("load", function () {
    window.cookieconsent.initialise({
        palette: {
            popup: { background: "#000" },
            button: { background: "#f1d600" }
        },
        type: "opt-in",
        content: {
            message: "We use cookies to analyze traffic.",
            dismiss: "Accept",
            deny: "Decline",
            link: "Learn more",
            href: "/privacy"
        },
        onInitialise: function (status) {
            if (status === cookieconsent.status.allow) {
                loadGA();
            }
        },
        onStatusChange: function (status) {
            if (status === cookieconsent.status.allow) {
                loadGA();
            }
        }
    });
});

// Function to load Google Analytics only after consent
function loadGA() {
    let script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-M7QRHM3GBF";
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", "G-M7QRHM3GBF");
}

const inputEl = document.querySelector("#input");
const resultEl = document.querySelector("#output");
const startGenerationButtonEl = document.querySelector("#generate");
const stopGenerationButtonEl = document.querySelector("#cancel");

let controller = new AbortController();
let inProgress = false;

startGenerationButtonEl.addEventListener("click", async () => {
    //abort any in-progres requests
    if (inProgress) {
        controller.abort();
        controller = new AbortController();
    }

    inProgress = true;

    const response = await fetch("/server", {
        signal: controller.signal,
    });

    let total = "";
    const decoder = new TextDecoder();
    //need to assert response.body is non-null?
    for await (const chunk of response.body) {
        const decodedValue = decoder.decode(chunk);

        switch (decodedValue) {
            case "ERROR:rate_limit_exceeded":
                resultEl.textContent = "Rate Limit Exceeded";
                break;
            case "ERROR:internal_server_error":
                resultEl.textContent = "Internal Server Error";
                break;
            case "ERROR:token_limit_reached":
                resultEl.textContent = "Token Limit Reached";
                break;
            default:
                total += decodedValue;
                resultEl.textContent = total;
        }
        
        // ? redunant
        
        total += decodedValue;
        resultEl.textContent = total;
    }

    inProgress = false;

});


stopGenerationButtonEl.addEventListener("click", () => {
  if (inProgress) {
    controller.abort();
  }
});

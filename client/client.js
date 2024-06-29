import {
    fileOpen,
  } from 'browser-fs-access';
  
import * as transformers from './transformers.js';


const inputEl = document.querySelector("#input");
const resultEl = document.querySelector("#output");
const startGenerationButtonEl = document.querySelector("#generate");
const stopGenerationButtonEl = document.querySelector("#cancel");
const loadTemplateButtonEl = document.querySelector("#load-template");
const loadStateButtonEl = document.querySelector("#load-state");

let controller = new AbortController();
let inProgress = false;

let template = defaultTemplate();
let state = newState();

function defaultTemplate() {
    return [
        {system:true, content:"You are a helpful AI assistant, ready to answer questions on any topic."}, 
        {prompt:true, loop:true, content:'{{type:"input", prompt:"What would you like to know?"}}'}
    ];
}

function newState() {
    return {messages:[], system:"", output:[], cursor:0, loop:-1, once:[]};
}

async function transform (content) {
    //parse the content string into an array of plaintext segments and {{}} blocks
    let segments = content.split(/{{([^}]*)}}/);
    let transformedContent = "";

    for (let i=0; i<segments.length; i++) {
        if (i%2==0) {
            transformedContent += segments[i];
        }
        else {
            //add brackets and parse the JSON
            let jsonString = "{"+segments[i]+"}";
            let json;
            try {   
                json = JSON5.parse(jsonString);
            }
            catch (e) {
                console.log("erorr parsing jsonString: ", jsonString);
                throw e;
            }

            let type = json.type;
            let transformer = transformers[type];
            
            if (!transformer) throw new Error(`No transformer found for type ${type}`);
            transformedContent += await transformer(json);
        }
    }
    return transformedContent;
}    


startGenerationButtonEl.addEventListener("click",   () => {
    //abort any in-progres requests
    if (inProgress) {
        controller.abort();
        controller = new AbortController();
    }

    inProgress = true;

    let messages = [
        {role:"system", content:"You are a helpful AI assistant, ready to answer questions on any topic."},
        {role:"user", content:inputEl.value}
    ];
    let model = "gpt-4";
    
    let searchParams = new URLSearchParams();
    searchParams.set("model", model);
    for (message of messages) 
        searchParams.append("messages", JSON.stringify(message));
    
    const queryString = searchParams.toString();

    fetch("/server?"+queryString, {
        signal: controller.signal,
    })
    .then(async response => {
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
        }
    
        inProgress = false;
    
    })
    .catch(error => {
        console.error(error);
        inProgress = false;
    })


});


stopGenerationButtonEl.addEventListener("click", () => {
  if (inProgress) {
    controller.abort();
  }
});

loadTemplateButtonEl.addEventListener("click", async () => {
    if (inProgress) {
        controller.abort();
      }


        try {
            const blob = await fileOpen({
                mimeTypes: ['text/plain', 'application/json'],
            });
            const text = await blob.text();
            const json = JSON.parse(text);    
            template = json;
        }
        catch (error) {
            console.error(error);
        }
        
});

loadStateButtonEl.addEventListener("click", async () => {
    if (inProgress) {
        controller.abort();
    }
    try {
        const blob = await fileOpen({
            mimeTypes: ['text/plain', 'application/json'],
        });

        const text = await blob.text();
        const json = JSON.parse(text);
        
        state = json;
    }
    catch (error) {
        console.error(error);
    }
});

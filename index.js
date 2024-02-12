import 'dotenv/config';

import  JSON5 from  'json5';

import * as prompts from '@inquirer/prompts';

import * as fs from 'fs/promises';
import * as transformers from './transformers.js';

import OpenAI from "openai";
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


const TEMPLATES_DIR = 'templates';
const SAVES_DIR = 'saves';


//prompt the user to select a state or create a new one

let {state, stateFilename} = await loadState();
console.log(state)

let templateFilename = state.templateFilename;
if (!templateFilename) {
    templateFilename = await chooseTemplate();
    state.templateFilename = templateFilename;
}
let template = await readTemplate(templateFilename);

  

while (true) {
    //if the cursor is at the end of the template and there is no loop, break
    if (state.cursor>=template.length && state.loop==-1) 
       break;    
    //otherwise if there is a loop, reset the cursor to the loop
    else if (state.cursor>=template.length) 
        state.cursor = state.loop;

    //retrieve the message
    const message = template[state.cursor];

    //if this is the loop target, update the loop pointer
    if (message.loop) 
        state.loop=state.cursor;

    //transform the content using the susbsitution transformers
    const transformedContent = await transform(message.content);

    //echo this message to the output
    if (message.echo)
        state.output.push(transformedContent);

    //if this is a system message, replace the existing system message
    if (message.system) 
        state.system = transformedContent;

    //now update the prompt
    if (!message.only && !message.system) {
        //add the message to the array
        state.messages.push({role:'user', content:transformedContent});
        
        //if this is a once message, add it to the once list
        if (message.once) 
            state.onces.push(messages.length-1);

    }


    //if this is a prompt message, send the prompt to GPT
    if (message.prompt) {
        //add the system message and to the message list
        let messages = [];
        messages.push({role:'system', content:state.system});
        messages = messages.concat(state.messages);

        //send the prompt to GPT
        let stream = await openai.chat.completions.create({
            model: "gpt-4",
            messages: state.messages,
            stream: true,
        });

        //collect the streamed response
        let content = "";
        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || ""; 
            content += delta;
            process.stdout.write(delta);
        }
        process.stdout.write("\n");
    
        //add the response to the output and messages
        state.output.push(content);
        state.messages.push({role:'assistant', content});

        //pop any only once messages from the stack
        //!!! TODO
    }

    state.cursor++;
    writeState(state, stateFilename);
}

//write the state to the state.json file
async function writeState(state, stateFilename) {
    let json = JSON.stringify(state);
    await fs.writeFile(stateFilename, json, 'utf8');
}

async function loadState() {
    let {isNew, stateFilename} = await chooseState();

    if (isNew) {
        let state = newState();
        return {stateFilename, state};
    }
    else {
        let state = await readState(stateFilename);
        return {stateFilename, state};
    }
}

//read and return the state from the state.json file
async function readState(filename) {
    try {
        let json = await fs.readFile(filename, 'utf8');
        return JSON.parse(json);    
    }
    catch (e) {
        console.log("Error reading state file :", filename);
        console.log(e);
        process.exit(1);
    }
}

function newState() {
    return {messages:[], system:"", output:[], cursor:0, loop:-1, once:[]};
}


//prompts the user to choose a state file or create a new one
async function chooseState() {
    //list the files in the states directory
    let files = await fs.readdir(SAVES_DIR);
    
    //prompt the user to select a template
    let choices = files.map((file) => ({value:`${SAVES_DIR}/${file}`}));
    choices.unshift({value:"create new"});
    let response = await prompts.select({message:"Load an existing state or create a new one?", choices});
    

    if (response == "create new")  {
        let stateFilename = SAVES_DIR + "/" + await prompts.input({message:"Enter a filename for the new state"});
        return {isNew:true, stateFilename};
    }
    else {
        return {stateFilename:response};
    }
}

//prompts the user to select a template
async function chooseTemplate() {
    //list the files in the templates directory
    let files = await fs.readdir(TEMPLATES_DIR);
    
    //prompt the user to select a template
    let choices = files.map((file) => ({value:`${TEMPLATES_DIR}/${file}`}));
    let response = await prompts.select({message:"Choose a template", choices});
    return response;
}

//load and return a template 
async function readTemplate(filename) {
    let template = await import(`./${filename}`);
    return template.default;
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


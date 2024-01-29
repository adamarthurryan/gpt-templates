import scenarioTemplate from './templates/scenario.js'
import { createScenarioPrompt } from './createPrompt.js';
import 'dotenv/config';

import * as fs from 'fs/promises';

import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


let data = await fs.readFile('data/reading.json', 'utf8');

let {cards, readings, content} = JSON.parse(data);

let prompt = createScenarioPrompt(readings, content);

let scenario="";
{
    const stream = await openai.chat.completions.create({
        model: "gpt-4",
        messages: prompt,
        stream: true,
    });
    let response = "";
    for await (const chunk of stream) {
        response += chunk.choices[0]?.delta?.content || "";
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
    process.stdout.write("\n");

    scenario=response;
}

let json = JSON.stringify({cards, readings, content, scenario});
fs.writeFile('data/scenario.json', json, 'utf8', callback);
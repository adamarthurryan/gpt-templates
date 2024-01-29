import tarot from 'tarot-deck';
import readingTemplates from './templates/readings.js'
import { createPrompt } from './createPrompt.js';
import 'dotenv/config';

import * as fs from 'fs/promises';

import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

//let cards = [0,1,2,3].map(i => tarot.drawCard());

let cards = [{name: "six of coins"}, {name: "nine of coins"}, {name: "ten of swords"}, {name: "king of swords"}];

let readings = readingTemplates.map((readingTemplate,i) => readingTemplate(cards[i].name));

let content = [];
for (let i = 0; i < readings.length; i++) {
    let prompt = createPrompt(readings, content);

    process.stdout.write("**"+cards[i].name+"**\n");

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

    content.push(response);
}

let json = JSON.stringify({cards, readings, content});
await fs.writeFile('data/reading.json', json, 'utf8');
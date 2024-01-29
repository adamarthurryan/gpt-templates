import 'dotenv/config';

import * as fs from 'fs/promises';

import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


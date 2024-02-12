import tarot from 'tarot-deck';
import * as prompts from '@inquirer/prompts';

//returns a random tarot card
const tarotcard = () => {
    return tarot.drawCard().name;
}

//returns a random dice role
const die = ({d}) => {
    return Math.floor(Math.random() * d) + 1;
}

const input = async ({prompt}) => {
    return await prompts.input({message:prompt});
}

const choice = async ({prompt, options}) => {
    let choices = options.map((option) => ({value:option}));
    console.log(choices);
    return await prompts.select({message:prompt, choices:choices});
}

export {tarotcard, input, choice, die};
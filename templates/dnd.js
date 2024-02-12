const prompt=true;
const system=true;
const once=true;
const loop=true;
const echo=true;
const only=true;

export default 
    [
        {   
            prompt, echo,
            content: `I want you to help me write a story in the second person, in the style of a text-based adventure or role-playing game. You will describe the setting, and I will describe the action the main character will take. The story will be richly detailed, fun, and eventful. Possible settings include {{type:"input", prompt:"settings", default:"the forest, a ruined church, a village, a castle, and a crypt"}}. Possible supporting characters include {{type:"input", prompt:"supporting characters", default:"your sister Janey who is a hunter, a sage, and various woodland creatures"}}. Possible antagonists include {{{type:"input", prompt:"antagonists", default:"a necromancer and evil spirits"}. The main character is {{type:"input", prompt:"character occupation", default:"a hunter and adventurer"}} named {{type:"input", prompt:"character name", default:"Adam"}}. He is skilled with {{type:"input", prompt:"character skills", default:"woodcraft, swordplay, and some elementary magic"}}. Start with describing the opening scene of the game, and then let me say what I will do next. I will role a 20-sided die which you can use to determine the success of the action, taking into account the action's difficulty and the characters' strengths and weaknesses. Then describe the consequences of that action. And so on.`
        },
        {
            prompt,
            loop,
            content: `My action: {{type:"input", prompt:"What do you choose to do next?"}}
            
            My roll: {{type:"die", d:20}}`
        }
    ]
;
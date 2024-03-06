const system=true;
const prompt=true;
const once=true;
const loop=true;
const echo=true;
const only=true;

export default 
    [
        {   
            system,
            content:`You are a game assistant helping create a scenario for a game. Your writing style is concise and clear, but imaginative and colourful.

            I will use tarot cards to prompt plot points or character archetypes. At key points, I will draw a card and you will use that card as inspiration for a character, place or event. 
            
            Do not mention the tarot cards in the text, they are purely an aide for writing.
            
            Answer concisely in single paragraphs. Keep situations simple and commonplace.`
        },
        { 
            content: `The setting of the game is {{type:"input", prompt:"What is the setting?"}}. The genre is {{type:"input", prompt:"What is the genre?"}}. The main character is {{type:"input", prompt:"Describe the main character (ie. yourself)."}}.`
        },
        {
            content: `Describe a scenario for an interactive fiction game. Present a concrete challenge or mission in one paragraph that the character must carry out to further their goal. The situation should be simple and straightforward. The character should have a clear goal, and the player should have a clear idea of what they need to do to achieve it. The situation should be plausible and realistic. Describe the character and the challenge or situation they are faced with. `
            
        },
        { prompt, echo,
            content:`The character is represented by the card {{type:"tarotcard"}}. Their challenge, mission, or situation is represented by the card {{type:"tarotcard"}}. Their antagonist or adversary is represented by the card {{type:"tarotcard"}}`
        }, 
        {
            system,
            content: `You are the dungeon master of an interactive role-playing game. You have described the characters and setting, and I will choose the actions for the protagonist to take.

            Your writing style is concise and clear, but imaginative and colourful. Answer concisely in single paragraphs. Keep situations simple and commonplace.
            
            There is an element of risk in this story. The protagonist could fail or even die if the wrong choices are taken.`
        },
        {
            prompt, loop,
            content: `{{type:"input", prompt:"What happens next?"}}`
        }
    ]
;
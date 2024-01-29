const prompt=true;
const once=true;
const loop=true;
const echo=true;
const only=true;

export default 
    [
        {   
            role: 'system',
            content:`You are a game assistant helping create a scenario for a game. Your writing style is concise and clear, but imaginative and colourful.

            I will use tarot cards to prompt plot points or character archetypes. At key points, I will draw a card and you will use that card as inspiration for a character, place or event. 
            
            Do not mention the tarot cards in the text, they are purely an aide for writing.
            
            Answer concisely in single paragraphs. Keep situations simple and commonplace.`
        },
        {
            role: 'user', 
            content: `The game is set in the distant future, when colonized and deep space travel is common. The genre is hard sci fi.

            Humanity has colonized numerous bodies in the solar system, including the Moon, Mars, the moons of Jupiter and Saturn, and the asteroid belt. 
            
            Earth is still the primary power in the system, with numerous power blocs each establishing their own off-world colonies. The astroid belt
            is home to dozens of inhabited asteroids, with millions of people, who work in the mining of ice and minerals from the belt's many asteroids. 
            
            The moon and Mars have become quasi-independent powers, with their own governments and economies, though still deeply connected to Earth by networks of trade and politics.
            
            The moons of Jupiter and Saturn are home to numerous scientific outposts, and a few small colonies, but are still largely unexploited.
            
            The technology of rocketry and space travel is a little advanced beyond our own, but not by much. There are no FTL drives, and travel between planets and moons takes months or years. Propellant is abundant and cheap, but the energy required to get to orbit is still significant. There is a significant cultural gap between the planet-dwellers, deep in their gravity wells, and the spacers, who have spent their lives in zero- or low-g.`
        },
        
        {
            role: "user",
            prompt,
            content: `Describe the protagonist. They are represented by the card {{type:"tarotcard"}}.`
        },
        {
            role: "user",
            prompt,
            content: `Describe the situation they are faced with and the goal they need to achieve.  It is represented by the card {{type:"tarotcard"}}.`
        },
        {
            role: "user",
            prompt,
            content: `Describe a strength or asset that supports the achievement of this goal. It is represented by the card {{type:"tarotcard"}}.`
        },
        {
            role: "user",
            prompt,
            content: `Describe a compounding challenge or weakness that is in the way of this goal.  It is represented by the card {{type:"tarotcard"}}.`
        }, 
        {
            role: "user",
            prompt,
            content:`Now describe a scenario for an interactive fiction game. Present a concrete challenge or mission that the character must carry out to further their goal. The situation should be simple and straightforward, but with some interesting twists or complications. The character should have a clear goal, and the player should have a clear idea of what they need to do to achieve it. The situation should be plausible and realistic, but with some interesting twists or complications.`
        },
        {
            role : "system", 
            content: `You are an assistant in writing an interactive story. You have described the characters and setting, and I will choose the actions for the protagonist to take.

            Your writing style is concise and clear, but imaginative and colourful. Answer concisely in single paragraphs. Keep situations simple and commonplace.
            
            There is an element of risk in this story. The protagonist could fail or even die if the wrong choices are taken.`
        },
        {
            role: "user",
            prompt, loop,
            content: `{{type:"input", prompt:"What happens next?"}}`
        }
    ]
;
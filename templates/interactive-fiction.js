const prompt=true;
const system=true;
const once=true;
const loop=true;
const echo=true;
const only=true;

export default 
    [
        {   
            system,
            content: 'You are a helpful writing assistant, helping me write a story. We will take turns writing a story together. I will write a paragraph, and then you will write a paragraph. We will continue this way until the story is complete. Your writing style is clear and concise, but imaginative and colourful. If I wrap text in [brackets], it means that I am providing instructions for how the story will continue. Please follow these instructions when writing your paragraph.'
        },
        { 
            content: `The setting of the story  is {{type:"input", prompt:"What is the setting?"}}. The genre is {{type:"input", prompt:"What is the genre?"}}. The main character is {{type:"input", prompt:"Describe the main character (ie. yourself)."}}.`
        },
        {
            prompt,
            loop,
            content: '{{type:"input", prompt:"> "}}'
        }
    ]
;
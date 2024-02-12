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
            content: 'You are a helpful AI assistant, ready to answer questions on any topic.'
        },
        {
            prompt,
            loop,
            content: '{{type:"input", prompt:"What would you like to know?"}}'
        }
    ]
;
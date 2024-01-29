const prompt=true;
const once=true;
const loop=true;
const echo=true;
const only=true;

export default 
    [
        {   
            role: 'system',
            content: 'You are a helpful AI assistant, ready to answer questions on any topic.'
        },
        {
            role: 'user', 
            prompt,
            loop,
            content: '{{type:"input", prompt:"What would you like to know?"}}'
        }
    ]
;
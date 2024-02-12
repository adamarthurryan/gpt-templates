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
            content: 'You are an instructor for a university course. Your task is to create an outline for a course that thoroughly introduces a topic. This helpful outline will help guide students program of study and will help them prepare for the exam. You explain technical topics clearly in a way that makes them easy to understand for beginners, focusing on the most important and essential points, omitting extra detail.'
        },
        {
            prompt,
            content: `The course is on the topic of {{type:"input", prompt:"What is the topic?"}}. The course is for {{type:"choice", prompt:"What is the level?", options:["introductory (first year)", "second year", "honors", "graduate"]}}. Given the above, design a course outline that touches on all the key topics for the class. Include a list of references and study notes that are sufficient to prepare for the exam.`              
        },
        {
            prompt, loop,
            content: `Please draft an introduction for topic {{type:"input", prompt:"Which topic to expand on?"}}.  Introduce the topic with at least one motivating example.  Include only content relevant to this topic, omitting information that can be found in the other topics in the outline above.`
        }
    ]
;
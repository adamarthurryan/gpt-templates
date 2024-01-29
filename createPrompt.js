import systemPrompt from './templates/system.js';
import settingPrompt from './templates/setting.js';
import scenarioPrompt from './templates/scenario.js';

//create a starting prompt with the system message and story setting
export function createStartingPrompt() {
    let messages = [];
    messages.push({ "role": "system", "content": systemPrompt() });
    messages.push({ "role": "user", "content": settingPrompt() });

    return messages;
}

export function createPrompt(readings, content) {
    let messages = createStartingPrompt();
    for (let i = 0; i < readings.length; i++) {
        messages.push({ "role": "user", "content": readings[i] });
        if (content.length > i) 
            messages.push({ "role": "assistant", "content": content[i] });
        else
            break;
    }
    
    return messages;
}

export function createScenarioPrompt(readings, content) {
    let messages=createPrompt(readings, content);
    messages.push({ "role": "user", "content": scenarioPrompt() });
    return messages;
}

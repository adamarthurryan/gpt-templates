import tarot from 'tarot-deck';

tarotcard = () => {
    return tarot.drawCard().name;
}

export {tarotcard, input};
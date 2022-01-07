import Eev from 'eev';

export const EVENT_BUS = new Eev();

export function startListening() {
    // init controls 
    document.addEventListener('keydown', e => {
        if (e.code === 'Space') {
            EVENT_BUS.emit('jump');
        }
    })
}
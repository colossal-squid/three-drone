import Eev from 'eev';

export const EVENT_BUS = new Eev();

export function startListening() {
    // init controls 
    document.addEventListener('keydown', e => {
        switch (e.code) {
            case 'Space': EVENT_BUS.emit('jump');
                break;
            case 'KeyA': EVENT_BUS.emit('left');
                break;
            case 'KeyW': EVENT_BUS.emit('forward');
                break;
            case 'KeyS': EVENT_BUS.emit('back');
                break;
            case 'KeyD': EVENT_BUS.emit('right');
                break;
        }
    })
}
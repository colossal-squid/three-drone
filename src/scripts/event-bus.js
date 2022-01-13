import Eev from 'eev';

export const EVENT_BUS = new Eev();

export function startListening() {
    // init controls 
    document.addEventListener('keyup', e => {
        switch (e.code) {
            case 'KeyA':
            case 'KeyD':
                EVENT_BUS.emit('yawCenter');
                break;
        }
    });

    document.addEventListener('keydown', e => {
        switch (e.code) {
            case 'Space': EVENT_BUS.emit('arm');
                break;
            case 'KeyA': EVENT_BUS.emit('yawRight');
                break;
            case 'KeyW': EVENT_BUS.emit('throttleUp');
                break;
            case 'KeyS': EVENT_BUS.emit('throttleDown');
                break;
            case 'KeyD': EVENT_BUS.emit('yawLeft');
                break;

            case 'KeyJ': EVENT_BUS.emit('left');
                break;
            case 'KeyI': EVENT_BUS.emit('forward');
                break;
            case 'KeyK': EVENT_BUS.emit('back');
                break;
            case 'KeyL': EVENT_BUS.emit('right');
                break;
            case 'KeyC': EVENT_BUS.emit('cameraToggle');
                break;
            case 'KeyW': 
                window.location.reload();
                break;
        }
    })
}
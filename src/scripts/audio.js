import {Howl} from 'howler';
import controller from './controller';

let engineSound = new Howl({
    src: ['public/drone.mp3'],
    loop: true
});

engineSound.play();

export function updateAudio() {
    if (!controller.armed) {
        engineSound.volume(0);
        return;
    }
    const volume = (controller.throttle + 1) / 2;
    const rate = 1 + (controller.throttle + 1) / 2 * 0.4;
    engineSound.rate(rate);
    engineSound.volume(volume);
}

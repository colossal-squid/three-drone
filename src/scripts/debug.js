import { KEYBOARD_CONTROLS } from "./constants";
import controller from "./controller";

let debugElement;

function getDebugElement() {
    if (!debugElement) {
        return debugElement = document.querySelector('#debug');
    }
    return debugElement;
}

export function updateDebug(drone) {
    window.threeDebug = true;
    const playerBody = drone.getBody();
    let debugText = [
        playerBody.linearVelocity,
        playerBody.angularVelocity
    ].map(({ x, y, z }) => `x:${x.toFixed(2)} y:${y.toFixed(2)} z: ${z.toFixed(2)}`)
        .join('\n');
    debugText += '\n' + controller.toString() + '\n';
    debugText += '\nmass: ' + (playerBody.mass * 1000).toFixed(2) + 'g\n';
    debugText += '\ngp: ' + controller.name + '\n';
    debugText += KEYBOARD_CONTROLS;
    getDebugElement().innerHTML = `<pre>${debugText}</pre>`
}
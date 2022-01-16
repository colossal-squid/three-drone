import { KEYBOARD_CONTROLS } from "./constants";
import controller from "./controller";

let debugElement;

function getDebugElement() {
    if (!debugElement) {
        return debugElement = document.querySelector('#debug');
    }
    return debugElement;
}

function vec3ToString(vec3) {
    if (!vec3) {
        return 'undefined';
    }
    return `${vec3.x.toFixed(2)} ${vec3.y.toFixed(2)} ${vec3.z.toFixed(2)}`;
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
    debugText += KEYBOARD_CONTROLS + '\n';

    let meshPosition = vec3ToString(drone.mesh.position)

    debugText += JSON.stringify(meshPosition) + '\n';
    debugText += JSON.stringify(vec3ToString(drone.nextFrameRotation)) + '\n';

    debugText += Object.keys((window.debugArrows || {})).map((key) => vec3ToString(window.debugArrows[key].position)).join('\n')
    getDebugElement().innerHTML = `<pre>${debugText}</pre>`
}
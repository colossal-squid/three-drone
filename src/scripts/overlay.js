import * as PIXI from 'pixi.js'
import controller from './controller';
import { MAX_ROTATION_SPEED, MAX_THROTTLE } from './drone';
import { flags } from './physics';

export function initOverlay() {
    const app = new PIXI.Application({
        width: 300,
        height: 100
    });

    document.querySelector('.overlay').appendChild(app.view);

    const graphics = new PIXI.Graphics();
    app.stage.addChild(graphics);
    const throttle = new PIXI.Text('-', { fill: 0xFFFFFF});
    throttle.position.set(100, 0)
    app.stage.addChild(throttle);

    const yaw = new PIXI.Text('-', { fill: 0xFFFFFF});
    yaw.position.set(100, 20)
    app.stage.addChild(yaw);

    const ground = new PIXI.Text('-', { fill: 0xFFFFFF});
    ground.position.set(100, 40)
    app.stage.addChild(ground);

    app.ticker.add(() => {
        graphics.clear();

        graphics.beginFill(0x00FF00, 0.3);
        graphics.drawRect(0, 0, 100, 100);
        graphics.endFill();

        graphics.beginFill(0x00FF00, 0.3);
        graphics.drawRect(200, 0, 100, 100);
        graphics.endFill();

        // left stick 
        graphics.beginFill(0xFF0000, 1);
        graphics.drawRect( 45 + (-controller.yaw * 50), 45 + (-controller.throttle * 50), 10, 10);
        graphics.endFill();

        // right stick
        graphics.beginFill(0xFF0000, 1);
        graphics.drawRect(245 + (controller.pitch * 50) , 45 + (-controller.roll * 50), 10, 10);
        graphics.endFill();

        throttle.text = 'T' + (1000000 * (MAX_THROTTLE * (1 + controller.throttle / 2))).toFixed(2)
        yaw.text = 'Y' + (100 * (MAX_ROTATION_SPEED * controller.yaw)).toFixed(2)
        ground.text = flags.isPlayerOnTheGround ? 'GRND' : 'SKY';
    });
}
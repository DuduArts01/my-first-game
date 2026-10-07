// initKaplay
import initKaplay from "./initKaplay";

// import sprite
import background from "../public/sprites/background.png"
import characters from "../public/sprites/characters.png"


export default function initGame(){
    const k = initKaplay();
    const DIAGONAL_FACTOR = 1 / Math.sqrt(2);

    // load sprites
    k.loadSprite("background", background);
    k.loadSprite("characters", characters, {
        //slice sprite rox x colunms
        sliceX: 8, 
        sliceY: 2, 

        /* 
            exemple: X amount in X and Y amount in Y, in this context X: 8, Y: 2 
            0, 1,  2,  3,  4,  5,  6,  7,
            8, 9, 10, 11, 12, 13, 14, 15
        */

        // animation sprite
        anims: {
            "down-idle": 0,
            "up-idle": 1,
            "right-idle": 2,
            "left-idle": 3,
            
            right: { from: 4, to: 5, loop: true},
            left: { from: 6, to: 7, loop: true},
            down: { from: 8, to: 9, loop: true},
            up: { from: 10, to: 11, loop: true},

            "npc-down": 12,
            "npc-up": 13,
            "npc-right": 14,
            "npc-left": 15,
        },
    });

    // .add() => Game object 
    k.add([k.sprite("background"), k.pos(0, -70), k.scale(8)]); // add background

    const player = k.add([ // add a player
        k.sprite("characters", { anim: "down-idle" }),
        k.area(),
        k.body(),
        k.anchor("center"),
        k.scale(8),
        k.pos(k.center()),
        "player", // tag identify for kaplay in Game Object
        {
            speed: 800,
            direction: k.vec2(0, 0),
        },
    ]) as any; // <-- Accepts the move method/physic

    player.onUpdate(() => { 
        // specify update
        // if you want to all update(global), then you will use k.onUpdate() 

        player.direction.x = 0;
        player.direction.y = 0;

        if (k.isKeyDown("left")) player.direction.x = -1;
        if (k.isKeyDown("right")) player.direction.x = 1;
        if (k.isKeyDown("down")) player.direction.y = 1; // the coordinate is inverted in Y
        if (k.isKeyDown("up")) player.direction.y = -1;

        if (
            player.direction.eq(k.vec2(-1, 0)) &&
            player.getCurAnim()?.name !== "left" // .getCurAnim()? (? indicates that the value can be optional or null), Typing is mandatory in TypeScript.
        ) {
            player.play("left");
        }

        if (
            player.direction.eq(k.vec2(1, 0)) &&
            player.getCurAnim()?.name !== "right"
        ) {
            player.play("right");
        }

        if (
            player.direction.eq(k.vec2(0, -1)) &&
            player.getCurAnim()?.name !== "up"
        ) {
            player.play("up");
        }

        if (
            player.direction.eq(k.vec2(0, 1)) &&
            player.getCurAnim()?.name !== "down"
        ) {
            player.play("down");
        }

        // idle
        if (
            player.direction.eq(k.vec2(0, 0)) &&
            !player.getCurAnim()?.name.includes("idle")
        ) {
            const currentAnim = player.getCurAnim()?.name;
            if (currentAnim) { // if currentAnim didn't include "idle"
                player.play(`${currentAnim}-idle`); // concatenates the idle
            } else {
                player.play("down-idle"); // Default animation, if there is no previous animation
            }
        }

        if (player.direction.x && player.direction.y){ // moving in x and y simultaneously
            player.move(player.direction.scale(DIAGONAL_FACTOR * player.speed));
            return;
        }   

        player.move(player.direction.scale(player.speed))
    });  
}
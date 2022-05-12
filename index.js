const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.jpg'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/martialhero/Sprite/Idle.png',
    framesMax: 10,
    scale: 2.5,
    offset: {
        x: 50,
        y: 20
    },
    sprites: {
        idle: {
            imageSrc: './assets/martialhero/Sprite/Idle.png',
            framesMax: 10
        },
        run: {
            imageSrc: './assets/martialhero/Sprite/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/martialhero/Sprite/Jump.png',
            framesMax: 3
        },
        fall: {
            imageSrc: './assets/martialhero/Sprite/Fall.png',
            framesMax: 3
        },
        attack1: {
            imageSrc: './assets/martialhero/Sprite/Attack2.png',
            framesMax: 6
        },
        death: {
            imageSrc: './assets/martialhero/Sprite/Death.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './assets/martialhero/Sprite/takehit.png',
            framesMax: 3
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 100,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc: './assets/evilwizard/Sprites/Idle.png',
    framesMax: 8,
    scale: 4.0,
    offset: {
        x: 215,
        y: 484
    },
    sprites: {
        idle: {
            imageSrc: './assets/evilwizard/Sprites/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/evilwizard/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/evilwizard/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/evilwizard/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/evilwizard/Sprites/Attack2.png',
            framesMax: 8
        },
        death: {
            imageSrc: './assets/evilwizard/Sprites/Death.png',
            framesMax: 7
        },
        takeHit: {
            imageSrc: './assets/evilwizard/Sprites/takehit.png',
            framesMax: 3
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    //shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    //jump
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    //enemy jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //detect for collision & enemy get hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false
        //document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        gsap.to('#enemyHealth', {
            width: enemy.health + '%',
        })
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    //this is where our player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        //document.querySelector('#playerHealth').style.width = player.health + '%'
        gsap.to('#playerHealth', {
            width: player.health + '%',
        })
    }

    //if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // end game on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break

            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break

            case 'w':
                player.velocity.y = -20
                break

            case ' ':
                player.attack()
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break

            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break

            case 'ArrowUp':
                enemy.velocity.y = -20
                break

            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break

        case 'w':
            keys.w.pressed = false
            break

        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break

        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
    }
})
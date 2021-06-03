namespace SpriteKind {
    export const EndFlag = SpriteKind.create()
    export const FinishedPlayer = SpriteKind.create()
    export const Title = SpriteKind.create()
}
namespace StatusBarKind {
    export const Progress = StatusBarKind.create()
}
function set_new_seed () {
    while (true) {
        new_seed = game.askForNumber("Please enter a seed:", 5)
        if (!(new_seed == new_seed)) {
            game.showLongText("Canceled setting new seed.", DialogLayout.Bottom)
            fade_in(true)
            game.reset()
        } else if (new_seed < 1 || new_seed > 65535) {
            game.showLongText("" + new_seed + " is not a valid seed! Please try again!", DialogLayout.Bottom)
        } else {
            blockSettings.writeNumber("seed", new_seed)
            game.showLongText("" + new_seed + " is now the new seed!", DialogLayout.Bottom)
            fade_in(true)
            game.reset()
        }
    }
}
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        if (tiles.locationXY(tiles.locationOfSprite(sprite), tiles.XY.row) >= tiles.tilemapRows() - 1) {
            sprite.destroy()
            timer.after(2000, function () {
                first_sec = []
                last_sec = []
                for (let index = 0; index < 1 * recording_fps; index++) {
                    first_sec.push(recording_frames.pop())
                }
                for (let index = 0; index < 1 * recording_fps; index++) {
                    last_sec.push(recording_frames.pop())
                }
                sprite_dying_animation = sprites.create(first_sec[0], SpriteKind.Title)
                sprite_dying_animation.setFlag(SpriteFlag.RelativeToCamera, true)
                sprite_dying_animation.setPosition(scene.screenWidth() / 2, scene.screenHeight() / 2)
                sprite_dying_animation.z = 10
                if (night_mode) {
                    sprite_rip = textsprite.create("RIP", 0, 1)
                } else {
                    sprite_rip = textsprite.create("RIP", 0, 15)
                }
                sprite_rip.setMaxFontHeight(12)
                sprite_rip.setFlag(SpriteFlag.RelativeToCamera, true)
                sprite_rip.setPosition(scene.screenWidth() / 2, scene.screenHeight() / 2)
                sprite_rip.z = 10
                timer.background(function () {
                    music.playMelody("C5 B G B A A - - ", 70)
                })
                animation.runImageAnimation(
                sprite_dying_animation,
                first_sec,
                Math.round(1000 / (recording_fps / 3)),
                false
                )
                timer.after(first_sec.length * Math.round(1000 / (recording_fps / 3)), function () {
                    animation.runImageAnimation(
                    sprite_dying_animation,
                    last_sec,
                    Math.round(1000 / (recording_fps / 2)),
                    false
                    )
                    timer.after(last_sec.length * Math.round(1000 / (recording_fps / 2)), function () {
                        sprite_dying_animation.destroy()
                        sprite_rip.destroy()
                        timer.after(2000, function () {
                            game.over(false)
                        })
                    })
                })
            })
        }
    }
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    jump_character()
})
function generate_3_wide_platform (col: number, row: number, variation: number, rand: number) {
    if (variation == 1) {
        tiles.setTileAt(tiles.getTileLocation(col, row - 1), grafxkid.fenceLeft)
        tiles.setTileAt(tiles.getTileLocation(col + 1, row - 1), grafxkid.fence)
        tiles.setTileAt(tiles.getTileLocation(col + 2, row - 1), grafxkid.fenceRight)
    } else if (variation == 2) {
        tiles.setTileAt(tiles.getTileLocation(col + Math.constrain(rand, 0, 2), row - 1), grafxkid.springBush)
    } else if (variation == 3) {
        tiles.setTileAt(tiles.getTileLocation(col + Math.constrain(rand, 0, 1), row - 1), grafxkid.springTree3)
        tiles.setTileAt(tiles.getTileLocation(col + (Math.constrain(rand, 0, 1) + 1), row - 1), grafxkid.springTree4)
        tiles.setTileAt(tiles.getTileLocation(col + Math.constrain(rand, 0, 1), row - 2), grafxkid.springTree1)
        tiles.setTileAt(tiles.getTileLocation(col + (Math.constrain(rand, 0, 1) + 1), row - 2), grafxkid.springTree2)
    }
    tiles.setTileAt(tiles.getTileLocation(col, row), grafxkid.springGroundTop)
    tiles.setTileAt(tiles.getTileLocation(col + 1, row), grafxkid.springGroundTop)
    tiles.setTileAt(tiles.getTileLocation(col + 2, row), grafxkid.springGroundTop)
    for (let row_diff = 0; row_diff <= 1; row_diff++) {
        for (let col_diff = 0; col_diff <= 2; col_diff++) {
            tiles.setTileAt(tiles.getTileLocation(col + col_diff, row + (row_diff + 1)), grafxkid.springGround)
        }
    }
}
function jump_character () {
    if (sprite_character) {
        if (sprite_character.isHittingTile(CollisionDirection.Bottom) && can_jump) {
            jump(sprite_character, jump_height)
        }
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    jump_character()
})
function create_progress_bar () {
    progress_bar = statusbars.create(scene.screenWidth() - 4, 3, StatusBarKind.Progress)
    progress_bar.value = 0
    progress_bar.max = tiles.tilemapColumns() * tiles.tileWidth()
    progress_bar.setColor(8, 0)
    progress_bar.left = 2
    progress_bar.top = 2
    progress_bar.setFlag(SpriteFlag.RelativeToCamera, true)
}
function create_character (col: number, row: number) {
    sprite_character = sprites.create(assets.image`player_right`, SpriteKind.Player)
    tiles.placeOnTile(sprite_character, tiles.getTileLocation(col, row))
    sprite_character.ay = 400
    enable_movement(true)
    scene.cameraFollowSprite(sprite_character)
    character.loopFrames(
    sprite_character,
    assets.animation`player_walk_left`,
    200,
    character.rule(Predicate.MovingLeft)
    )
    character.loopFrames(
    sprite_character,
    assets.animation`player_walk_right`,
    200,
    character.rule(Predicate.MovingRight)
    )
    character.loopFrames(
    sprite_character,
    [assets.animation`player_walk_left`[0]],
    200,
    character.rule(Predicate.FacingLeft, Predicate.NotMoving)
    )
    character.loopFrames(
    sprite_character,
    [assets.animation`player_walk_right`[0]],
    200,
    character.rule(Predicate.FacingRight, Predicate.NotMoving)
    )
}
function player_start_animation () {
    enable_movement(false)
    sprite_character.setFlag(SpriteFlag.Ghost, true)
    sprite_character.ay = 0
    sprite_character.vx = 75
    sprite_character.x += tiles.tileWidth() * -1
    timer.after(1000 / sprite_character.vx * tiles.tileWidth() * 4.5, function () {
        sprite_character.setFlag(SpriteFlag.Ghost, false)
        sprite_character.ay = 400
        sprite_character.vx = 0
    })
}
function fix_for_season () {
    define_tilesets()
    if (season == 1) {
        replace_with = tileset_winter
    } else if (season == 2) {
        replace_with = tileset_summer
    } else if (season == 3) {
        replace_with = tileset_fall
    } else {
        return
    }
    for (let index = 0; index <= replace_with.length - 1; index++) {
        for (let location of tiles.getTilesByType(tileset_spring[index])) {
            tiles.setTileAt(location, replace_with[index])
        }
    }
}
function generate_1_wide_platform (col: number, row: number) {
    tiles.setTileAt(tiles.getTileLocation(col, row), grafxkid.springGroundTop)
}
function fade_out (block: boolean) {
    color.startFade(color.Black, color.originalPalette, 2000)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
function read_bool (name: string) {
    return blockSettings.readNumber(name) == 1
}
function fade_in (block: boolean) {
    color.startFade(color.originalPalette, color.Black, 2000)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
function wait_for_menu_select () {
    selected = false
    while (!(selected)) {
        pause(100)
    }
}
function update_timer () {
    if (!(sprite_timer)) {
        return
    }
    end_time = game.runtime()
    time = spriteutils.roundWithPrecision((end_time - start_time) / 1000, 2)
    if (time < 60) {
        sprite_timer.setText("" + time)
    } else {
        secs = spriteutils.roundWithPrecision(time - Math.idiv(time, 60) * 60, 2)
        if (secs < 10) {
            sprite_timer.setText("" + Math.idiv(time, 60) + ":0" + secs)
        } else {
            sprite_timer.setText("" + Math.idiv(time, 60) + ":" + secs)
        }
    }
}
function generate_2_wide_platform (col: number, row: number, variation: number, rand: number) {
    if (variation == 1) {
        tiles.setTileAt(tiles.getTileLocation(col, row - 1), grafxkid.fenceLeft)
        tiles.setTileAt(tiles.getTileLocation(col + 1, row - 1), grafxkid.fenceRight)
    } else if (variation == 2) {
        tiles.setTileAt(tiles.getTileLocation(col + Math.constrain(rand, 0, 1), row - 1), grafxkid.springBush)
    } else if (variation == 3) {
        tiles.setTileAt(tiles.getTileLocation(col + Math.constrain(rand, 0, 1), row - 1), grafxkid.springGrass)
    }
    tiles.setTileAt(tiles.getTileLocation(col, row), grafxkid.springGroundTop)
    tiles.setTileAt(tiles.getTileLocation(col + 1, row), grafxkid.springGroundTop)
    tiles.setTileAt(tiles.getTileLocation(col, row + 1), grafxkid.springGround)
    tiles.setTileAt(tiles.getTileLocation(col + 1, row + 1), grafxkid.springGround)
}
function enable_movement (enabled: boolean) {
    if (sprite_character) {
        can_jump = enabled
        if (enabled) {
            controller.moveSprite(sprite_character, 75, 0)
        } else {
            controller.moveSprite(sprite_character, 0, 0)
        }
    }
}
function start_timer () {
    start_time = game.runtime()
    if (night_mode) {
        sprite_timer = textsprite.create("0.00", 0, 1)
    } else {
        sprite_timer = textsprite.create("0.00", 0, 15)
    }
    sprite_timer.setText("0.00")
    sprite_timer.left = 2
    sprite_timer.bottom = scene.screenHeight() - 2
    sprite_timer.setFlag(SpriteFlag.RelativeToCamera, true)
}
function set_walls () {
    for (let location of tiles.getTilesByType(grafxkid.springGroundTop)) {
        tiles.setWallAt(location, true)
    }
    for (let location of tiles.getTilesByType(grafxkid.springGround)) {
        tiles.setWallAt(location, true)
    }
}
function generate_platform (col: number, row: number, width: number, variation: number, rand: number) {
    if (width == 2) {
        generate_2_wide_platform(col, row, variation, rand)
    } else if (width == 3) {
        generate_3_wide_platform(col, row, variation, rand)
    } else {
        generate_1_wide_platform(col, row)
    }
}
function jump (sprite: Sprite, tiles_high: number) {
    sprite.vy = Math.sqrt(2 * (sprite.ay * (tiles_high * tiles.tileWidth()))) * -1
}
function generate_platformer () {
    tiles.setTilemap(tilemap`level_template`)
    start_col = 9
    start_row = 12
    rng_base = Random.createRNG(seed)
    rng_width = Random.createRNG(rng_base.nextNumber())
    rng_variation = Random.createRNG(rng_base.nextNumber())
    rng_rand = Random.createRNG(rng_base.nextNumber())
    rng_height = Random.createRNG(rng_base.nextNumber())
    rng_distance = Random.createRNG(rng_base.nextNumber())
    rng_season = Random.createRNG(rng_base.nextNumber())
    rng_stars = Random.createRNG(rng_base.nextNumber())
    if (night_mode) {
        scene.setBackgroundColor(15)
        scene.setBackgroundImage(img`
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            `)
        for (let index = 0; index < rng_stars.randomRange(20, 200); index++) {
            scene.backgroundImage().setPixel(rng_stars.randomRange(0, scene.screenWidth()), rng_stars.randomRange(0, scene.screenHeight()), 1)
        }
    } else {
        scene.setBackgroundColor(9)
    }
    // 0: spring
    // 1: winter
    // 2: summer
    // 3: fall
    season = rng_season.randomRange(0, 3)
    while (start_col < tiles.tilemapColumns() - 10) {
        width = rng_width.randomRange(1, 3)
        variation = rng_variation.randomRange(0, 3)
        rand = rng_rand.randomRange(0, width - 1)
        generate_platform(start_col, start_row, width, variation, rand)
        start_col += width
        start_col += rng_distance.randomRange(1, 2)
        start_row += rng_height.randomRange(-2, 2)
        start_row = Math.constrain(start_row, 4, tiles.tilemapRows() - 1 - 4)
        if (false) {
            tiles.centerCameraOnTile(tiles.getTileLocation(start_col, start_row))
            pause(0)
        }
    }
    make_end_platform(start_col, start_row)
    if (false) {
        timer.after(500, function () {
            tiles.placeOnTile(sprite_character, tiles.getTileLocation(start_col, start_row - 2))
        })
    }
    place_ending_flag()
    set_walls()
    fix_for_season()
}
function place_ending_flag () {
    sprite_end_flag = sprites.create(assets.image`end_flag`, SpriteKind.EndFlag)
    animation.runImageAnimation(
    sprite_end_flag,
    assets.animation`end_flag_animation`,
    150,
    true
    )
    location = tiles.getTilesByType(assets.tile`end`)[0]
    tiles.placeOnTile(sprite_end_flag, location)
    sprite_end_flag.bottom = tiles.locationXY(location, tiles.XY.bottom)
    tiles.setTileAt(location, assets.tile`transparency16`)
}
function save_bool (name: string, value: boolean) {
    if (value) {
        blockSettings.writeNumber(name, 1)
    } else {
        blockSettings.writeNumber(name, 0)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.EndFlag, function (sprite, otherSprite) {
    sprite.setKind(SpriteKind.FinishedPlayer)
    finished = true
    timer.background(function () {
        while (!(sprite.isHittingTile(CollisionDirection.Bottom))) {
            pause(0)
        }
        sprite.ay = 0
        sprite.vy = 0
        sprite.setFlag(SpriteFlag.Ghost, true)
        enable_movement(false)
        sprite.vx = 75
        timer.after(2000, function () {
            info.setScore(Math.map(Math.constrain(time, 0, 120), 120, 0, 0, 1000))
            game.over(true)
        })
    })
})
function make_end_platform (col: number, row: number) {
    tiles.setTileAt(tiles.getTileLocation(col + 1, row - 1), grafxkid.springGrass)
    tiles.setTileAt(tiles.getTileLocation(col + 2, row - 1), grafxkid.springTree3)
    tiles.setTileAt(tiles.getTileLocation(col + 3, row - 1), grafxkid.springTree4)
    tiles.setTileAt(tiles.getTileLocation(col + 2, row - 2), grafxkid.springTree1)
    tiles.setTileAt(tiles.getTileLocation(col + 3, row - 2), grafxkid.springTree2)
    tiles.setTileAt(tiles.getTileLocation(col + 5, row - 1), assets.tile`end`)
    for (let col_diff = 0; col_diff <= 10; col_diff++) {
        tiles.setTileAt(tiles.getTileLocation(col + col_diff, row), grafxkid.springGroundTop)
    }
    for (let row_diff = 0; row_diff <= 2; row_diff++) {
        for (let col_diff = 0; col_diff <= 10; col_diff++) {
            tiles.setTileAt(tiles.getTileLocation(col + col_diff, row + row_diff + 1), grafxkid.springGround)
        }
    }
}
function in_sim_or_rpi () {
    return control.deviceDalVersion() == "sim" || control.deviceDalVersion() == "linux"
}
blockMenu.onMenuOptionSelected(function (option, index) {
    selected = true
})
function define_tilesets () {
    tileset_spring = [
    grafxkid.springGroundTop,
    grafxkid.springGround,
    grafxkid.springTree3,
    grafxkid.springTree4,
    grafxkid.springTree1,
    grafxkid.springTree2,
    grafxkid.springGrass,
    grafxkid.springBush,
    grafxkid.fenceLeft,
    grafxkid.fence,
    grafxkid.fenceRight
    ]
    tileset_winter = [
    grafxkid.winterGroundTop,
    grafxkid.winterGround,
    grafxkid.winterTree3,
    grafxkid.winterTree4,
    grafxkid.winterTree1,
    grafxkid.winterTree2,
    assets.tile`transparency16`,
    grafxkid.winterBush,
    grafxkid.winterFenceLeft,
    grafxkid.winterFence,
    grafxkid.winterFenceRight
    ]
    tileset_summer = [
    grafxkid.summerGroundTop,
    grafxkid.summerGround,
    grafxkid.summerTree3,
    grafxkid.summerTree4,
    grafxkid.summerTree1,
    grafxkid.summerTree2,
    grafxkid.springGrass,
    grafxkid.summerRock,
    grafxkid.summerFenceLeft,
    grafxkid.summerFence,
    grafxkid.summerFenceRight
    ]
    tileset_fall = [
    grafxkid.fallGroundTop,
    grafxkid.fallGround,
    grafxkid.fallTree3,
    grafxkid.fallTree4,
    grafxkid.fallTree1,
    grafxkid.fallTree2,
    assets.tile`transparency16`,
    grafxkid.fallBush,
    grafxkid.fallFenceLeft,
    grafxkid.fallFence,
    grafxkid.fallFenceRight
    ]
}
function update_progress_bar () {
    if (progress_bar && sprite_character) {
        progress_bar.value = sprite_character.x
    }
}
let temp: Image = null
let location: tiles.Location = null
let sprite_end_flag: Sprite = null
let rand = 0
let variation = 0
let width = 0
let rng_stars: FastRandomBlocks = null
let rng_season: FastRandomBlocks = null
let rng_distance: FastRandomBlocks = null
let rng_height: FastRandomBlocks = null
let rng_rand: FastRandomBlocks = null
let rng_variation: FastRandomBlocks = null
let rng_width: FastRandomBlocks = null
let rng_base: FastRandomBlocks = null
let start_row = 0
let start_col = 0
let secs = 0
let start_time = 0
let time = 0
let end_time = 0
let sprite_timer: TextSprite = null
let selected = false
let tileset_spring: Image[] = []
let tileset_fall: Image[] = []
let tileset_summer: Image[] = []
let tileset_winter: Image[] = []
let replace_with: Image[] = []
let season = 0
let progress_bar: StatusBarSprite = null
let can_jump = false
let sprite_character: Sprite = null
let sprite_rip: TextSprite = null
let sprite_dying_animation: Sprite = null
let last_sec: Image[] = []
let first_sec: Image[] = []
let new_seed = 0
let sprite_seed: TextSprite = null
let finished = false
let recording_frames: Image[] = []
let recording_fps = 0
let jump_height = 0
let sprite_screen_shader: Sprite = null
let night_mode = false
let seed = 0
if (!(blockSettings.exists("seed"))) {
    blockSettings.writeNumber("seed", 1234)
}
// Cannot be less than 1
seed = blockSettings.readNumber("seed")
if (!(blockSettings.exists("night_mode"))) {
    save_bool("night_mode", false)
}
night_mode = read_bool("night_mode")
if (night_mode) {
    sprite_screen_shader = shader.createRectangularShaderSprite(scene.screenWidth(), scene.screenHeight(), shader.ShadeLevel.One)
    sprite_screen_shader.top = 0
    sprite_screen_shader.left = 0
    sprite_screen_shader.z = 5
    sprite_screen_shader.setFlag(SpriteFlag.RelativeToCamera, true)
} else {
    effects.clouds.startScreenEffect()
}
color.setPalette(
color.Black
)
jump_height = 2.5
recording_fps = 30
recording_frames = []
finished = false
generate_platformer()
create_character(0, 11)
player_start_animation()
fade_out(false)
let sprite_title = sprites.create(assets.image`title_screen`, SpriteKind.Title)
sprite_title.top = 0
sprite_title.left = 0
sprite_title.z = 10
sprite_title.setFlag(SpriteFlag.RelativeToCamera, true)
sprite_title.setFlag(SpriteFlag.AutoDestroy, true)
if (night_mode) {
    sprite_seed = textsprite.create("Seed: " + seed, 0, 1)
} else {
    sprite_seed = textsprite.create("Seed: " + seed, 0, 15)
}
sprite_seed.bottom = scene.screenHeight() - 2
sprite_seed.left = 2
sprite_seed.setFlag(SpriteFlag.RelativeToCamera, true)
sprite_seed.setFlag(SpriteFlag.AutoDestroy, true)
sprite_seed.z = 10
blockMenu.setControlsEnabled(false)
blockMenu.setColors(1, 15)
let options: string[] = []
options.push("Play")
options.push("Set seed")
options.push("Random seed")
if (night_mode) {
    options.push("Switch to day")
} else {
    options.push("Switch to night")
}
options.push("Reset high score")
timer.after(1000, function () {
    blockMenu.setControlsEnabled(true)
})
timer.background(function () {
    while (true) {
        blockMenu.showMenu(options, MenuStyle.List, MenuLocation.BottomRight)
        wait_for_menu_select()
        blockMenu.closeMenu()
        if (blockMenu.selectedMenuIndex() == 0) {
            sprite_title.ay = -500
            sprite_seed.ay = 500
            create_progress_bar()
            start_timer()
            enable_movement(true)
            break;
        } else if (blockMenu.selectedMenuIndex() == 1) {
            set_new_seed()
        } else if (blockMenu.selectedMenuIndex() == 2) {
            new_seed = randint(1, 65535)
            blockSettings.writeNumber("seed", new_seed)
            game.showLongText("" + new_seed + " is now the new seed!", DialogLayout.Bottom)
            fade_in(true)
            game.reset()
        } else if (blockMenu.selectedMenuIndex() == 3) {
            save_bool("night_mode", !(night_mode))
            fade_in(true)
            game.reset()
        } else if (blockMenu.selectedMenuIndex() == 4) {
            if (game.ask("Erase high score?")) {
                blockSettings.remove("high-score")
                game.showLongText("High score erased.", DialogLayout.Bottom)
            } else {
                game.showLongText("Canceled.", DialogLayout.Bottom)
            }
        }
    }
})
game.onUpdate(function () {
    update_progress_bar()
    if (!(finished) && !(spriteutils.isDestroyed(sprite_character))) {
        update_timer()
    }
})
game.onUpdateInterval(Math.round(1000 / recording_fps), function () {
    if (in_sim_or_rpi() && !(spriteutils.isDestroyed(sprite_character))) {
        temp = image.create(scene.screenWidth() / 2 + 1, scene.screenHeight() / 2 + 1)
        spriteutils.drawTransparentImage(image.screenImage(), temp, 0 - scene.screenWidth() / 4, 0 - scene.screenHeight() / 4)
        if (night_mode) {
            temp.drawRect(0, 0, scene.screenWidth() / 2, scene.screenHeight() / 2, 1)
        } else {
            temp.drawRect(0, 0, scene.screenWidth() / 2, scene.screenHeight() / 2, 15)
        }
        recording_frames.unshift(temp.clone())
        if (recording_frames.length > 2 * recording_fps) {
            recording_frames.pop()
        }
    }
})

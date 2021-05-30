namespace SpriteKind {
    export const EndFlag = SpriteKind.create()
}
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        if (tiles.locationXY(tiles.locationOfSprite(sprite), tiles.XY.row) >= tiles.tilemapRows() - 1) {
            sprite.destroy()
            timer.after(2000, function () {
                game.over(false)
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
        if (sprite_character.isHittingTile(CollisionDirection.Bottom)) {
            jump(sprite_character, jump_height)
        }
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    jump_character()
})
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
        for (let location of tiles.getTilesByType(tileset_spring[0])) {
            tiles.setTileAt(location, replace_with[0])
        }
    }
}
function generate_1_wide_platform (col: number, row: number) {
    tiles.setTileAt(tiles.getTileLocation(col, row), grafxkid.springGroundTop)
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
        if (enabled) {
            controller.moveSprite(sprite_character, 75, 0)
        } else {
            controller.moveSprite(sprite_character, 0, 0)
        }
    }
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
    while (start_col < 245) {
        width = rng_width.randomRange(1, 3)
        variation = rng_variation.randomRange(0, 3)
        rand = rng_rand.randomRange(0, width - 1)
        generate_platform(start_col, start_row, width, variation, rand)
        start_col += width
        start_col += 2
        start_row += rng_height.randomRange(-2, 2)
        start_row = Math.constrain(start_row, 4, tiles.tilemapRows() - 1 - 4)
    }
    make_end_platform(start_col, start_row)
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
function make_end_platform (col: number, row: number) {
    tiles.setTileAt(tiles.getTileLocation(col + 1, row - 1), grafxkid.springGrass)
    tiles.setTileAt(tiles.getTileLocation(col + 2, row - 1), grafxkid.springTree3)
    tiles.setTileAt(tiles.getTileLocation(col + 3, row - 1), grafxkid.springTree4)
    tiles.setTileAt(tiles.getTileLocation(col + 2, row - 2), grafxkid.springTree1)
    tiles.setTileAt(tiles.getTileLocation(col + 3, row - 2), grafxkid.springTree2)
    tiles.setTileAt(tiles.getTileLocation(col + 5, row - 1), assets.tile`end`)
    for (let col_diff = 0; col_diff <= 6; col_diff++) {
        tiles.setTileAt(tiles.getTileLocation(col + col_diff, row), grafxkid.springGroundTop)
    }
    for (let row_diff = 0; row_diff <= 2; row_diff++) {
        for (let col_diff = 0; col_diff <= 6; col_diff++) {
            tiles.setTileAt(tiles.getTileLocation(col + col_diff, row + row_diff + 1), grafxkid.springGround)
        }
    }
}
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
let location: tiles.Location = null
let sprite_end_flag: Sprite = null
let rand = 0
let variation = 0
let width = 0
let rng_height: FastRandomBlocks = null
let rng_rand: FastRandomBlocks = null
let rng_variation: FastRandomBlocks = null
let rng_width: FastRandomBlocks = null
let rng_base: FastRandomBlocks = null
let start_row = 0
let start_col = 0
let tileset_spring: Image[] = []
let tileset_fall: Image[] = []
let tileset_summer: Image[] = []
let tileset_winter: Image[] = []
let replace_with: Image[] = []
let sprite_character: Sprite = null
let jump_height = 0
let season = 0
let seed = 0
// Must be between 0 and 65535
seed = 1234
// 0: spring
// 1: winter
// 2: summer
// 3: fall
season = 0
jump_height = 2.5
scene.setBackgroundColor(9)
generate_platformer()
create_character(3, 11)

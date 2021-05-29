namespace SpriteKind {
    export const EndFlag = SpriteKind.create()
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
function set_walls () {
    for (let location of tiles.getTilesByType(grafxkid.springGroundTop)) {
        tiles.setWallAt(location, true)
    }
    for (let location of tiles.getTilesByType(grafxkid.springGround)) {
        tiles.setWallAt(location, true)
    }
}
function generate_platformer () {
    tiles.setTilemap(tilemap`level_template`)
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
    if (true) {
        tiles.centerCameraOnTile(location)
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
let tileset_spring: Image[] = []
let tileset_fall: Image[] = []
let tileset_summer: Image[] = []
let tileset_winter: Image[] = []
let replace_with: Image[] = []
let season = 0
// Must be between 0 and 65535
let seed = 1234
// 0: spring
// 1: winter
// 2: summer
// 3: fall
season = 0
scene.setBackgroundColor(9)
generate_platformer()

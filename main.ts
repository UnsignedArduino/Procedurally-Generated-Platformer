function fix_for_season () {
    define_tilesets()
    if (season == 1) {
        replace_with = winter_tileset
    } else if (season == 2) {
        replace_with = summer_tileset
    } else if (season == 3) {
        replace_with = fall_tileset
    } else {
        return
    }
    for (let index = 0; index <= replace_with.length - 1; index++) {
        for (let location of tiles.getTilesByType(spring_tileset[index])) {
            tiles.setTileAt(location, replace_with[index])
        }
    }
}
function generate_platformer () {
    tiles.setTilemap(tilemap`level_template`)
}
function define_tilesets () {
    spring_tileset = [
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
    winter_tileset = [
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
    summer_tileset = [
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
    fall_tileset = [
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
let spring_tileset: Image[] = []
let fall_tileset: Image[] = []
let summer_tileset: Image[] = []
let winter_tileset: Image[] = []
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
fix_for_season()
game.onUpdate(function () {
    if (controller.up.isPressed()) {
        scene.centerCameraAt(scene.cameraProperty(CameraProperty.X) + 0, scene.cameraProperty(CameraProperty.Y) - 2)
    } else if (controller.down.isPressed()) {
        scene.centerCameraAt(scene.cameraProperty(CameraProperty.X) + 0, scene.cameraProperty(CameraProperty.Y) + 2)
    }
    if (controller.left.isPressed()) {
        scene.centerCameraAt(scene.cameraProperty(CameraProperty.X) - 2, scene.cameraProperty(CameraProperty.Y) + 0)
    } else if (controller.right.isPressed()) {
        scene.centerCameraAt(scene.cameraProperty(CameraProperty.X) + 2, scene.cameraProperty(CameraProperty.Y) + 0)
    }
})

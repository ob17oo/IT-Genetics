import { useGLTF } from "@react-three/drei"

/**
 * Предзагрузка 3D моделей по сценам
 * ВАЖНО: каждая сцена загружает только свои модели
 */

// ============ ОБЩИЕ МОДЕЛИ (для всех сцен) ============
export const preloadCommonModels = () => {
  useGLTF.preload('/model/furniture/Office-Chair.glb')
  useGLTF.preload('/model/furniture/computer.glb')
  useGLTF.preload('/model/furniture/Office-Door.glb')
  useGLTF.preload('/model/furniture/windowFrame.glb')
}

// ============ МОДЕЛИ ЛОББИ ============
export const ALL_LOBBY_MODELS = [
  '/model/furniture/CHULAKOV_logotype.glb',
  '/model/furniture/AdminTable.glb',
  '/model/furniture/graySofa.glb',
  '/model/furniture/diplomaStand.glb',
  '/model/furniture/fireCase.glb',
  '/model/furniture/sofa.glb',
  '/model/furniture/coffeeTable.glb',
  '/model/furniture/InterCome.glb',
  '/model/furniture/PaperStack.glb',
  '/model/furniture/magazineStack.glb',
  '/model/furniture/penaplastLogotype.glb',
  '/model/furniture/candyBowl.glb',
  '/model/furniture/grassCarpet.glb',
  '/model/furniture/purpleSofa.glb',
  '/model/furniture/yellowSOfa.glb',
  '/model/furniture/LobbyBanner.glb',
  '/model/furniture/Office-Chair.glb',
  '/model/furniture/computer.glb',
  '/model/furniture/Office-Door.glb',
]

// ============ МОДЕЛИ ОФИСА ============
export const ALL_OFFICE_MODELS = [
  '/model/furniture/Office-Shelf.glb',
  '/model/furniture/Office-Table.glb',
  '/model/furniture/windowFrame-White.glb',
  '/model/furniture/windowFrame-Black.glb',
  '/model/furniture/flowerType1.glb',
  '/model/furniture/flowerType2.glb',
  '/model/furniture/flowerType3.glb',
  '/model/furniture/trashBucket.glb',
  '/model/furniture/FourFirecase.glb',
  '/model/furniture/hangingLamp.glb',
  '/model/furniture/wallTV.glb',
  '/model/furniture/MeetingTable.glb',
  '/model/furniture/MeetingTable-Black.glb',
  '/model/furniture/DinnerTable.glb',
  '/model/furniture/DinnerChair.glb',
  '/model/furniture/DinnerBarTable.glb',
  '/model/furniture/DinnerBarChair-Black.glb',
  '/model/furniture/DinnerBarChair-Yellow.glb',
  '/model/furniture/DinnerWindow.glb',
  '/model/furniture/Radiator.glb',
  '/model/furniture/WaterStand.glb',
  '/model/furniture/Hexagon-Yellow.glb',
  '/model/furniture/Hexagon-Black.glb',
  '/model/furniture/Fridge.glb',
  '/model/furniture/SurpriseGlassWall.glb',
  '/model/furniture/ShockGlassWall.glb',
  '/model/furniture/GlassWall.glb',
  '/model/furniture/DinnerGlassWall.glb',
  '/model/furniture/OlegGlassWall.glb',
  '/model/furniture/RageGlassWall.glb',
  '/model/furniture/OrangeGlassWall.glb',
  '/model/furniture/MeetingChair.glb',
  '/model/furniture/MeetingSofa.glb',
  '/model/furniture/Office-Door.glb',
]

export const preloadOfficeModels = () => {
  ALL_OFFICE_MODELS.forEach((model) => {
    useGLTF.preload(model)
  })
}

export const preloadLobbyModels = () => {
  ALL_LOBBY_MODELS.forEach((model) => {
    useGLTF.preload(model)
  })
}
preloadCommonModels()

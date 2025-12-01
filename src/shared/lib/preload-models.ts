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
export const preloadLobbyModels = () => {
  useGLTF.preload('/model/furniture/CHULAKOV_logotype.glb')
  useGLTF.preload('/model/furniture/AdminTable.glb')
  useGLTF.preload('/model/furniture/graySofa.glb')
  useGLTF.preload('/model/furniture/diplomaStand.glb')
  useGLTF.preload('/model/furniture/fireCase.glb')
  useGLTF.preload('/model/furniture/sofa.glb')
  useGLTF.preload('/model/furniture/coffeeTable.glb')
  useGLTF.preload('/model/furniture/InterCome.glb')
  useGLTF.preload('/model/furniture/PaperStack.glb')
  useGLTF.preload('/model/furniture/magazineStack.glb')
  useGLTF.preload('/model/furniture/penaplastLogotype.glb')
  useGLTF.preload('/model/furniture/candyBowl.glb')
  useGLTF.preload('/model/furniture/grassCarpet.glb')
  useGLTF.preload('/model/furniture/purpleSofa.glb')
  useGLTF.preload('/model/furniture/yellowSOfa.glb')
  useGLTF.preload('/model/furniture/LobbyBanner.glb')
}

// ============ МОДЕЛИ ОФИСА ============
export const preloadOfficeModels = () => {
  useGLTF.preload('/model/furniture/flowerType1.glb')
  useGLTF.preload('/model/furniture/flowerType2.glb')
  useGLTF.preload('/model/furniture/flowerType3.glb')
  useGLTF.preload('/model/furniture/trashBucket.glb')
  useGLTF.preload('/model/furniture/Office-Shelf.glb')
  useGLTF.preload('/model/furniture/Office-Table.glb')
  useGLTF.preload('/model/furniture/FourFirecase.glb')
  useGLTF.preload('/model/furniture/hangingLamp.glb')
  useGLTF.preload('/model/furniture/wallTV.glb')
  useGLTF.preload('/model/furniture/MeetingTable.glb')
}

// Загружаем только общие модели при старте
preloadCommonModels()
preloadOfficeModels()
preloadLobbyModels()
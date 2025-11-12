import { useGLTF } from "@react-three/drei"

/**
 * Предзагрузка всех 3D моделей для оптимизации производительности
 * Модели загружаются заранее, чтобы избежать задержек при первом рендере
 * 
 * useGLTF.preload должен вызываться на уровне модуля (не внутри функции)
 * для правильной работы кеширования и оптимизации
 */

// Мебель
useGLTF.preload('/model/furniture/computer.glb')
useGLTF.preload('/model/furniture/officechair.glb')

// Цветы
useGLTF.preload('/model/furniture/flowerType1.glb')
useGLTF.preload('/model/furniture/flowerType2.glb')
useGLTF.preload('/model/furniture/flowerType3.glb')


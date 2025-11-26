import { useProgress } from '@react-three/drei'

export default function SceneLoader() {
  const { progress, active } = useProgress()
  
  // Полностью скрывается когда активные загрузки завершены (progress === 100 или active === false)
  if (!active && progress === 100) {
    return null
  }
  
  return (
    <section className="absolute z-50 inset-0 bg-gray-900">
      <div className="h-full flex flex-col justify-center items-center gap-6">
        <h2 className="text-2xl text-yellow-200">IT Genetics</h2>
        <span className="text-lg text-yellow-500">
          Загрузка: {Math.round(progress)}%
        </span>
        <div className="w-[50%] h-2 rounded-full bg-gray-700 overflow-hidden">
          <div 
            className="h-full bg-yellow-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  )
}
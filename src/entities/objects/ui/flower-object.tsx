import { Clone ,useGLTF } from "@react-three/drei"

interface FlowerPotProps {
    position?: [number,number,number],
    scale?: number | [number,number,number],
    modelName: string
}

export function FlowerObject({position, scale = 0.01, modelName}: FlowerPotProps){
    const modelPath = `/model/furniture/flower/${modelName}.glb`
    const { scene } = useGLTF(modelPath)
    return (
        <Clone object={scene} position={position} scale={scale}/>
    )
}
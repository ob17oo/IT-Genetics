import { Clone, useGLTF } from "@react-three/drei"

interface ComputerProps{ 
    position?: [number,number,number]
    scale?: number | [number, number, number],
    rotation?: [number, number, number]
}

export function ComputerObject({position, scale = 0.1, rotation} :ComputerProps){

    const { scene  } = useGLTF('/model/furniture/computer.glb')

    return (
        <Clone object={scene} rotation={rotation}  position={position} scale={Array.isArray(scale) ? scale : [scale, scale, scale]} castShadow />
    )
}

useGLTF.preload('/model/furniture/computer.glb')
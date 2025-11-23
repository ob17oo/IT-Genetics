import { Clone, useGLTF } from "@react-three/drei"

interface DiplomaStandProps{
    position?: [number,number,number],
    scale?: number | [number,number,number],
    rotation?: [number,number,number]
}
export function DiplomaStand({position,scale,rotation}: DiplomaStandProps){
    const { scene } = useGLTF('model/furniture/DiplomaStand.glb')
    return (
        <Clone object={scene} scale={scale} rotation={rotation} position={position} />
    )
}
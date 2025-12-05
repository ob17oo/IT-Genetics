import { Clone, useGLTF } from "@react-three/drei"

interface WindowFrameProps{
    position: [number,number,number],
    scale?: number | [number,number,number],
    rotation?: [number,number,number],
    color?: string
}
export function WindowFrameObject({scale = 0.1,position,rotation, color = 'White'}: WindowFrameProps){
    const { scene } = useGLTF(`/model/furniture/windowFrame-${color}.glb`)
    return (
        <Clone object={scene} rotation={rotation} scale={scale} position={position} />
    )
}
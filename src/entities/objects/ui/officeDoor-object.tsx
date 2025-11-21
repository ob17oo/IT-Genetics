import { Clone, useGLTF } from "@react-three/drei"

interface OfficeDoorObject{
    position?: [number,number,number],
    scale?: number | [number,number,number],
    rotation?: [number,number,number]
}

export default function OfficeDoorObject({position, scale = 0.1, rotation}: OfficeDoorObject){
    const { scene } = useGLTF('/model/furniture/officeDoor.glb')
    return (
        <Clone object={scene} rotation={rotation} position={position} scale={Array.isArray(scale) ? scale : [scale, scale, scale]} />
    )
}
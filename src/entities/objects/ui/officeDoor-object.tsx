import { Clone, useGLTF } from "@react-three/drei"

interface OfficeDoorObject{
    position?: [number,number,number],
    scale?: number | [number,number,number],
}

export default function OfficeDoorObject({position, scale = 0.1}: OfficeDoorObject){
    const { scene } = useGLTF('/model/furniture/officeDoor.glb')
    return (
        <Clone object={scene} position={position} scale={Array.isArray(scale) ? scale : [scale, scale, scale]} />
    )
}
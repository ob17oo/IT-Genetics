import { Clone, useGLTF } from "@react-three/drei";
interface LogotypeProps{
    position?: [number,number,number],
    scale?: number | [number,number,number],
    rotation?: [number, number, number]
}
export function LogotypeObject({position,scale = 0.1,rotation}: LogotypeProps){
    const { scene } = useGLTF('model/furniture/CHULAKOV_logotype.glb')
    return (
        <Clone object={scene} scale={scale} rotation={rotation} position={position} />
    )
}
import { Clone, useGLTF } from "@react-three/drei";
interface SofaProps {
    position?: [number,number,number],
    scale?: number | [number, number,number],
    rotation?: [number,number,number],    
}
export function SofaObject({scale = 0.1 , rotation , position, }: SofaProps){
    const { scene } = useGLTF('/model/furniture/sofa.glb')

    return (
        <Clone scale={scale} position={position} rotation={rotation} object={scene} />
    )
}
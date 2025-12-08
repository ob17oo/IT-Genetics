import { Clone, useGLTF } from  '@react-three/drei'

interface ChairProps {
    position?: [number,number,number],
    scale?: number | [number, number, number],
    rotation?: [number,number,number]
}
export function ChairObject({position, scale = 0.1 , rotation}: ChairProps){
    const { scene } = useGLTF('/model/furniture/Office-Chair.glb')
    return (
        <Clone object={scene} position={position} scale={Array.isArray(scale) ? scale : [scale, scale, scale]} rotation={rotation} />
    )
}

useGLTF.preload('/model/furniture/Office-Chair.glb')
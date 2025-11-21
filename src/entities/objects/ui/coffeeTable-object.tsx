import { Clone, useGLTF } from "@react-three/drei"

interface CoffeeTableProps{
    position?: [number,number,number],
    scale?: number | [number,number,number],
    rotation?: [number,number,number]
}
export function CoffeeTableObject({position , scale = 0.1 , rotation}: CoffeeTableProps){
    const { scene } = useGLTF('/model/furniture/CoffeeTable.glb')
    return (
        <Clone object={scene} scale={scale} position={ position} rotation={rotation} />
    )
}
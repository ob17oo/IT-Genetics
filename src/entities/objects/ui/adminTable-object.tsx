import { useGLTF } from "@react-three/drei"

interface AdminTableProps{
    scale?: number | [number,number,number],
    position?: [number,number,number],
    rotation?: [number,number,number]
}

export function AdminTableObject({scale , position, rotation}: AdminTableProps){
    const { scene } = useGLTF('/model/furniture/adminTable.glb')
    return (
        <primitive object={scene} scale={scale} position={position} rotation={rotation} />
    )
}
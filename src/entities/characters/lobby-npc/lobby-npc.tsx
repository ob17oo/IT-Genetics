import { useAnimations, useGLTF } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { Group } from "three"

interface LobbyNPCProps{
    scale: number | [number,number,number],
    path: string,
    position?: [number,number,number],
    rotation?: [number,number,number]
}
export function LobbyNPC({scale = 0.1, path, position,rotation}:LobbyNPCProps){
    const groupRef = useRef<Group>(null)
    const { scene, animations } = useGLTF(`/model/character/${path}.glb`)
    const {actions, names} = useAnimations(animations, groupRef)

    useEffect(()=> {
        if(names.length > 0){
            const idleAnimation = names.find((elem) => elem.toLocaleLowerCase().includes('idle'))
            const animationToPlay = idleAnimation || names[0]
            if(idleAnimation && actions[animationToPlay]){
                actions[animationToPlay].play()
            }
        }
        
        
    }, [actions,names])

    return ( 
        <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
            <primitive object={scene} />
        </group>
    )
}
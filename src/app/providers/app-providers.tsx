'use client'

import { KeyboardControls } from "@react-three/drei"

export default function AppProviders({children} : {
    children: React.ReactNode
}){
    return (
       <KeyboardControls map={[
        {name: 'forward', keys: ["KeyW", "ArrowUp"]},
        {name: 'backward', keys: ['KeyS', "ArrowDown"]},
        {name: 'left', keys: ['KeyA', 'ArrowLeft']},
        {name: 'right', keys: ['KeyD', "ArrowRight"]},
        {name: 'run', keys: ["ShiftLeft", "ShiftRight"]}
       ]}>
        {children}
       </KeyboardControls>
    )
}
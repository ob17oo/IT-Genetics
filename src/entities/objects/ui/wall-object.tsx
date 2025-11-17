'use client'
interface WallProps{
    rotation?: [number,number,number],
    position?: [number,number,number]
    widthSize: number,
    heightSize: number,
    depthSize: number,
    color: string,
    recieveShadow: boolean
}

export default function WallObject({widthSize,heightSize,depthSize, rotation, position, color, recieveShadow}: WallProps){
    return (
        <mesh rotation={rotation} position={position} receiveShadow={recieveShadow}>
            <boxGeometry args={[widthSize,depthSize,heightSize]} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}
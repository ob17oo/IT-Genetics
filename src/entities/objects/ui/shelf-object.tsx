import { FlowerObject } from "./flower-object"

export function ShelfObject(){
    return (
        <group>
            <mesh rotation={[0,0,Math.PI / 2]} position={[0,1.1,0]}>
                <boxGeometry args={[0.05,5,0.5]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>

            <mesh rotation={[Math.PI / 2,0,Math.PI /2]} position={[0,1.35, 0.23]}> 
                <boxGeometry args={[0.05, 5, 0.5]} />
                <meshStandardMaterial color="#000000"/>
            </mesh>
            <mesh rotation={[Math.PI / 2,0,Math.PI /2]} position={[0,1.35, -0.23]}> 
                <boxGeometry args={[0.05, 5, 0.5]} />
                <meshStandardMaterial color="#000000"/>
            </mesh>

            <mesh rotation={[0,0,0]} position={[2.5,1.35, 0]}> 
                <boxGeometry args={[0.05, 0.5, 0.5]} />
                <meshStandardMaterial color="#000000"/>
            </mesh>
            <mesh rotation={[0,0,0]} position={[-2.5,1.35, 0]}> 
                <boxGeometry args={[0.05, 0.5, 0.5]} />
                <meshStandardMaterial color="#000000"/>
            </mesh>
            <group position={[0,1.6,-0.35]}>
                <FlowerObject modelName={'flowerType1.glb'} scale={0.5} position={[1.5,0,0.07]} />
                <FlowerObject modelName={'flowerType1.glb'} scale={0.5} position={[2.2,0,0.07]} />
                <FlowerObject modelName={'flowerType3.glb'} scale={0.7} position={[0.8,-0.5, 0.35]} />
                <FlowerObject modelName={'flowerType1.glb'} scale={0.5} position={[0.1,0,0.07]} />
                <FlowerObject modelName={'flowerType2.glb'} scale={1.8} position={[-0.6,-0.1, 0.35]} />
                <FlowerObject modelName={'flowerType2.glb'} scale={1.8} position={[-1.3,-0.1, 0.35]} />
                <FlowerObject modelName={'flowerType1.glb'} scale={0.5} position={[-2,0,0.07]} />
            </group>
        </group>
    )
}
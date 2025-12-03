import { CuboidCollider, MeshCollider, RigidBody } from "@react-three/rapier"
import { useMemo } from "react"
import { CylinderGeometry, DoubleSide } from "three"

interface CurveWallProps{
    radius?: number,
    height: number,
    depth: number,
    startAngle?: number,
    arcAngle?: number,
    position: [number,number,number,]
    rotation?: [number,number,number]
    color: string,
    segments?: number,
    withCollider?: boolean
    colliderType?: 'simple' | 'accurate' | 'none'
}
export default function CurveWallObject({
    radius = 10,
    height = 10,
    depth = 0.3,
    startAngle = 0,
    arcAngle = Math.PI,
    position,
    rotation,
    color = '#FFFFFF',
    segments = 32,
    withCollider = true,
    colliderType = 'simple'
}: CurveWallProps){

    const wallGeometry = useMemo(() => {
        return new CylinderGeometry(
            radius + depth / 2,
            radius - depth /2,
            height,
            segments,
            1,
            true,
            startAngle,
            arcAngle
        )
    },[radius, depth, height,segments,startAngle,arcAngle])

    const colliders = useMemo(() => {
        if(!withCollider || colliderType === 'none') return null

        if(colliderType === 'simple'){
            const colliderCount = Math.max(3, Math.floor(segments / 4))
            const segmentAngle = arcAngle / colliderCount

            return (
                <>
                   {Array.from({ length: colliderCount }).map((_, i) => {
            const angle = startAngle + (i + 0.5) * segmentAngle
            const x = Math.cos(angle) * (radius - depth / 2)
            const z = Math.sin(angle) * (radius - depth / 2)
            
            return (
              <CuboidCollider
                key={i}
                args={[
                  Math.sin(segmentAngle / 2) * radius, // Ширина сегмента
                  height / 2,                          // Полувысота
                  depth / 2                        // Полу-толщина
                ]}
                position={[x, height / 2, z]}
                rotation={[0, -angle, 0]}
              />
            )
          })}
                </>
            )
        }
        return (
          <MeshCollider type="hull">
            <mesh geometry={wallGeometry} />
          </MeshCollider>
        );
    },[radius,height,depth,startAngle,arcAngle,segments,withCollider,colliderType,wallGeometry])

    return (
      <RigidBody type="fixed" position={position} rotation={rotation}>
        {/* Визуальная стена */}
        <mesh geometry={wallGeometry} receiveShadow>
          <meshStandardMaterial color={color} side={DoubleSide} />
        </mesh>

        {/* Физические коллайдеры */}
        {colliders}
      </RigidBody>
    );
}
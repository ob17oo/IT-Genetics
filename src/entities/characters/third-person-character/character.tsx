'use client'
import { useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function Character({ scale = 0.5, animation = 'idle' }: { scale?: number; animation?: string }){
  const gltf = useGLTF('/model/character/character.glb')
  const { actions, names } = useAnimations(gltf.animations, gltf.scene)

  const resolveClipName = (key: string, available: string[]) => {
    if (!available || available.length === 0) return undefined
    const lower = key.toLowerCase()
    let found = available.find(n => n.toLowerCase() === lower)
    if (found) return found
    const containsMap: Record<string, string[]> = {
      idle: ['idle', 'stand'],
      walk: ['walk', 'walking'],
      run: ['run', 'running'],
      dance: ['dance']
    }
    const aliases = containsMap[lower] ?? [lower]
    for (const alias of aliases) {
      found = available.find(n => n.toLowerCase().includes(alias))
      if (found) return found
    }
    return available[0]
  }

  useEffect(() => {
    if (!actions) return
    const available = names ?? []
    const clipName = resolveClipName(animation ?? 'idle', available)
    Object.values(actions).forEach(a => a?.fadeOut(0.2))
    const next = clipName ? actions[clipName] : undefined
    const fallback = actions['Idle'] ?? (available[0] ? actions[available[0]] : undefined)
    ;(next ?? fallback)?.reset().fadeIn(0.2).play()
  }, [animation, actions, names])

  return (
    <group dispose={null} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  )
}

useGLTF.preload('/model/character/character.glb')
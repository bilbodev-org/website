<script setup lang="ts">
import * as THREE from 'three'
const host = ref<HTMLDivElement>()
const ready = ref(false)
const paused = ref(false)
const active = ref(0)
let resetScene = () => {}
let nudge = (_key: string) => {}
let disposeScene = () => {}
onMounted(() => {
  if (!host.value) return
  const el = host.value
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  paused.value = reducedMotion.matches
  let renderer: THREE.WebGLRenderer
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { return }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  el.prepend(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
  camera.position.set(0, 0, 9)
  scene.add(new THREE.AmbientLight(0xffffff, 2.2))
  const key = new THREE.DirectionalLight(0xffecd5, 4.5)
  key.position.set(-3, 5, 6)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xb9acff, 3)
  rim.position.set(4, -1, 2)
  scene.add(rim)
  // Rounded concave four-point arrow: the same silhouette as the logo.
  const vertices = [new THREE.Vector2(0, 1.32), new THREE.Vector2(-.98, -.83), new THREE.Vector2(0, -.40), new THREE.Vector2(.98, -.83)]
  const path = new THREE.Shape()
  vertices.forEach((point, index) => {
    const previous = vertices[(index + vertices.length - 1) % vertices.length]!
    const next = vertices[(index + 1) % vertices.length]!
    const enter = point.clone().lerp(previous, .055)
    const leave = point.clone().lerp(next, .055)
    if (index === 0) path.moveTo(enter.x, enter.y)
    else path.lineTo(enter.x, enter.y)
    path.quadraticCurveTo(point.x, point.y, leave.x, leave.y)
  })
  path.closePath()
  const geometry = new THREE.ExtrudeGeometry(path, { depth: .27, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: .065, bevelThickness: .065, curveSegments: 12 })
  geometry.center()
  const materials = [0xfbc15d, 0xb26ec0].map(color => new THREE.MeshStandardMaterial({ color, metalness: .26, roughness: .31 }))
  const meshes = materials.map(material => { const mesh = new THREE.Mesh(geometry, material); scene.add(mesh); return mesh })
  const origins = [new THREE.Vector3(-1.05, -.52, .1), new THREE.Vector3(.85, .75, 0)]
  const rotations = [new THREE.Euler(.12, -.23, 1.23), new THREE.Euler(.13, .35, -.23)]
  resetScene = () => meshes.forEach((mesh, i) => { mesh.position.copy(origins[i]!); mesh.rotation.copy(rotations[i]!); mesh.scale.setScalar(1) })
  resetScene()
  const pointer = new THREE.Vector2(10, 10)
  const raycaster = new THREE.Raycaster()
  let selected: THREE.Mesh | null = null
  let hovered: THREE.Mesh | null = null
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const dragOffset = new THREE.Vector3()
  const hit = new THREE.Vector3()
  function updatePointer(event: PointerEvent) {
    const box = el.getBoundingClientRect()
    pointer.set(((event.clientX - box.left) / box.width) * 2 - 1, -((event.clientY - box.top) / box.height) * 2 + 1)
    raycaster.setFromCamera(pointer, camera)
  }
  function down(event: PointerEvent) {
    if (event.target !== renderer.domElement) return
    updatePointer(event)
    const intersection = raycaster.intersectObjects(meshes)[0]
    if (!intersection) return
    selected = intersection.object as THREE.Mesh
    active.value = meshes.findIndex(mesh => mesh.uuid === selected!.uuid)
    dragPlane.constant = -selected.position.z
    if (raycaster.ray.intersectPlane(dragPlane, hit)) dragOffset.copy(selected.position).sub(hit)
    renderer.domElement.setPointerCapture(event.pointerId)
    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.style.cursor = 'grabbing'
  }
  function move(event: PointerEvent) {
    updatePointer(event)
    if (selected && raycaster.ray.intersectPlane(dragPlane, hit)) {
      selected.position.copy(hit.add(dragOffset))
      selected.position.x = THREE.MathUtils.clamp(selected.position.x, -2, 2)
      selected.position.y = THREE.MathUtils.clamp(selected.position.y, -1.35, 1.35)
    } else {
      hovered = (raycaster.intersectObjects(meshes)[0]?.object as THREE.Mesh) || null
      renderer.domElement.style.cursor = hovered ? 'grab' : 'default'
    }
  }
  function up(event: PointerEvent) {
    selected = null
    if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId)
    renderer.domElement.style.cursor = 'grab'
    renderer.domElement.style.touchAction = 'pan-y'
  }
  function leave() { hovered = null }
  renderer.domElement.style.touchAction = 'pan-y'
  renderer.domElement.addEventListener('pointerdown', down)
  renderer.domElement.addEventListener('pointermove', move)
  renderer.domElement.addEventListener('pointerup', up)
  renderer.domElement.addEventListener('pointercancel', up)
  renderer.domElement.addEventListener('pointerleave', leave)
  nudge = (key: string) => {
    const mesh = meshes[active.value]!
    if (key === 'ArrowLeft') mesh.position.x -= .14
    if (key === 'ArrowRight') mesh.position.x += .14
    if (key === 'ArrowUp') mesh.position.y += .14
    if (key === 'ArrowDown') mesh.position.y -= .14
    mesh.position.x = THREE.MathUtils.clamp(mesh.position.x, -2, 2)
    mesh.position.y = THREE.MathUtils.clamp(mesh.position.y, -1.35, 1.35)
  }
  const resize = new ResizeObserver(() => {
    const { width, height } = el.getBoundingClientRect()
    if (!width || !height) return
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.position.z = camera.aspect < 1 ? 10.5 : 9
    camera.updateProjectionMatrix()
  })
  resize.observe(el)
  let visible = true
  const observer = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true })
  observer.observe(el)
  let frame = 0
  let t = 0
  let lastTime = 0
  function animate(time: number) {
    frame = requestAnimationFrame(animate)
    const delta = Math.min((time - lastTime) / 1000, .04)
    lastTime = time
    if (!visible || document.hidden) return
    if (!paused.value) t += delta
    meshes.forEach((mesh, i) => {
      if (mesh !== selected) {
        mesh.rotation.y = rotations[i]!.y + (paused.value ? 0 : Math.sin(t * .7 + i) * .14)
        mesh.rotation.x = rotations[i]!.x + (paused.value ? 0 : Math.sin(t * .9 + i) * .09)
        if (!paused.value) mesh.position.y += (Math.sin(t * .8 + i) - Math.sin((t - delta) * .8 + i)) * .12
      }
      const scale = mesh === hovered ? 1.07 : 1
      mesh.scale.lerp(new THREE.Vector3(scale, scale, scale), .1)
    })
    renderer.render(scene, camera)
  }
  frame = requestAnimationFrame(animate)
  ready.value = true
  const motionChange = () => { paused.value = reducedMotion.matches }
  reducedMotion.addEventListener('change', motionChange)
  disposeScene = () => {
    cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect()
    reducedMotion.removeEventListener('change', motionChange)
    renderer.domElement.removeEventListener('pointerdown', down)
    renderer.domElement.removeEventListener('pointermove', move)
    renderer.domElement.removeEventListener('pointerup', up)
    renderer.domElement.removeEventListener('pointercancel', up)
    renderer.domElement.removeEventListener('pointerleave', leave)
    geometry.dispose(); materials.forEach(material => material.dispose()); renderer.dispose(); renderer.domElement.remove()
  }
})
onBeforeUnmount(() => disposeScene())
</script>

<template>
  <div class="arrow-experience">
    <div ref="host" class="arrow-canvas" role="group" aria-label="Flechas interactivas del logotipo de BilboDev">
      <svg v-if="!ready" class="arrow-fallback" viewBox="0 0 450 380" aria-hidden="true"><path d="m38 228 179-38-55 72 24 80Z" fill="#fbc15d" stroke="#fbc15d" stroke-linejoin="round" stroke-width="9"/><path d="m239 173 115-131 31 165-77-40Z" fill="#b26ec0" stroke="#b26ec0" stroke-linejoin="round" stroke-width="9"/></svg>
    </div>
    <div v-if="ready" class="scene-caption"><span class="drag-symbol" aria-hidden="true">✥</span><span>Las ideas se mueven. Prueba a arrastrarlas.</span><button :aria-label="paused ? 'Activar movimiento' : 'Pausar movimiento'" :aria-pressed="paused" @click="paused = !paused">{{ paused ? '▷' : 'Ⅱ' }}</button><button aria-label="Restablecer flechas" @click="resetScene()">↺</button></div>
    <div v-if="ready" class="keyboard-controls"><button v-for="(color, index) in ['naranja', 'lavanda']" :key="color" @focus="active = index" @keydown.left.prevent="nudge('ArrowLeft')" @keydown.right.prevent="nudge('ArrowRight')" @keydown.up.prevent="nudge('ArrowUp')" @keydown.down.prevent="nudge('ArrowDown')">Mover flecha {{ color }} con las teclas de dirección</button></div>
  </div>
</template>

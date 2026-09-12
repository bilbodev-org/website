<script setup lang="ts">
import * as THREE from 'three'

const host = ref<HTMLDivElement>()
const ready = ref(false)
let disposeScene = () => {}

onMounted(async () => {
  await nextTick()
  const el = host.value
  const hero = el?.closest('.hero') as HTMLElement | null
  const space = hero?.querySelector('.hero-arrow-space') as HTMLElement | null
  if (!el || !hero || !space) return

  let renderer: THREE.WebGLRenderer
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { return }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.domElement.setAttribute('aria-hidden', 'true')
  el.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(0, 1, 1, 0, .1, 2000)
  camera.position.z = 1000
  scene.add(new THREE.AmbientLight(0xffffff, 2.2))
  const key = new THREE.DirectionalLight(0xffecd5, 4.5)
  key.position.set(-300, 500, 600)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xb9acff, 3)
  rim.position.set(400, -100, 200)
  scene.add(rim)

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
  const meshes = materials.map(material => {
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    return mesh
  })
  meshes[0]!.rotation.set(.12, -.23, 1.23)
  meshes[1]!.rotation.set(.13, .35, -.23)

  const buttons = [...el.querySelectorAll<HTMLButtonElement>('.hero-arrow-hit')]
  const positions = [new THREE.Vector2(), new THREE.Vector2()]
  const velocities = [new THREE.Vector2(), new THREE.Vector2()]
  const spins: ({ start: number; from: number } | null)[] = [null, null]
  let width = 1
  let height = 1
  let size = 70
  let radius = 90
  let initialized = false
  let frame = 0
  let lastTime = 0
  let visible = true
  let drag: { index: number; pointerId: number; startX: number; startY: number; offsetX: number; offsetY: number; lastTime: number; moved: boolean } | null = null

  function reflect(value: number, min: number, max: number) {
    const span = max - min
    if (span <= 0) return { position: (min + max) / 2, direction: 0 }
    const offset = ((value - min) % (span * 2) + span * 2) % (span * 2)
    return offset <= span
      ? { position: min + offset, direction: 1 }
      : { position: max - (offset - span), direction: -1 }
  }
  function limits() {
    return { left: radius, right: width - radius, top: radius, bottom: height - radius }
  }
  function syncPosition(index: number) {
    const point = positions[index]!
    meshes[index]!.position.set(point.x, height - point.y, 0)
    buttons[index]!.style.left = `${point.x}px`
    buttons[index]!.style.top = `${point.y}px`
  }
  function resize() {
    const oldWidth = width
    const oldHeight = height
    const bounds = el!.getBoundingClientRect()
    width = Math.max(1, bounds.width)
    height = Math.max(1, bounds.height)
    size = Math.min(92, width * (width < 780 ? .13 : .085), height * .13)
    radius = size * 1.35
    renderer.setSize(width, height)
    camera.right = width
    camera.top = height
    camera.updateProjectionMatrix()
    const { left, right, top, bottom } = limits()
    buttons.forEach(button => { button.style.width = `${radius * 2}px`; button.style.height = `${radius * 2}px` })

    if (!initialized) {
      const stage = space!.getBoundingClientRect()
      positions[0]!.set(stage.left - bounds.left + stage.width * .77, stage.top - bounds.top + stage.height * .37)
      positions[1]!.set(stage.left - bounds.left + stage.width * .36, stage.top - bounds.top + stage.height * .68)
      initialized = true
    } else {
      positions.forEach(point => point.set(point.x * width / oldWidth, point.y * height / oldHeight))
    }
    positions.forEach((point, index) => {
      point.set(THREE.MathUtils.clamp(point.x, left, right), THREE.MathUtils.clamp(point.y, top, bottom))
      meshes[index]!.scale.setScalar(size)
      syncPosition(index)
    })
  }
  function spin(index: number) {
    const mesh = meshes[index]!
    spins[index] = { start: performance.now(), from: mesh.rotation.z }
  }
  function pointerDown(event: PointerEvent, index: number) {
    if (event.button !== 0 || drag) return
    const point = positions[index]!
    const bounds = el!.getBoundingClientRect()
    drag = {
      index, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      offsetX: event.clientX - bounds.left - point.x, offsetY: event.clientY - bounds.top - point.y,
      lastTime: event.timeStamp, moved: false,
    }
    velocities[index]!.set(0, 0)
    buttons[index]!.setPointerCapture(event.pointerId)
    buttons[index]!.style.cursor = 'grabbing'
    event.preventDefault()
  }
  function pointerMove(event: PointerEvent) {
    if (!drag || drag.pointerId !== event.pointerId) return
    if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5) return
    drag.moved = true
    const bounds = el!.getBoundingClientRect()
    const { left, right, top, bottom } = limits()
    const point = positions[drag.index]!
    const x = reflect(event.clientX - bounds.left - drag.offsetX, left, right)
    const y = reflect(event.clientY - bounds.top - drag.offsetY, top, bottom)
    const seconds = Math.max(.008, (event.timeStamp - drag.lastTime) / 1000)
    velocities[drag.index]!.set((x.position - point.x) / seconds, (y.position - point.y) / seconds).clampLength(0, 1500)
    point.set(x.position, y.position)
    syncPosition(drag.index)
    drag.lastTime = event.timeStamp
    event.preventDefault()
  }
  function pointerUp(event: PointerEvent) {
    if (!drag || drag.pointerId !== event.pointerId) return
    const { index, moved, lastTime } = drag
    if (!moved) spin(index)
    else if (event.timeStamp - lastTime > 100) velocities[index]!.set(0, 0)
    buttons[index]!.style.cursor = 'grab'
    if (buttons[index]!.hasPointerCapture(event.pointerId)) buttons[index]!.releasePointerCapture(event.pointerId)
    drag = null
    event.preventDefault()
  }
  function pointerCancel(event: PointerEvent) {
    if (drag?.pointerId !== event.pointerId) return
    buttons[drag.index]!.style.cursor = 'grab'
    velocities[drag.index]!.set(0, 0)
    drag = null
  }
  function keyboard(event: KeyboardEvent, index: number) {
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24],
    }
    const step = steps[event.key]
    if (!step) return
    event.preventDefault()
    const point = positions[index]!
    const { left, right, top, bottom } = limits()
    point.set(reflect(point.x + step[0], left, right).position, reflect(point.y + step[1], top, bottom).position)
    velocities[index]!.set(0, 0)
    syncPosition(index)
  }
  const listeners: (() => void)[] = []
  buttons.forEach((button, index) => {
    const down = (event: PointerEvent) => pointerDown(event, index)
    const keydown = (event: KeyboardEvent) => keyboard(event, index)
    const click = (event: MouseEvent) => { if (event.detail === 0) spin(index) }
    button.addEventListener('pointerdown', down)
    button.addEventListener('pointermove', pointerMove)
    button.addEventListener('pointerup', pointerUp)
    button.addEventListener('pointercancel', pointerCancel)
    button.addEventListener('keydown', keydown)
    button.addEventListener('click', click)
    listeners.push(() => {
      button.removeEventListener('pointerdown', down)
      button.removeEventListener('pointermove', pointerMove)
      button.removeEventListener('pointerup', pointerUp)
      button.removeEventListener('pointercancel', pointerCancel)
      button.removeEventListener('keydown', keydown)
      button.removeEventListener('click', click)
    })
  })

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(hero)
  const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true })
  visibilityObserver.observe(hero)
  resize()
  window.addEventListener('resize', resize)
  camera.updateMatrixWorld(true)

  function animate(time: number) {
    frame = requestAnimationFrame(animate)
    const delta = Math.min(Math.max(0, (time - lastTime) / 1000), .04)
    lastTime = time
    if (document.hidden || !visible) return
    const { left, right, top, bottom } = limits()
    positions.forEach((point, index) => {
      const velocity = velocities[index]!
      if (drag?.index !== index && velocity.lengthSq() > 1) {
        const x = reflect(point.x + velocity.x * delta, left, right)
        const y = reflect(point.y + velocity.y * delta, top, bottom)
        point.set(x.position, y.position)
        velocity.x *= x.direction < 0 ? -.72 : 1
        velocity.y *= y.direction < 0 ? -.72 : 1
        velocity.multiplyScalar(Math.exp(-1.65 * delta))
        syncPosition(index)
      }
      const currentSpin = spins[index]
      if (currentSpin) {
        const progress = Math.min(1, (time - currentSpin.start) / 650)
        const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
        meshes[index]!.rotation.z = currentSpin.from + Math.PI * 2 * eased
        if (progress === 1) spins[index] = null
      }
    })
    renderer.render(scene, camera)
  }
  frame = requestAnimationFrame(animate)
  ready.value = true
  disposeScene = () => {
    cancelAnimationFrame(frame)
    resizeObserver.disconnect()
    visibilityObserver.disconnect()
    window.removeEventListener('resize', resize)
    listeners.forEach(remove => remove())
    geometry.dispose()
    materials.forEach(material => material.dispose())
    renderer.dispose()
    renderer.domElement.remove()
  }
})
onBeforeUnmount(() => disposeScene())
</script>

<template>
  <div ref="host" class="home-arrows" :class="{ 'is-ready': ready }" role="group" aria-label="Flechas interactivas de BilboDev">
    <template v-if="!ready">
      <svg class="free-arrow-fallback is-orange" viewBox="-1.2 -1.5 2.4 3" aria-hidden="true"><path d="M0-1.32-.98.83 0 .40 .98.83Z" fill="#fbc15d" stroke="#fbc15d" stroke-width=".07" stroke-linejoin="round" /></svg>
      <svg class="free-arrow-fallback is-lavender" viewBox="-1.2 -1.5 2.4 3" aria-hidden="true"><path d="M0-1.32-.98.83 0 .40 .98.83Z" fill="#b26ec0" stroke="#b26ec0" stroke-width=".07" stroke-linejoin="round" /></svg>
    </template>
    <button class="hero-arrow-hit" type="button" aria-label="Flecha naranja. Arrastra para moverla, pulsa para girarla. Usa las flechas del teclado para moverla." />
    <button class="hero-arrow-hit" type="button" aria-label="Flecha lavanda. Arrastra para moverla, pulsa para girarla. Usa las flechas del teclado para moverla." />
  </div>
</template>

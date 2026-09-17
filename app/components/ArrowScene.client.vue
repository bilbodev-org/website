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
  const positionsAttribute = geometry.getAttribute('position')
  const uniqueVertices = new Map<string, THREE.Vector3>()
  for (let i = 0; i < positionsAttribute.count; i++) {
    const vertex = new THREE.Vector3().fromBufferAttribute(positionsAttribute, i)
    const key = `${vertex.x.toFixed(3)},${vertex.y.toFixed(3)},${vertex.z.toFixed(3)}`
    if (!uniqueVertices.has(key)) uniqueVertices.set(key, vertex)
  }
  const colliderVertices = [...uniqueVertices.values()]
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
  const hitCenters = [new THREE.Vector2(), new THREE.Vector2()]
  const hulls: THREE.Vector2[][] = [[], []]
  const hullBounds = [
    { minX: 0, maxX: 0, minY: 0, maxY: 0 },
    { minX: 0, maxX: 0, minY: 0, maxY: 0 },
  ]
  const spins: ({ start: number; previous: number } | null)[] = [null, null]
  const spinAxis = new THREE.Vector3(0, 1, 0)
  let width = 1
  let height = 1
  let size = 70
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
  function cross(a: THREE.Vector2, b: THREE.Vector2, c: THREE.Vector2) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  }
  function convexHull(points: THREE.Vector2[]) {
    points.sort((a, b) => a.x - b.x || a.y - b.y)
    const lower: THREE.Vector2[] = []
    const upper: THREE.Vector2[] = []
    for (const point of points) {
      while (lower.length > 1 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, point) <= 0) lower.pop()
      lower.push(point)
    }
    for (let i = points.length - 1; i >= 0; i--) {
      const point = points[i]!
      while (upper.length > 1 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, point) <= 0) upper.pop()
      upper.push(point)
    }
    return lower.slice(0, -1).concat(upper.slice(0, -1))
  }
  function updateHull(index: number) {
    const rotation = meshes[index]!.quaternion
    const projected = colliderVertices.map(vertex => {
      const rotated = vertex.clone().applyQuaternion(rotation).multiplyScalar(size)
      return new THREE.Vector2(rotated.x, -rotated.y)
    })
    const hull = convexHull(projected)
    hulls[index] = hull
    const bounds = hullBounds[index]!
    bounds.minX = Math.min(...hull.map(point => point.x))
    bounds.maxX = Math.max(...hull.map(point => point.x))
    bounds.minY = Math.min(...hull.map(point => point.y))
    bounds.maxY = Math.max(...hull.map(point => point.y))

    // The hit target follows the visible silhouette with only a small touch margin.
    const hitHull = hull.map(point => point.clone().multiplyScalar(1 + 4 / Math.max(1, point.length())))
    const minX = Math.min(...hitHull.map(point => point.x))
    const maxX = Math.max(...hitHull.map(point => point.x))
    const minY = Math.min(...hitHull.map(point => point.y))
    const maxY = Math.max(...hitHull.map(point => point.y))
    const hitWidth = Math.max(1, maxX - minX)
    const hitHeight = Math.max(1, maxY - minY)
    const button = buttons[index]!
    button.style.width = `${hitWidth}px`
    button.style.height = `${hitHeight}px`
    button.style.clipPath = `polygon(${hitHull.map(point => `${(point.x - minX) / hitWidth * 100}% ${(point.y - minY) / hitHeight * 100}%`).join(',')})`
    hitCenters[index]!.set((minX + maxX) / 2, (minY + maxY) / 2)
  }
  function limits(index: number) {
    const bounds = hullBounds[index]!
    return { left: -bounds.minX + 2, right: width - bounds.maxX - 2, top: -bounds.minY + 2, bottom: height - bounds.maxY - 2 }
  }
  function syncPosition(index: number) {
    const point = positions[index]!
    const hitCenter = hitCenters[index]!
    meshes[index]!.position.set(point.x, height - point.y, 0)
    buttons[index]!.style.left = `${point.x + hitCenter.x}px`
    buttons[index]!.style.top = `${point.y + hitCenter.y}px`
  }
  function movementCapacity(point: THREE.Vector2, direction: THREE.Vector2, index: number) {
    const { left, right, top, bottom } = limits(index)
    let amount = Infinity
    if (direction.x > 0) amount = Math.min(amount, (right - point.x) / direction.x)
    else if (direction.x < 0) amount = Math.min(amount, (left - point.x) / direction.x)
    if (direction.y > 0) amount = Math.min(amount, (bottom - point.y) / direction.y)
    else if (direction.y < 0) amount = Math.min(amount, (top - point.y) / direction.y)
    return Math.max(0, amount)
  }
  function axes() {
    const result: THREE.Vector2[] = []
    for (const hull of hulls) {
      for (let i = 0; i < hull.length; i++) {
        const edge = hull[(i + 1) % hull.length]!.clone().sub(hull[i]!)
        if (edge.lengthSq() > .0001) result.push(new THREE.Vector2(-edge.y, edge.x).normalize())
      }
    }
    return result
  }
  function project(index: number, axis: THREE.Vector2) {
    const center = positions[index]!.dot(axis)
    let min = Infinity
    let max = -Infinity
    for (const point of hulls[index]!) {
      const value = point.dot(axis) + center
      min = Math.min(min, value)
      max = Math.max(max, value)
    }
    return { min, max }
  }
  function collisionInfo() {
    let minimum = Infinity
    let normal: THREE.Vector2 | null = null
    for (const axis of axes()) {
      const first = project(0, axis)
      const second = project(1, axis)
      const overlap = Math.min(first.max, second.max) - Math.max(first.min, second.min)
      if (overlap <= 0) return null
      if (overlap < minimum) { minimum = overlap; normal = axis }
    }
    if (!normal) return null
    if (positions[1]!.clone().sub(positions[0]!).dot(normal) < 0) normal.negate()
    return { normal, overlap: minimum }
  }
  function resolveCollision(prefer = -1) {
    const first = positions[0]!
    const second = positions[1]!
    for (let attempt = 0; attempt < 3; attempt++) {
      const collision = collisionInfo()
      if (!collision) break
      const { normal } = collision
      const overlap = collision.overlap + .5
      const firstCapacity = movementCapacity(first, normal.clone().negate(), 0)
      const secondCapacity = movementCapacity(second, normal, 1)
      let moveFirst = 0
      let moveSecond = 0
      if (prefer === 0) {
        moveSecond = Math.min(overlap, secondCapacity)
        moveFirst = Math.min(overlap - moveSecond, firstCapacity)
      } else if (prefer === 1) {
        moveFirst = Math.min(overlap, firstCapacity)
        moveSecond = Math.min(overlap - moveFirst, secondCapacity)
      } else {
        moveFirst = Math.min(overlap / 2, firstCapacity)
        moveSecond = Math.min(overlap - moveFirst, secondCapacity)
        moveFirst += Math.min(overlap - moveFirst - moveSecond, firstCapacity - moveFirst)
      }
      first.addScaledVector(normal, -moveFirst)
      second.addScaledVector(normal, moveSecond)
      const closingSpeed = velocities[0]!.clone().sub(velocities[1]!).dot(normal)
      if (closingSpeed > 0) {
        const impulse = closingSpeed * .9
        velocities[0]!.addScaledVector(normal, -impulse)
        velocities[1]!.addScaledVector(normal, impulse)
      }
      syncPosition(0)
      syncPosition(1)
    }
  }
  function sweepDrag(index: number, candidate: THREE.Vector2, seconds: number) {
    if (collisionInfo()) return candidate
    const start = positions[index]!
    const otherIndex = 1 - index
    const movement = candidate.clone().sub(start)
    if (movement.lengthSq() < .001) return candidate
    let entry = -Infinity
    let exit = Infinity
    let hitAxis: THREE.Vector2 | null = null
    for (const axis of axes()) {
      const moving = project(index, axis)
      const other = project(otherIndex, axis)
      const speed = movement.dot(axis)
      if (Math.abs(speed) < .0001) {
        if (moving.max < other.min || other.max < moving.min) return candidate
        continue
      }
      const firstTime = (other.min - moving.max) / speed
      const secondTime = (other.max - moving.min) / speed
      const axisEntry = Math.min(firstTime, secondTime)
      const axisExit = Math.max(firstTime, secondTime)
      if (axisEntry > entry) { entry = axisEntry; hitAxis = axis }
      exit = Math.min(exit, axisExit)
      if (entry > exit) return candidate
    }
    if (!hitAxis || entry < 0 || entry > 1 || exit < 0) return candidate
    const contact = start.clone().addScaledVector(movement, entry)
    const normal = hitAxis.clone()
    if (contact.clone().sub(positions[otherIndex]!).dot(normal) < 0) normal.negate()
    const remainder = movement.clone().multiplyScalar(1 - entry)
    const reflected = remainder.addScaledVector(normal, -2 * remainder.dot(normal)).multiplyScalar(.72)
    const impactSpeed = Math.max(0, -movement.dot(normal) / seconds)
    velocities[otherIndex]!.addScaledVector(normal, -impactSpeed * .65).clampLength(0, 1500)
    return contact.add(reflected)
  }
  function resize() {
    const oldWidth = width
    const oldHeight = height
    const bounds = el!.getBoundingClientRect()
    width = Math.max(1, bounds.width)
    height = Math.max(1, bounds.height)
    size = Math.min(92, width * (width < 780 ? .13 : .085), height * .13)
    renderer.setSize(width, height)
    camera.right = width
    camera.top = height
    camera.updateProjectionMatrix()
    meshes.forEach((mesh, index) => {
      mesh.scale.setScalar(size)
      updateHull(index)
    })

    if (!initialized) {
      const stage = space!.getBoundingClientRect()
      positions[0]!.set(stage.left - bounds.left + stage.width * .77, stage.top - bounds.top + stage.height * .37)
      positions[1]!.set(stage.left - bounds.left + stage.width * .36, stage.top - bounds.top + stage.height * .68)
      initialized = true
    } else {
      positions.forEach(point => point.set(point.x * width / oldWidth, point.y * height / oldHeight))
    }
    positions.forEach((point, index) => {
      const { left, right, top, bottom } = limits(index)
      point.set(THREE.MathUtils.clamp(point.x, left, right), THREE.MathUtils.clamp(point.y, top, bottom))
      syncPosition(index)
    })
    resolveCollision()
  }
  function spin(index: number) {
    spins[index] = { start: performance.now(), previous: 0 }
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
    const { left, right, top, bottom } = limits(drag.index)
    const point = positions[drag.index]!
    const x = reflect(event.clientX - bounds.left - drag.offsetX, left, right)
    const y = reflect(event.clientY - bounds.top - drag.offsetY, top, bottom)
    const seconds = Math.max(.008, (event.timeStamp - drag.lastTime) / 1000)
    const candidate = sweepDrag(drag.index, new THREE.Vector2(x.position, y.position), seconds)
    const bouncedX = reflect(candidate.x, left, right)
    const bouncedY = reflect(candidate.y, top, bottom)
    velocities[drag.index]!.set((bouncedX.position - point.x) / seconds, (bouncedY.position - point.y) / seconds).clampLength(0, 1500)
    point.set(bouncedX.position, bouncedY.position)
    syncPosition(drag.index)
    resolveCollision(drag.index)
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
    const { left, right, top, bottom } = limits(index)
    point.set(reflect(point.x + step[0], left, right).position, reflect(point.y + step[1], top, bottom).position)
    velocities[index]!.set(0, 0)
    syncPosition(index)
    resolveCollision(index)
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
    meshes.forEach((mesh, index) => {
      const direction = index === 0 ? 1 : -1
      let angle = direction * .65 * delta
      const currentSpin = spins[index]
      if (currentSpin) {
        const progress = Math.min(1, (time - currentSpin.start) / 650)
        const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
        const spinAngle = Math.PI * 2 * eased
        angle += direction * (spinAngle - currentSpin.previous)
        currentSpin.previous = spinAngle
        if (progress === 1) spins[index] = null
      }
      mesh.rotateOnWorldAxis(spinAxis, angle)
      updateHull(index)
      const point = positions[index]!
      const velocity = velocities[index]!
      const { left, right, top, bottom } = limits(index)
      if (drag?.index !== index && velocity.lengthSq() > 1) {
        const x = reflect(point.x + velocity.x * delta, left, right)
        const y = reflect(point.y + velocity.y * delta, top, bottom)
        point.set(x.position, y.position)
        velocity.x *= x.direction < 0 ? -.72 : 1
        velocity.y *= y.direction < 0 ? -.72 : 1
        velocity.multiplyScalar(Math.exp(-1.65 * delta))
      }
      point.set(THREE.MathUtils.clamp(point.x, left, right), THREE.MathUtils.clamp(point.y, top, bottom))
      syncPosition(index)
    })
    resolveCollision(drag?.index ?? -1)
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
  <div ref="host" class="home-arrows" :class="{ 'is-ready': ready }" role="group" :aria-label="$t('home.arrowsGroup')">
    <template v-if="!ready">
      <svg class="free-arrow-fallback is-orange" viewBox="-1.2 -1.5 2.4 3" aria-hidden="true"><path d="M0-1.32-.98.83 0 .40 .98.83Z" fill="#fbc15d" stroke="#fbc15d" stroke-width=".07" stroke-linejoin="round" /></svg>
      <svg class="free-arrow-fallback is-lavender" viewBox="-1.2 -1.5 2.4 3" aria-hidden="true"><path d="M0-1.32-.98.83 0 .40 .98.83Z" fill="#b26ec0" stroke="#b26ec0" stroke-width=".07" stroke-linejoin="round" /></svg>
    </template>
    <button class="hero-arrow-hit" type="button" :aria-label="$t('home.orangeArrow')" />
    <button class="hero-arrow-hit" type="button" :aria-label="$t('home.lavenderArrow')" />
  </div>
</template>

export const meetupUrl = 'https://www.meetup.com/es-es/bilbo-dev/'
// Source: BilboDev public Meetup listing, checked 10 September 2026.
export const events = [
  { id: 'zelaq-ui', date: '2026-09-17T19:00:00+02:00', title: 'Zelaq UI: compartiendo componentes entre Web y (React) Native', topic: 'Multiplataforma', description: 'Una conversación sobre componentes compartidos entre web y móvil: APIs, tokens de diseño y lógica común, sin perder lo que hace distinta a cada plataforma.', location: 'Bilborock · Bilbao', url: meetupUrl },
  { id: 'summer-quiz', date: '2026-07-09T19:00:00+02:00', title: 'Summer Quiz 2026: aprende mientras disfrutas', topic: 'Comunidad', description: 'Cerramos la primera temporada reuniéndonos alrededor de un quiz tecnológico y de las ideas de la comunidad.', location: 'Bilborock · Bilbao', url: meetupUrl },
  { id: 'disenar-2026', date: '2026-06-04T19:00:00+02:00', title: 'Diseñar en 2026: menos píxeles, más decisiones', topic: 'Diseño', description: 'Un encuentro para pensar en las decisiones que hay detrás de una interfaz y en la relación entre diseño y desarrollo.', location: 'Bilborock · Bilbao', url: meetupUrl },
  { id: 'mock-service-worker', date: '2026-04-09T19:00:00+02:00', title: 'Frontend desacoplado: Mock Service Worker', topic: 'Desarrollo web', description: 'Con Carlos Borja, exploramos cómo trabajar y probar interfaces sin depender de que una API externa esté disponible.', location: 'Bilborock · Bilbao', url: meetupUrl },
  { id: 'headless-cms', date: '2026-02-26T19:00:00+01:00', title: 'Headless CMS con WordPress y Astro', topic: 'Desarrollo web', description: 'Eneko Olabarria nos acercó a la separación entre la gestión del contenido y la web que lo presenta.', location: 'Bilborock · Bilbao', url: meetupUrl },
  { id: 'mcp-frontends', date: '2026-01-29T18:30:00+01:00', title: 'MCP para frontends: más allá de las APIs', topic: 'Desarrollo web', description: 'Aaron Barcos abrió una conversación sobre MCP y sus posibilidades en el desarrollo de interfaces.', location: 'Bilborock · Bilbao', url: meetupUrl },
  { id: 'kickoff', date: '2025-11-27T18:30:00+01:00', title: 'Bilbo Frontend: el primer encuentro', topic: 'Comunidad', description: 'El punto de partida de la comunidad que hoy es BilboDev: conocernos y empezar a compartir lo que sabemos.', location: 'Bilborock · Bilbao', url: meetupUrl }
]
export function eventDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', ...options }).format(new Date(value))
}

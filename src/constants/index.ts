export const MESES   = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
export const DIAS    = ['L','M','X','J','V','S','D']

export const FUENTES = [
  'Playfair Display','Georgia','Arial','Helvetica',
  'Times New Roman','Montserrat','Raleway','Lato',
  'Open Sans','Roboto','Merriweather','Dancing Script',
]

export const PALETAS = [
  { nombre:'Clásico',     fondo:'#ffffff', header:'#1e293b', texto:'#1e293b', acento:'#3b82f6' },
  { nombre:'Azul',        fondo:'#f0f7ff', header:'#1d4ed8', texto:'#1e3a5f', acento:'#1d4ed8' },
  { nombre:'Verde',       fondo:'#f0fdf4', header:'#166534', texto:'#14532d', acento:'#16a34a' },
  { nombre:'Rosa',        fondo:'#fff1f2', header:'#9f1239', texto:'#881337', acento:'#e11d48' },
  { nombre:'Púrpura',     fondo:'#faf5ff', header:'#6b21a8', texto:'#4c1d95', acento:'#9333ea' },
  { nombre:'Naranja',     fondo:'#fff7ed', header:'#9a3412', texto:'#7c2d12', acento:'#ea580c' },
  { nombre:'Minimalista', fondo:'#fafafa', header:'#374151', texto:'#111827', acento:'#6b7280' },
  { nombre:'Oscuro',      fondo:'#0f172a', header:'#3b82f6', texto:'#e2e8f0', acento:'#60a5fa' },
]

export type Paleta = typeof PALETAS[0]

// ── Tamaños para CALENDARIO y PLANIFICADOR ────────────────────────────────────
export const TAMANOS = [
  { cat:'ESTÁNDAR', items:[
    { id:'carta',     nombre:'Carta',     dim:'21.6 × 27.9 cm' },
    { id:'oficio',    nombre:'Oficio',    dim:'21.6 × 33.0 cm' },
    { id:'ejecutivo', nombre:'Ejecutivo', dim:'18.4 × 26.7 cm' },
  ]},
  { cat:'ISO', items:[
    { id:'a4', nombre:'A4', dim:'21.0 × 29.7 cm' },
    { id:'a3', nombre:'A3', dim:'29.7 × 42.0 cm' },
    { id:'a5', nombre:'A5', dim:'14.8 × 21.0 cm' },
  ]},
  { cat:'GRANDE', items:[
    { id:'tabloide', nombre:'Tabloide',    dim:'27.9 × 43.2 cm' },
    { id:'11x17',    nombre:'11" × 17"',  dim:'27.9 × 43.2 cm' },
    { id:'60x90',    nombre:'60 × 90 cm', dim:'60.0 × 90.0 cm' },
  ]},
  { cat:'ESPECIAL', items:[
    { id:'cuaderno', nombre:'Cuaderno', dim:'16.0 × 21.5 cm' },
  ]},
]

export const TAMANOS_MM: Record<string,[number,number]> = {
  // ── Agenda y Planificador ──────────────────────────────────────────────────
  // Compactos
  bolsillo:[90,140], a6:[105,148], b6:[125,176],
  // Estándar
  a5:[148,210], b5:[176,250], a4:[210,297],
  // Escritorio (horizontal)
  'escritorio-s':[210,150], 'escritorio-m':[300,210], 'escritorio-l':[420,297],
  // Legacy / otros
  carta:[215.9,279.4], oficio:[215.9,330.2], ejecutivo:[184.1,266.7],
  a3:[297,420], tabloide:[279.4,431.8], '11x17':[279.4,431.8],
  '60x90':[600,900], cuaderno:[160,215],
  // ── Calendario ────────────────────────────────────────────────────────────
  'pared-a4':[210,297],   'pared-carta':[215.9,279.4],
  'pared-a3':[420,297],   'pared-tabloide':[279.4,431.8],
  'poster-30':[300,300],  'poster-50':[500,700],
  'escritorio-cal-s':[150,210], 'escritorio-cal-m':[150,230],
}

export const PAPELES = [
  { id:'bond',      nombre:'Bond',      desc:'Liso y económico'       },
  { id:'brillante', nombre:'Brillante', desc:'Alta definición, fotos' },
  { id:'mate',      nombre:'Mate',      desc:'Sin brillo, elegante'   },
  { id:'reciclado', nombre:'Reciclado', desc:'Ecológico'              },
]

// ── Tamaños para AGENDA ───────────────────────────────────────────────────────
export const TAMANOS_AGENDA = [
  { cat:'COMPACTO', items:[
    { id:'bolsillo', nombre:'Bolsillo / Pocket', dim:'9 × 14 cm',     horiz:false, desc:'Ultracompacta, siempre a la mano'       },
    { id:'a6',       nombre:'A6',                dim:'10.5 × 14.8 cm',horiz:false, desc:'Muy portátil, bolsos pequeños'          },
    { id:'b6',       nombre:'B6',                dim:'12.5 × 17.6 cm',horiz:false, desc:'Versátil, journaling y portátiles'      },
  ]},
  { cat:'ESTÁNDAR', items:[
    { id:'a5',       nombre:'A5',                dim:'14.8 × 21 cm',  horiz:false, desc:'El más popular, mochila y bolso'        },
    { id:'b5',       nombre:'B5',                dim:'17.6 × 25 cm',  horiz:false, desc:'Profesional, buen espacio de escritura' },
    { id:'a4',       nombre:'A4',                dim:'21 × 29.7 cm',  horiz:false, desc:'Máximo espacio, oficinas y docentes'    },
  ]},
  { cat:'ESCRITORIO', items:[
    { id:'escritorio-s', nombre:'Escritorio S', dim:'21 × 15 cm',     horiz:true,  desc:'Formato horizontal compacto'           },
    { id:'escritorio-m', nombre:'Escritorio M', dim:'30 × 21 cm',     horiz:true,  desc:'Escritorio estándar'                   },
    { id:'escritorio-l', nombre:'Escritorio L', dim:'42 × 29.7 cm',   horiz:true,  desc:'Escritorio grande'                     },
  ]},
]

export const TIPOS_AGENDA = [
  {
    id:'personal', icon:'📓', nombre:'Agenda Personal',
    desc:'Planificación diaria para uso personal y académico.',
    tags:['Semanal','Notas','Metas'],
    secciones:['portada','datos_personales','calendario_anual','metas_anio','planificacion_mensual','planificacion_semanal','tareas_pendientes','habitos','fechas_importantes','notas','contactos'],
  },
  {
    id:'ejecutiva', icon:'💼', nombre:'Agenda Ejecutiva',
    desc:'Orientada a profesionales y empresas.',
    tags:['Reuniones','Prioridades'],
    secciones:['portada','info_profesional','calendario_anual','agenda_diaria','reuniones','prioridades','proyectos','control_llamadas','objetivos_trimestrales','notas_ejecutivas','contactos'],
  },
  {
    id:'planificador', icon:'📋', nombre:'Planificador',
    desc:'Diseñado para organizar proyectos y objetivos.',
    tags:['Vista semanal','Proyectos'],
    secciones:['portada','objetivos_generales','planificacion_mensual','vista_semanal','proyectos','tareas','cronogramas','ideas','notas'],
  },
  {
    id:'cuaderno', icon:'📔', nombre:'Cuaderno',
    desc:'Para escritura libre y apuntes.',
    tags:['Blanco','Rayado','Cuadriculado'],
    secciones:['portada','indice','hojas_rayadas','hojas_cuadriculadas','hojas_blanco','notas'],
  },
  {
    id:'escritorio', icon:'🖥️', nombre:'Planificador Escritorio',
    desc:'Formato horizontal para escritorio u oficina.',
    tags:['Semanal','Grande','Horizontal'],
    secciones:['portada','calendario_mensual','vista_semanal_horiz','tareas_prioritarias','recordatorios','notas_rapidas'],
  },
]

export type Vista   = 'home' | 'calendario' | 'agenda' | 'planificador'
export type Diseno  = {
  id:            string
  tipo:          'calendario' | 'agenda' | 'planificador'
  titulo:        string
  paleta:        Paleta
  fuente:        string
  tamano:        string
  anio:          number
  fechaCreacion: string
}
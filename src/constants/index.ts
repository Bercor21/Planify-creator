export const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
export const DIAS  = ['L','M','X','J','V','S','D']

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
    { id:'a6', nombre:'A6', dim:'10.5 × 14.8 cm' },
  ]},
  { cat:'GRANDE', items:[
    { id:'tabloide', nombre:'Tabloide',   dim:'27.9 × 43.2 cm' },
    { id:'11x17',    nombre:'11" × 17"', dim:'27.9 × 43.2 cm' },
    { id:'60x90',    nombre:'60 × 90 cm', dim:'60.0 × 90.0 cm' },
  ]},
  { cat:'ESPECIAL', items:[
    { id:'cuaderno', nombre:'Cuaderno', dim:'16.0 × 21.5 cm' },
  ]},
]

export const TAMANOS_MM: Record<string,[number,number]> = {
  carta:[215.9,279.4], oficio:[215.9,330.2], ejecutivo:[184.1,266.7],
  a4:[210,297], a3:[297,420], a5:[148,210], a6:[105,148],
  tabloide:[279.4,431.8], '11x17':[279.4,431.8], '60x90':[600,900], cuaderno:[160,215],
}

export const PAPELES = [
  { id:'bond',      nombre:'Bond',      desc:'Liso y económico'       },
  { id:'brillante', nombre:'Brillante', desc:'Alta definición, fotos' },
  { id:'mate',      nombre:'Mate',      desc:'Sin brillo, elegante'   },
  { id:'reciclado', nombre:'Reciclado', desc:'Ecológico'              },
]

export const TAMANOS_AGENDA = [
  { cat:'BOLSILLO', items:[
    { id:'bolsillo',     nombre:'Bolsillo',     dim:'10 × 15 cm',   horiz:false },
  ]},
  { cat:'CUADERNO', items:[
    { id:'cuaderno-s',   nombre:'Cuaderno S',   dim:'14 × 21 cm',   horiz:false },
    { id:'cuaderno-m',   nombre:'Cuaderno M',   dim:'17 × 24 cm',   horiz:false },
  ]},
  { cat:'ESTÁNDAR', items:[
    { id:'a5',           nombre:'A5',           dim:'14.8 × 21 cm', horiz:false },
    { id:'carta',        nombre:'Carta',        dim:'21.6 × 27.9 cm', horiz:false },
    { id:'a4',           nombre:'A4',           dim:'21 × 29.7 cm', horiz:false },
  ]},
  { cat:'ESCRITORIO', items:[
    { id:'escritorio-s', nombre:'Escritorio S', dim:'21 × 15 cm',   horiz:true  },
    { id:'escritorio-m', nombre:'Escritorio M', dim:'30 × 21 cm',   horiz:true  },
    { id:'escritorio-l', nombre:'Escritorio L', dim:'42 × 29.7 cm', horiz:true  },
  ]},
]

export const TIPOS_AGENDA = [
  { id:'personal',     icon:'📓', nombre:'Agenda Personal',        desc:'Planificación diaria con espacio para notas y metas',    tags:['Semanal','Notas','Metas']        },
  { id:'ejecutiva',    icon:'💼', nombre:'Agenda Ejecutiva',        desc:'Profesional con reuniones, prioridades y seguimiento',   tags:['Reuniones','Prioridades']         },
  { id:'planificador', icon:'📋', nombre:'Planificador',            desc:'Vista semanal y mensual con objetivos y proyectos',      tags:['Vista semanal','Proyectos']       },
  { id:'cuaderno',     icon:'📔', nombre:'Cuaderno',                desc:'Hojas rayadas, cuadriculadas o en blanco para escribir', tags:['Blanco','Rayado','Cuadriculado']  },
  { id:'escritorio',   icon:'🖥️', nombre:'Planificador Escritorio', desc:'Formato horizontal para tu escritorio',                 tags:['Semanal','Grande','Horizontal']   },
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
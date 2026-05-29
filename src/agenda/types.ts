import { Paleta } from '../constants'

export type AgendaConfig = {
  // General
  titulo:            string
  subtitulo:         string
  anio:              number
  fuente:            string
  paleta:            Paleta
  tipo:              string
  tamano:            string
  // Portada
  imagenPortada?:    string
  colorPortada:      string
  textoPortada:      string        // texto adicional portada
  // Contraportada
  imagenContraportada?: string
  colorContraportada:   string
  textoContraportada:   string     // texto editable contraportada
  // Logo
  imagenLogo?:       string        // base64
  logoX:             number        // % desde izquierda (0-90)
  logoY:             number        // % desde arriba (0-90)
  logoSize:          number        // diámetro px (40-160)
  logoOpacity:       number        // 0.1 - 1
  // Interior
  imagenFondoInterno?:  string
  opacidadFondo:        number
  // Cantidades
  cantidadHojasNotas:   number
  cantidadHojasTareas:  number
  cantidadHojasFinales: number
  // Secciones opcionales
  incluirDiario:     boolean
  incluirFinanciera: boolean
  incluirHabitos:    boolean
  incluirContactos:  boolean
  incluirBolsillo:   boolean
}
/*
  ============================================================
  MODO SINGLE: define "dataCurso" (objeto singular)
    → El grupo ve solo un curso con sus sesiones y su lista de DUIs
  
  MODO MULTI: define "dataCursos" (array)
    → El grupo ve varios cursos en secuencia
    → Cada curso tiene su propia lista de DUIs autorizados
  ============================================================
  IMPORTANTE: Edita SOLO este archivo (data.js) o usa admin.html
  ============================================================
*/

const appConfig = {
  grupo: "Nombre del Grupo",
  instructor: "Ing. Jorge Rivera",
  institucion: "Universidad Don Bosco",
  tema: "Excel",
  logoUrl: "../../assets/img/UDB_horizontal fondo oscuro.png"
};

// ── MODO SINGLE ─────────────────────────────────────────────
// const dataCurso = {
//   id: "excel-basico-empresarial",
//   titulo: "Excel Básico Empresarial",
//   descripcion: "Aplicación de Excel en el entorno laboral",
//   duis: [
//     "00000000-0"
//   ],
//   sesiones: []
// };

// ── MODO MULTI ──────────────────────────────────────────────
// const dataCursos = [
//   {
//     id: "basico-1",
//     titulo: "Excel Básico 1",
//     descripcion: "Fundamentos de Excel",
//     estado: "finalizado",
//     duis: ["00000000-0"],
//     sesiones: []
//   },
//   {
//     id: "intermedio-1",
//     titulo: "Excel Intermedio 1",
//     descripcion: "Tablas dinámicas y funciones avanzadas",
//     estado: "activo",
//     duis: ["00000000-0"],
//     sesiones: []
//   }
// ];

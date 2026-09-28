const appConfig = {
  "grupo": "Grupo UDB",
  "instructor": "Ing. Jorge Rivera",
  "institucion": "Universidad Don Bosco",
  "tema": "Excel",
  "logoUrl": "../../assets/img/UDB_horizontal fondo oscuro.png"
};

const dataCursos = [
  {
    "id": "basico-1",
    "titulo": "Excel Básico 1",
    "descripcion": "Fundamentos: interfaz, fórmulas y formato de datos",
    "estado": "finalizado",
    "duis": [
      "00000000-0"
    ],
    "sesiones": []
  },
  {
    "id": "basico-2",
    "titulo": "Excel Básico 2",
    "descripcion": "Funciones lógicas, gráficos y manejo de datos",
    "estado": "finalizado",
    "duis": [
      "00000000-0"
    ],
    "sesiones": []
  },
  {
    "id": "intermedio-1",
    "titulo": "Excel Intermedio 1",
    "descripcion": "Tablas dinámicas, validación de datos y funciones avanzadas",
    "estado": "activo",
    "duis": [
      "00000000-0"
    ],
    "sesiones": [
      {
        "id": 1,
        "titulo": "Funciones lógicas y funciones de búsqueda",
        "fecha": "19-09-2026",
        "disponible": true,
        "suspendida": false,
        "motivo_suspension_img": "",
        "presentacion": "archivos/Inter1/s1/1- Sesion1_Intermedio1.pdf",
        "guia": "",
        "archivosExcel": [
          {
            "nombre": "Guia1",
            "ruta": "archivos/Inter1/s1/Sesion1_Intermedio1_ALUMNO.xlsx"
          }
        ],
        "urls": []
      },
      {
        "id": 2,
        "titulo": "Tablas dinámicas: fundamentos",
        "fecha": "26-09-2026",
        "disponible": true,
        "suspendida": false,
        "motivo_suspension_img": "",
        "presentacion": "archivos/Inter1/s2/Sesion2_Intermedio1.pdf",
        "guia": "archivos/Inter1/s2/Guia_Sesion2_Intermedio1.pdf",
        "archivosExcel": [
          {
            "nombre": "Guia2",
            "ruta": "archivos/Inter1/s2/Sesion2_Intermedio1_ALUMNO.xlsx"
          }
        ],
        "urls": []
      }
    ]
  }
];
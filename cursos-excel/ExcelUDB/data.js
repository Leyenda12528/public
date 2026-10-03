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
      "10000000-0",
      "05758527-1",
      "04017190-6",
      "05900014-6",
      "06102225-1",
      "06517818-5",
      "06902027-9",
      "06501537-9",
      "07331702-8",
      "01896926-8",
      "02906167-5",
      "05561108-4",
      "06230439-7"
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
        "guias": [],
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
        "guias": [
          {
            "nombre": "Guía de clase",
            "ruta": "archivos/Inter1/s2/Guia_Sesion2_Intermedio1.pdf"
          }
        ],
        "archivosExcel": [
          {
            "nombre": "Guia2",
            "ruta": "archivos/Inter1/s2/Sesion2_Intermedio1_ALUMNO.xlsx"
          }
        ],
        "urls": []
      },
      {
        "id": 3,
        "titulo": "Tablas dinámicas avanzadas + Gráficos dinámicos",
        "fecha": "03-10-2026",
        "disponible": true,
        "suspendida": false,
        "motivo_suspension_img": "",
        "presentacion": "archivos\\Inter1\\s3\\SESION  NO. 3.pdf",
        "guias": [
          {
            "nombre": "Guía de clase",
            "ruta": "archivos\\Inter1\\s3\\Guia_Sesion3_Intermedio1.pdf"
          }
        ],
        "archivosExcel": [
          {
            "nombre": "Ejercicio",
            "ruta": "archivos\\Inter1\\s3\\Sesion3_Intermedio1_ALUMNO.xlsx"
          }
        ],
        "urls": []
      }
    ]
  }
];
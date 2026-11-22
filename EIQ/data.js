const appConfig = {
  profesor: "Ing. Jorge Rivera",
  institucion: "Dirección de Integración - Escuelas Integradoras",
  // Define aquí cuál mes quieres que aparezca seleccionado por defecto:
  mesActivo: "noviembre-2026",
  // Listado de meses para la barra de navegación (nav tabs):
  meses: [
    { id: "septiembre-2026", label: "Septiembre 2026", short: "Sep" },
    { id: "octubre-2026", label: "Octubre 2026", short: "Oct" },
    { id: "noviembre-2026", label: "Noviembre 2026", short: "Nov" }
  ]
};

const dataClases = {
  "septiembre-2026": {
    "sabado": {
      "taller1": {
        "nombre": "Organiza tu vida digital",
        "horario": "1:00 pm - 3:00 pm",
        "sesiones": [
          {
            "sesion": 1,
            "titulo": "Introducción al Entorno Digital",
            "fecha": "05-09-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": "",
            "urls": [],
            "imagenes": [],
            "extras": []
          }
        ]
      },
      "taller2": {
        "nombre": "Inteligencia Artificial para la Vida diaria",
        "horario": "3:00 pm - 5:00 pm",
        "sesiones": []
      }
    },
    "domingo": {
      "taller1": {
        "nombre": "Emprende con IA",
        "horario": "8:00 am - 10:00 am",
        "sesiones": [
          {
            "sesion": 3,
            "titulo": "Modelos de Negocio con IA y Excel",
            "fecha": "27-09-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía Taller 3: Sesión 3",
              "link": "archivos/sep/t3/Taller3_Sesion3_Septiembre.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Plantilla Excel: Vendedores",
                "link": "archivos/sep/t3/Guia_Excel_Vendedores.pdf"
              }
            ]
          }
        ]
      },
      "taller2": {
        "nombre": "Taller de Herramientas para el trabajo",
        "horario": "10:00 am - 12:00 pm",
        "sesiones": [
          {
            "sesion": 3,
            "titulo": "Productividad y Automatización de Tareas",
            "fecha": "27-09-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía Taller 4: Sesión 3",
              "link": "archivos/sep/t4/Taller4_Sesion3_Septiembre.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Plantilla Excel: Vendedores",
                "link": "archivos/sep/t3/Guia_Excel_Vendedores.pdf"
              }
            ]
          }
        ]
      }
    }
  },
  "octubre-2026": {
    "sabado": {
      "taller1": {
        "nombre": "Organiza tu vida digital",
        "horario": "1:00 pm - 3:00 pm",
        "sesiones": []
      },
      "taller2": {
        "nombre": "Inteligencia Artificial para la Vida diaria",
        "horario": "3:00 pm - 5:00 pm",
        "sesiones": []
      }
    },
    "domingo": {
      "taller1": {
        "nombre": "Emprende con IA",
        "horario": "8:00 am - 10:00 am",
        "sesiones": [
          {
            "sesion": 1,
            "titulo": "Exploración y Cartografía Celeste con Stellarium",
            "fecha": "04-10-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía Stellarium",
              "link": "archivos/oct/t3/s1/Taller3_Sesion1_Octubre_Stellarium.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Texto y Fecha",
                "link": "archivos/oct/t3/s1/Guia_Excel_Texto_Fecha.pdf"
              }
            ]
          },
          {
            "sesion": 2,
            "titulo": "Diseño de Entornos con CityCreator",
            "fecha": "11-10-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía CityCreator",
              "link": "archivos/oct/t3/s2/Taller3_Sesion2_Octubre_CityCreator.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Formato Condicional",
                "link": "archivos/oct/t3/s2/Guia_Excel_Formato_Condicional.pdf"
              }
            ]
          },
          {
            "sesion": 3,
            "titulo": "Generación Creativa con Bomomo y Sandspiel",
            "fecha": "18-10-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": {
              "nombre": "Presentación Bomomo & Sandspiel",
              "link": "archivos/oct/t3/s3/Taller3_Sesion3_Octubre_Bomomo_Sandspiel.pdf"
            },
            "guia": "",
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Tablas Dinámicas",
                "link": "archivos/oct/t3/s3/Guia_Excel_Tablas_Dinamicas.pdf"
              }
            ]
          },
          {
            "sesion": 4,
            "titulo": "Síntesis y Modulación de Voz con Speechma",
            "fecha": "25-10-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": {
              "nombre": "Presentación Speechma",
              "link": "archivos/oct/t3/s4/Taller3_Sesion4_Octubre_Speechma.pdf"
            },
            "guia": "",
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Gráficos Dinámicos",
                "link": "archivos/oct/t3/s4/Guia_Excel_Graficos_Dinamicos.pdf"
              }
            ]
          }
        ]
      },
      "taller2": {
        "nombre": "Taller de Herramientas para el trabajo",
        "horario": "10:00 am - 12:00 pm",
        "sesiones": [
          {
            "sesion": 1,
            "titulo": "Creatividad Digital con Thisissand",
            "fecha": "04-10-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía Thisissand",
              "link": "archivos/oct/t4/s1/Taller4_Sesion1_Octubre_Thisissand.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Texto y Fecha",
                "link": "archivos/oct/t4/s1/Guia_Excel_Texto_Fecha.pdf"
              }
            ]
          },
          {
            "sesion": 2,
            "titulo": "Modelado 3D con Blockbench (Parte 1)",
            "fecha": "11-10-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía Blockbench Parte 1",
              "link": "archivos/oct/t4/s2/Taller4_Sesion2_Octubre_Blockbench_Parte1.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Formato Condicional",
                "link": "archivos/oct/t4/s2/Guia_Excel_Formato_Condicional.pdf"
              }
            ]
          },
          {
            "sesion": 3,
            "titulo": "Gamificación y Lógica con JigsawPlanet",
            "fecha": "18-10-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía JigsawPlanet",
              "link": "archivos/oct/t4/s3/Taller4_Sesion3_Octubre_JigsawPlanet.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Tablas Dinámicas",
                "link": "archivos/oct/t4/s3/Guia_Excel_Tablas_Dinamicas.pdf"
              }
            ]
          },
          {
            "sesion": 4,
            "titulo": "Cartografía Histórica con OldMapsOnline",
            "fecha": "25-10-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía OldMapsOnline",
              "link": "archivos/oct/t4/s4/Taller4_Sesion4_Octubre_OldMapsOnline.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Gráficos Dinámicos",
                "link": "archivos/oct/t4/s4/Guia_Excel_Graficos_Dinamicos.pdf"
              }
            ]
          }
        ]
      }
    }
  },
  "noviembre-2026": {
    "sabado": {
      "taller1": {
        "nombre": "Organiza tu vida digital",
        "horario": "1:00 pm - 3:00 pm",
        "sesiones": []
      },
      "taller2": {
        "nombre": "Inteligencia Artificial para la Vida diaria",
        "horario": "3:00 pm - 5:00 pm",
        "sesiones": []
      }
    },
    "domingo": {
      "taller1": {
        "nombre": "Emprende con IA",
        "horario": "8:00 am - 10:00 am",
        "sesiones": [
          {
            "sesion": 1,
            "titulo": "Tipografía Dinámica con SpaceTypeGenerator",
            "fecha": "01-11-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía SpaceTypeGenerator",
              "link": "archivos/nov/t3/s1/Taller3_Sesion1_Noviembre_SpaceTypeGenerator.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Listas de Validación",
                "link": "archivos/nov/t3/s1/Guia_Excel_Listas_Validacion.pdf"
              }
            ]
          },
          {
            "sesion": 2,
            "titulo": "Generación de Terrenos con Terraink",
            "fecha": "08-11-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía Terraink",
              "link": "archivos/nov/t3/s2/Taller3_Sesion2_Noviembre_Terraink.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: SmartArt",
                "link": "archivos/nov/t3/s2/Guia_Excel_SmartArt.pdf"
              }
            ]
          },
          {
            "sesion": 3,
            "titulo": "Creación de una página web con Laboratorio Creativo",
            "fecha": "15-11-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía Laboratorio Creativo",
              "link": "archivos/nov/t3/s3/Taller3_Sesion3_Noviembre_LaboratorioCreativo.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Créditos y Amortización (Parte 1)",
                "link": "archivos/nov/t3/s3/Guia_Excel_Creditos_Amortizacion_Parte1.pdf"
              }
            ]
          },
          {
            "sesion": 4,
            "titulo": "Multi tipografias con Laboratorio Creativo",
            "fecha": "22-11-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía Laboratorio Creativo",
              "link": "archivos/nov/t3/s4/Guia_Taller3_S4_Animador_de_Texto.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Créditos y Amortización (Parte 2)",
                "link": "archivos/nov/t4/s3/Guia_Excel_Creditos_Amortizacion_Parte2.pdf"
              }
            ]
          }
        ]
      },
      "taller2": {
        "nombre": "Taller de Herramientas para el trabajo",
        "horario": "10:00 am - 12:00 pm",
        "sesiones": [
          {
            "sesion": 1,
            "titulo": "Conversión Vectorial con SVGConverter",
            "fecha": "01-11-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía SVG Converter",
              "link": "archivos/nov/t4/s1/Taller4_Sesion1_Noviembre_SVGConverter.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Listas de Validación",
                "link": "archivos/nov/t4/s1/Guia_Excel_Listas_Validacion.pdf"
              }
            ]
          },
          {
            "sesion": 2,
            "titulo": "Espacios y Trabajo Colaborativo con Gather Town",
            "fecha": "08-11-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía Gather Town",
              "link": "archivos/nov/t4/s2/Taller4_Sesion2_Noviembre_Gather.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: SmartArt",
                "link": "archivos/nov/t4/s2/Guia_Excel_SmartArt.pdf"
              }
            ]
          },
          {
            "sesion": 3,
            "titulo": "Creación de códigos de barras en Word",
            "fecha": "15-11-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía Códigos de Barras en Word",
              "link": "archivos/nov/t4/s3/Taller4_Sesion3_Noviembre_CodigosBarrasWord.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Créditos y Amortización (Parte 1)",
                "link": "archivos/nov/t4/s3/Guia_Excel_Creditos_Amortizacion_Parte1.pdf"
              }
            ]
          },
          {
            "sesion": 4,
            "titulo": "Creación de códigos de QRs en Word",
            "fecha": "15-11-2026",
            "disponible": true,
            "suspendida": false,
            "motivo_suspension_img": "",
            "presentacion": "",
            "guia": {
              "nombre": "Guía Códigos de QRs en Word",
              "link": "archivos/nov/t4/s3/Guia_Taller4_S4_Codigos_QR_en_Word.pdf"
            },
            "urls": [],
            "imagenes": [],
            "extras": [
              {
                "nombre": "Guía Excel: Créditos y Amortización (Parte 2)",
                "link": "archivos/nov/t4/s3/Guia_Excel_Creditos_Amortizacion_Parte2.pdf"
              }
            ]
          }
        ]
      }
    }
  }
};

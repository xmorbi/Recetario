import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const CATEGORIAS = [
  'principales',
  'sopas',
  'panes',
  'ensaladas',
  'dulces',
  'bebidas',
  'once',
  'sandwiches',
  'mar',
] as const;

const DIFICULTADES = ['muy fácil', 'fácil', 'media', 'alta'] as const;

// ===== Ingrediente v2 con regla anti-duplicado =====
// Si el nombre empieza con un número, casi siempre es un error de
// migración: la cantidad quedó duplicada entre "cantidad" y "nombre".
// Ej: { cantidad: 2, nombre: "0.5 tazas de arroz" } → error.
// Con esto, `astro build` (y por ende el CI) falla antes del deploy.
const ingredienteV2 = z
  .object({
    cantidad: z.number().nullable(),
    cantidadMax: z.number().nullable().optional(),
    unidad: z.string().nullable(),
    nombre: z.string(),
    nota: z.string().optional(),
    seccion: z.string().optional(),
    opcional: z.boolean().optional(),
    escalable: z.boolean().default(true),
    preparacion: z.string().optional(),
  })
  .superRefine((ing, ctx) => {
    if (/^\s*\d/.test(ing.nombre)) {
      ctx.addIssue({
        code: 'custom',
        message:
          `El nombre del ingrediente empieza con un número ("${ing.nombre}"). ` +
          `La cantidad debe ir en el campo "cantidad", no en "nombre".`,
        path: ['nombre'],
      });
    }
  });

const recetas = defineCollection({
  // En Astro 5, le decimos que busque todos los .json en la carpeta recetas
  loader: glob({ pattern: '**/*.json', base: './src/content/recetas' }),
  schema: z.object({
    titulo: z.string().min(3),
    categoria: z.enum(CATEGORIAS),
    tags: z.array(z.string()).default([]),
    imagen: z.string().nullable().optional(),
    tiempo: z.string(),
    porciones: z.string(),
    dificultad: z.enum(DIFICULTADES),
    tecnica: z.string().nullable().optional(),

    // --- CAMPOS HEREDADOS (Ahora opcionales para permitir la limpieza) ---
    ingredientes: z.array(z.string()).min(1).optional(),
    pasos: z.array(z.string()).min(1).optional(),
    timers: z
      .array(
        z.object({
          paso: z.number().int().min(1),
          minutos: z.number().positive(),
          etiqueta: z.string().optional(),
        })
      )
      .optional(),

    dato: z.string().nullable().optional(),
    advertencia: z.string().nullable().optional(),
    errores: z.array(z.object({ error: z.string(), solucion: z.string() })).default([]),
    conservacion: z
      .object({
        refrigerador: z.string().nullable().optional(),
        congelador: z.string().nullable().optional(),
        recalentar: z.string().nullable().optional(),
      })
      .default({}),

    // ===== FASE 10: campos estructurados (AHORA OBLIGATORIOS) =====
    ingredientes_v2: z.array(ingredienteV2),
    pasos_v2: z.array(
      z.object({
        texto: z.string(),
        timers: z
          .array(
            z.object({
              minutos: z.number().positive(),
              etiqueta: z.string().optional(),
            })
          )
          .optional(),
        ingredientes: z.array(z.number().int().min(1)).optional(),
      })
    ),
    tiempo_v2: z.object({
      preparacion: z.number().positive().optional(),
      coccion: z.number().positive().optional(),
      reposo: z.number().positive().optional(),
    }),
    revisado_v2: z.boolean(), // Forzamos a que siempre venga
  }),
});

export const collections = { recetas };
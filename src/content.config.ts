import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const CATEGORIAS = [
  'principales', 'sopas', 'panes', 'ensaladas', 'dulces',
  'bebidas', 'once', 'sandwiches', 'mar',
] as const;

const DIFICULTADES = ['muy fácil', 'fácil', 'media', 'alta'] as const;

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
    ingredientes: z.array(z.string()).min(1),
    pasos: z.array(z.string()).min(1),
    dato: z.string().nullable().optional(),
    advertencia: z.string().nullable().optional(),
    errores: z.array(z.object({ error: z.string(), solucion: z.string() })).default([]),
    conservacion: z.object({
      refrigerador: z.string().nullable().optional(),
      congelador: z.string().nullable().optional(),
      recalentar: z.string().nullable().optional(),
    }).default({}),
    timers: z.array(z.object({
      paso: z.number().int().min(1),
      minutos: z.number().positive(),
      etiqueta: z.string().optional(),
    })).optional(),
  }),
});

export const collections = { recetas };
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const recetas = defineCollection({
  // En Astro 5, le decimos que busque todos los .json en la carpeta recetas
  loader: glob({ pattern: '**/*.json', base: './src/content/recetas' }),
  schema: z.object({
    titulo: z.string(),
    categoria: z.string().default('principales'),
    tags: z.array(z.string()).optional().nullable(),
    imagen: z.string().nullable().optional(),
    tiempo: z.string().optional().nullable(),
    porciones: z.string().optional().nullable(),
    dificultad: z.string().optional().nullable(),
    tecnica: z.string().optional().nullable(),
    ingredientes: z.array(z.string()).default([]),
    pasos: z.array(z.string()).default([]),
    dato: z.string().optional().nullable(),
    advertencia: z.string().optional().nullable(),
    errores: z.any().optional().nullable(),
    conservacion: z.any().optional().nullable()
  })
});

export const collections = { recetas };
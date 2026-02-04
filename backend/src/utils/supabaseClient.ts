import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;

// Inicializar Supabase solo si la variable de entorno está configurada
let supabaseInstance: SupabaseClient;

if (supabaseUrl) {
  try {
    // Usar anon key si está disponible, sino usar placeholder
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Error al inicializar Supabase:', error);
    // Crear un cliente dummy para evitar errores de tipo
    supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-key');
  }
} else {
  console.warn(
    '⚠️  Supabase no está configurado. Configure SUPABASE_URL en las variables de entorno.'
  );
  // Crear un cliente dummy para evitar errores de inicialización
  // Las funciones que usen Supabase deberán verificar las variables de entorno
  supabaseInstance = createClient(
    'https://placeholder.supabase.co',
    'placeholder-key'
  );
}

// Función helper para verificar si Supabase está configurado
export function isSupabaseConfigured(): boolean {
  return !!process.env.SUPABASE_URL;
}

// Exportar el cliente
export const supabase = supabaseInstance;

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Inicializar Supabase solo si las variables de entorno están configuradas
let supabaseInstance: SupabaseClient;

if (supabaseUrl && supabaseKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Error al inicializar Supabase:', error);
    // Crear un cliente dummy para evitar errores de tipo
    supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-key');
  }
} else {
  console.warn(
    '⚠️  Supabase no está configurado. Configure SUPABASE_URL y SUPABASE_SERVICE_KEY en las variables de entorno.'
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
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

// Exportar el cliente
export const supabase = supabaseInstance;

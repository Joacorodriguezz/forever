const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Probando conexión a Supabase...');
    console.log('📍 URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    
    await prisma.$connect();
    console.log('✅ Conexión exitosa!');
    
    const result = await prisma.$queryRaw`SELECT current_database(), version()`;
    console.log('📊 Base de datos:', result);
    
    // Verificar tablas principales
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    console.log(`\n📋 Tablas encontradas (${tables.length}):`);
    tables.forEach(t => console.log(`  - ${t.table_name}`));
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    if (error.code === 'P1001') {
      console.log('\n💡 Posibles causas:');
      console.log('  1. No hay conexión a internet');
      console.log('  2. El proyecto de Supabase está pausado');
      console.log('  3. Las credenciales en .env son incorrectas');
      console.log('  4. Firewall bloqueando la conexión');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

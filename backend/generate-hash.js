const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('\n=== Hash generado ===');
  console.log('Contraseña:', password);
  console.log('Hash:', hash);
  console.log('\n=== SQL para actualizar ===');
  console.log(`UPDATE "cuentas_usuario" SET "password" = '${hash}' WHERE "email" = 'admin@foreverclub.com';`);
}

generateHash();

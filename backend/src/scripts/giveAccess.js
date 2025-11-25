const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Material = require('../models/Material');

dotenv.config();

const giveAccess = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB\n');

    // Buscar usuário teste
    const user = await User.findOne({ email: 'usuario@teste.com' });
    if (!user) {
      console.error('❌ Usuário teste não encontrado!');
      process.exit(1);
    }

    // Buscar material
    const material = await Material.findOne();
    if (!material) {
      console.error('❌ Nenhum material encontrado!');
      process.exit(1);
    }

    // Adicionar material ao usuário
    if (!user.ownedMaterials.includes(material._id)) {
      user.ownedMaterials.push(material._id);
      await user.save();
      console.log(`✅ Acesso concedido!`);
      console.log(`   Usuário: ${user.email}`);
      console.log(`   Material: ${material.title}\n`);
      console.log('🎉 Agora você pode acessar a apostila sem comprar!\n');
    } else {
      console.log('ℹ️  Usuário já tem acesso a este material.\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
};

giveAccess();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Material = require('../models/Material');

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Clear existing data (opcional - comente se não quiser limpar)
    // await User.deleteMany({});
    // await Material.deleteMany({});
    // console.log('🗑️  Dados anteriores removidos');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@apostilas.com' });
    
    if (!adminExists) {
      const admin = new User({
        name: 'Administrador',
        email: 'admin@apostilas.com',
        password: 'admin123', // Será hasheado automaticamente
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('✅ Usuário admin criado:');
      console.log('   Email: admin@apostilas.com');
      console.log('   Senha: admin123');
    } else {
      console.log('ℹ️  Usuário admin já existe');
    }

    // Create test user
    const userExists = await User.findOne({ email: 'usuario@teste.com' });
    
    if (!userExists) {
      const user = new User({
        name: 'Usuário Teste',
        email: 'usuario@teste.com',
        password: 'teste123',
        role: 'user',
        isActive: true
      });
      await user.save();
      console.log('✅ Usuário teste criado:');
      console.log('   Email: usuario@teste.com');
      console.log('   Senha: teste123');
    } else {
      console.log('ℹ️  Usuário teste já existe');
    }

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Faça login como admin para cadastrar materiais');
    console.log('2. Ou faça login como usuário teste para visualizar');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
};

seedDatabase();

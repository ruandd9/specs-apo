const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Material = require('../models/Material');
const User = require('../models/User');

dotenv.config();

const checkMaterials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB\n');

    const materials = await Material.find().populate('createdBy', 'name email');
    
    console.log(`📚 Total de materiais: ${materials.length}\n`);
    
    if (materials.length === 0) {
      console.log('⚠️  Nenhum material cadastrado ainda.\n');
    } else {
      materials.forEach((m, index) => {
        console.log(`${index + 1}. ${m.title}`);
        console.log(`   ID: ${m._id}`);
        console.log(`   Preço: R$ ${m.price.toFixed(2)}`);
        console.log(`   Páginas: ${m.imageCount || 'Processando...'}`);
        console.log(`   Status: ${m.isActive ? 'Ativo' : 'Inativo'}`);
        console.log(`   PDF: ${m.pdfPath}`);
        console.log(`   Imagens: ${m.imagePath || 'Não convertido ainda'}`);
        console.log(`   Criado por: ${m.createdBy?.name || 'N/A'}`);
        console.log(`   Data: ${new Date(m.createdAt).toLocaleString('pt-BR')}\n`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
};

checkMaterials();

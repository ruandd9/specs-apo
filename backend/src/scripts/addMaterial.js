const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load environment variables
dotenv.config();

const addMaterial = async () => {
  try {
    console.log('🚀 Iniciando cadastro de material...\n');

    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB\n');

    // Buscar usuário admin
    const User = require('../models/User');
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.error('❌ Nenhum usuário admin encontrado!');
      console.log('Execute: npm run seed');
      process.exit(1);
    }

    console.log(`✅ Admin encontrado: ${admin.email}\n`);

    // Gerar token JWT para o admin
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Dados do material
    const materialData = {
      title: 'Apostila Completa de Estudos',
      description: 'Material completo e atualizado para seus estudos. Conteúdo de alta qualidade com explicações detalhadas e exemplos práticos.',
      price: 49.90
    };

    // Verificar se há um PDF na pasta uploads
    const uploadsDir = path.join(__dirname, '../../uploads/pdfs');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.pdf'));
    
    if (files.length === 0) {
      console.log('⚠️  Nenhum PDF encontrado em uploads/pdfs/');
      console.log('\n📝 Para cadastrar uma apostila:');
      console.log('1. Coloque seu arquivo PDF em: backend/uploads/pdfs/');
      console.log('2. Execute novamente: npm run add-material\n');
      
      // Criar material sem PDF (apenas para teste)
      console.log('🔧 Criando material de teste sem PDF...\n');
      
      const Material = require('../models/Material');
      const testMaterial = new Material({
        title: materialData.title,
        description: materialData.description,
        price: materialData.price,
        pdfPath: 'uploads/pdfs/placeholder.pdf',
        imagePath: 'uploads/images/placeholder',
        imageCount: 0,
        createdBy: admin._id,
        isActive: true
      });
      
      await testMaterial.save();
      
      console.log('✅ Material de teste criado!');
      console.log(`   ID: ${testMaterial._id}`);
      console.log(`   Título: ${testMaterial.title}`);
      console.log(`   Preço: R$ ${testMaterial.price.toFixed(2)}`);
      console.log('\n⚠️  ATENÇÃO: Este material não tem PDF real!');
      console.log('   Adicione um PDF e recrie o material para funcionar completamente.\n');
      
      process.exit(0);
    }

    const pdfFile = files[0];
    const pdfPath = path.join(uploadsDir, pdfFile);
    
    console.log(`📄 PDF encontrado: ${pdfFile}`);
    console.log(`📊 Tamanho: ${(fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2)} MB\n`);

    // Criar FormData
    const form = new FormData();
    form.append('pdf', fs.createReadStream(pdfPath));
    form.append('title', materialData.title);
    form.append('description', materialData.description);
    form.append('price', materialData.price);

    console.log('📤 Enviando para API...\n');

    // Fazer requisição para API
    const response = await axios.post(
      'http://localhost:3000/api/materials',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ Material cadastrado com sucesso!\n');
    console.log('📋 Detalhes:');
    console.log(`   ID: ${response.data._id}`);
    console.log(`   Título: ${response.data.title}`);
    console.log(`   Preço: R$ ${response.data.price.toFixed(2)}`);
    console.log(`   Páginas: ${response.data.imageCount || 'Processando...'}`);
    console.log(`   Status: ${response.data.isActive ? 'Ativo' : 'Inativo'}\n`);

    if (response.data.imageCount === 0) {
      console.log('⏳ O PDF está sendo convertido em imagens...');
      console.log('   Isso pode levar alguns minutos dependendo do tamanho.\n');
    }

    console.log('🎉 Pronto! Você já pode acessar a apostila no site.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao cadastrar material:', error.message);
    if (error.response) {
      console.error('   Detalhes:', error.response.data);
    }
    process.exit(1);
  }
};

// Verificar se o servidor está rodando
const checkServer = async () => {
  try {
    await axios.get('http://localhost:3000');
    return true;
  } catch (error) {
    return false;
  }
};

const main = async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error('❌ Servidor backend não está rodando!');
    console.log('\n📝 Antes de executar este script:');
    console.log('1. Inicie o backend: cd backend && npm run dev');
    console.log('2. Em outro terminal, execute: npm run add-material\n');
    process.exit(1);
  }

  await addMaterial();
};

main();

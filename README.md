# Specs-Apo - Especificações e Ferramentas de Apoio

## 📖 Visualizador de PDF para Estudos

Este repositório inclui um visualizador de PDF completo criado com JavaScript e PDF.js, especialmente projetado para facilitar o estudo de apostilas e documentos.

## 🚀 Recursos Principais

### 📖 Visualização de PDF
- Carregamento de arquivos PDF locais
- Renderização de alta qualidade
- Suporte a documentos de qualquer tamanho

### 🔍 Recursos de Busca
- Busca de texto em todo o documento
- Navegação entre resultados de busca
- Destaque visual dos termos encontrados
- Busca case-insensitive

### 🔧 Controles de Visualização
- **Zoom**: Aumentar/diminuir zoom com botões ou Ctrl+Roda do mouse
- **Ajustar à largura**: Ajusta automaticamente o PDF à largura da tela
- **Navegação**: Anterior/próxima página com botões ou setas do teclado
- **Ir para página**: Digite o número da página diretamente

### 📑 Navegação Avançada
- Sidebar com índice do documento (se disponível)
- Navegação por bookmarks/marcadores
- Outline tree estruturado

### ⌨️ Atalhos de Teclado
- `←` / `→`: Navegar entre páginas
- `Ctrl + +` / `Ctrl + -`: Zoom in/out
- `Ctrl + F`: Focar na busca
- `Ctrl + Roda do Mouse`: Zoom

## 🚀 Como Usar o Visualizador de PDF

1. **Navegar para a pasta do visualizador**: `cd pdf-viewer`
2. **Abrir servidor local**: `python -m http.server 8080`
3. **Acessar**: http://localhost:8080
4. **Carregar PDF**: Clique em "📁 Abrir PDF" e selecione seu arquivo
5. **Navegar**: Use os controles da barra superior para navegar
6. **Buscar**: Digite na caixa de busca para encontrar texto específico
7. **Zoom**: Ajuste o zoom conforme necessário para leitura confortável

## 🎯 Ideal Para Estudos

Esta ferramenta foi especialmente projetada para estudantes que precisam:
- Ler apostilas e materiais de curso
- Buscar informações específicas rapidamente
- Navegar facilmente entre seções
- Trabalhar com documentos longos de forma eficiente

## 🔒 Privacidade

- Todos os PDFs são processados localmente no seu navegador
- Nenhum arquivo é enviado para servidores externos
- Funciona completamente offline após carregamento inicial

## 💡 Dicas de Uso

1. **Para documentos longos**: Use o índice na lateral esquerda para navegação rápida
2. **Para busca eficiente**: Use termos específicos para resultados mais precisos
3. **Para leitura confortável**: Use "Ajustar à largura" para otimizar a visualização
4. **Para estudos intensivos**: Use Ctrl+F para busca rápida de conceitos

## 📁 Estrutura do Projeto

- `/pdf-viewer/` - Visualizador de PDF para estudos
  - `index.html` - Interface principal
  - `app.js` - Lógica do visualizador PDF.js
  - `styles.css` - Estilos responsivos
- Outros arquivos de especificações do projeto...

---

**Tecnologias utilizadas**: HTML5, CSS3, JavaScript ES6+, PDF.js (Mozilla)
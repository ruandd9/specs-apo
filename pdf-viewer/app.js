// Configuração do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

class PDFViewer {
    constructor() {
        this.pdfDoc = null;
        this.pageNum = 1;
        this.pageCount = 0;
        this.scale = 1.0;
        this.rotation = 0;
        this.searchMatches = [];
        this.currentMatch = -1;
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        // Elementos do DOM
        this.canvas = document.getElementById('pdfCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fileInput = document.getElementById('fileInput');
        this.openFileBtn = document.getElementById('openFile');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        this.pageNumInput = document.getElementById('pageNum');
        this.pageCountSpan = document.getElementById('pageCount');
        this.zoomInBtn = document.getElementById('zoomIn');
        this.zoomOutBtn = document.getElementById('zoomOut');
        this.fitWidthBtn = document.getElementById('fitWidth');
        this.zoomLevelSpan = document.getElementById('zoomLevel');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.prevMatchBtn = document.getElementById('prevMatch');
        this.nextMatchBtn = document.getElementById('nextMatch');
        this.textLayer = document.getElementById('textLayer');
        this.searchLayer = document.getElementById('searchLayer');
        this.viewerContainer = document.getElementById('viewerContainer');
        this.loadingMessage = document.getElementById('loadingMessage');
        this.sidebar = document.getElementById('sidebar');
        this.toggleSidebarBtn = document.getElementById('toggleSidebar');
        this.outlineContainer = document.getElementById('outlineContainer');
    }
    
    setupEventListeners() {
        // File input
        this.openFileBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Navigation
        this.prevPageBtn.addEventListener('click', () => this.previousPage());
        this.nextPageBtn.addEventListener('click', () => this.nextPage());
        this.pageNumInput.addEventListener('change', () => this.goToPage());
        this.pageNumInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.goToPage();
        });
        
        // Zoom
        this.zoomInBtn.addEventListener('click', () => this.zoomIn());
        this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        this.fitWidthBtn.addEventListener('click', () => this.fitToWidth());
        
        // Search
        this.searchBtn.addEventListener('click', () => this.searchText());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchText();
        });
        this.prevMatchBtn.addEventListener('click', () => this.previousMatch());
        this.nextMatchBtn.addEventListener('click', () => this.nextMatch());
        
        // Sidebar
        this.toggleSidebarBtn.addEventListener('click', () => this.toggleSidebar());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Wheel zoom
        this.viewerContainer.addEventListener('wheel', (e) => this.handleWheel(e));
    }
    
    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file || file.type !== 'application/pdf') {
            alert('Por favor, selecione um arquivo PDF válido.');
            return;
        }
        
        try {
            this.loadingMessage.innerHTML = '<h2>📖 Carregando PDF...</h2><p>Por favor, aguarde...</p>';
            
            const arrayBuffer = await file.arrayBuffer();
            this.pdfDoc = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            this.pageCount = this.pdfDoc.numPages;
            this.pageNum = 1;
            
            this.updatePageInfo();
            await this.renderPage();
            await this.loadOutline();
            this.hideLoadingMessage();
            
            console.log(`PDF carregado com sucesso: ${this.pageCount} páginas`);
        } catch (error) {
            console.error('Erro ao carregar PDF:', error);
            alert('Erro ao carregar o arquivo PDF. Verifique se o arquivo não está corrompido.');
        }
    }
    
    async renderPage() {
        if (!this.pdfDoc) return;
        
        try {
            const page = await this.pdfDoc.getPage(this.pageNum);
            const viewport = page.getViewport({scale: this.scale, rotation: this.rotation});
            
            // Configure canvas
            this.canvas.width = viewport.width;
            this.canvas.height = viewport.height;
            this.canvas.style.width = viewport.width + 'px';
            this.canvas.style.height = viewport.height + 'px';
            
            // Render page
            const renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
            
            // Render text layer for text selection and search
            await this.renderTextLayer(page, viewport);
            
            this.updateNavigationState();
            
        } catch (error) {
            console.error('Erro ao renderizar página:', error);
        }
    }
    
    async renderTextLayer(page, viewport) {
        // Clear previous text layer
        this.textLayer.innerHTML = '';
        this.textLayer.style.width = viewport.width + 'px';
        this.textLayer.style.height = viewport.height + 'px';
        
        try {
            const textContent = await page.getTextContent();
            
            // Create text layer div
            const textLayerDiv = document.createElement('div');
            textLayerDiv.className = 'text-layer';
            textLayerDiv.style.width = viewport.width + 'px';
            textLayerDiv.style.height = viewport.height + 'px';
            
            // Render text content
            pdfjsLib.renderTextLayer({
                textContent: textContent,
                container: this.textLayer,
                viewport: viewport,
                textDivs: []
            });
            
        } catch (error) {
            console.error('Erro ao renderizar camada de texto:', error);
        }
    }
    
    updatePageInfo() {
        this.pageNumInput.value = this.pageNum;
        this.pageCountSpan.textContent = this.pageCount;
        this.pageNumInput.max = this.pageCount;
    }
    
    updateNavigationState() {
        this.prevPageBtn.disabled = this.pageNum <= 1;
        this.nextPageBtn.disabled = this.pageNum >= this.pageCount;
        this.zoomLevelSpan.textContent = Math.round(this.scale * 100) + '%';
    }
    
    hideLoadingMessage() {
        this.loadingMessage.style.display = 'none';
    }
    
    // Navigation methods
    async previousPage() {
        if (this.pageNum > 1) {
            this.pageNum--;
            this.updatePageInfo();
            await this.renderPage();
            this.clearSearch();
        }
    }
    
    async nextPage() {
        if (this.pageNum < this.pageCount) {
            this.pageNum++;
            this.updatePageInfo();
            await this.renderPage();
            this.clearSearch();
        }
    }
    
    async goToPage() {
        const page = parseInt(this.pageNumInput.value);
        if (page >= 1 && page <= this.pageCount && page !== this.pageNum) {
            this.pageNum = page;
            await this.renderPage();
            this.clearSearch();
        } else {
            this.pageNumInput.value = this.pageNum;
        }
    }
    
    // Zoom methods
    async zoomIn() {
        this.scale = Math.min(this.scale * 1.2, 5.0);
        await this.renderPage();
    }
    
    async zoomOut() {
        this.scale = Math.max(this.scale / 1.2, 0.1);
        await this.renderPage();
    }
    
    async fitToWidth() {
        if (!this.pdfDoc) return;
        
        const page = await this.pdfDoc.getPage(this.pageNum);
        const viewport = page.getViewport({scale: 1.0});
        
        const containerWidth = this.viewerContainer.clientWidth - 40; // padding
        this.scale = containerWidth / viewport.width;
        await this.renderPage();
    }
    
    // Search methods
    async searchText() {
        const searchTerm = this.searchInput.value.trim();
        if (!searchTerm || !this.pdfDoc) return;
        
        this.clearSearch();
        this.searchMatches = [];
        
        try {
            for (let pageIndex = 1; pageIndex <= this.pageCount; pageIndex++) {
                const page = await this.pdfDoc.getPage(pageIndex);
                const textContent = await page.getTextContent();
                
                let pageText = '';
                textContent.items.forEach(item => {
                    pageText += item.str + ' ';
                });
                
                const regex = new RegExp(searchTerm, 'gi');
                let match;
                while ((match = regex.exec(pageText)) !== null) {
                    this.searchMatches.push({
                        page: pageIndex,
                        index: match.index,
                        text: match[0]
                    });
                }
            }
            
            if (this.searchMatches.length > 0) {
                this.currentMatch = 0;
                await this.goToSearchMatch();
            } else {
                alert(`Texto "${searchTerm}" não encontrado no documento.`);
            }
            
        } catch (error) {
            console.error('Erro na busca:', error);
        }
    }
    
    async goToSearchMatch() {
        if (this.searchMatches.length === 0 || this.currentMatch < 0) return;
        
        const match = this.searchMatches[this.currentMatch];
        if (match.page !== this.pageNum) {
            this.pageNum = match.page;
            this.updatePageInfo();
            await this.renderPage();
        }
        
        this.highlightSearchResults();
    }
    
    async highlightSearchResults() {
        const searchTerm = this.searchInput.value.trim();
        if (!searchTerm) return;
        
        this.clearSearchHighlights();
        
        try {
            const page = await this.pdfDoc.getPage(this.pageNum);
            const textContent = await page.getTextContent();
            const viewport = page.getViewport({scale: this.scale, rotation: this.rotation});
            
            let textItems = textContent.items;
            let searchRegex = new RegExp(searchTerm, 'gi');
            
            // Find all matches in current page
            textItems.forEach((item, index) => {
                let matches = [...item.str.matchAll(searchRegex)];
                
                matches.forEach(match => {
                    // Create highlight element
                    const highlight = document.createElement('div');
                    highlight.className = 'search-highlight';
                    
                    // Calculate position based on text item transform
                    const transform = pdfjsLib.Util.transform(
                        viewport.transform,
                        item.transform
                    );
                    
                    const x = transform[4];
                    const y = transform[5];
                    const width = item.width * this.scale;
                    const height = item.height * this.scale;
                    
                    highlight.style.left = x + 'px';
                    highlight.style.top = (viewport.height - y) + 'px';
                    highlight.style.width = width + 'px';
                    highlight.style.height = height + 'px';
                    
                    this.searchLayer.appendChild(highlight);
                });
            });
            
            // Update search status
            if (this.searchMatches.length > 0) {
                console.log(`Mostrando resultado ${this.currentMatch + 1} de ${this.searchMatches.length} para "${searchTerm}"`);
            }
            
        } catch (error) {
            console.error('Erro ao destacar resultados:', error);
        }
    }
    
    clearSearchHighlights() {
        this.searchLayer.innerHTML = '';
    }
    
    async previousMatch() {
        if (this.searchMatches.length === 0) return;
        
        this.currentMatch = this.currentMatch > 0 ? this.currentMatch - 1 : this.searchMatches.length - 1;
        await this.goToSearchMatch();
    }
    
    async nextMatch() {
        if (this.searchMatches.length === 0) return;
        
        this.currentMatch = this.currentMatch < this.searchMatches.length - 1 ? this.currentMatch + 1 : 0;
        await this.goToSearchMatch();
    }
    
    clearSearch() {
        this.clearSearchHighlights();
        this.searchMatches = [];
        this.currentMatch = -1;
    }
    
    // Outline/Bookmarks
    async loadOutline() {
        try {
            const outline = await this.pdfDoc.getOutline();
            this.renderOutline(outline);
        } catch (error) {
            console.error('Erro ao carregar índice:', error);
            this.outlineContainer.innerHTML = '<p class="no-outline">Índice não disponível neste PDF</p>';
        }
    }
    
    renderOutline(outline) {
        if (!outline || outline.length === 0) {
            this.outlineContainer.innerHTML = '<p class="no-outline">Este PDF não possui índice</p>';
            return;
        }
        
        this.outlineContainer.innerHTML = '';
        this.createOutlineItems(outline, this.outlineContainer, 0);
    }
    
    createOutlineItems(items, container, level) {
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = `outline-item level-${level}`;
            div.textContent = item.title;
            
            if (item.dest) {
                div.style.cursor = 'pointer';
                div.addEventListener('click', async () => {
                    try {
                        const dest = await this.pdfDoc.getDestination(item.dest);
                        if (dest) {
                            const pageRef = dest[0];
                            const pageIndex = await this.pdfDoc.getPageIndex(pageRef);
                            this.pageNum = pageIndex + 1;
                            this.updatePageInfo();
                            await this.renderPage();
                        }
                    } catch (error) {
                        console.error('Erro ao navegar para o destino:', error);
                    }
                });
            }
            
            container.appendChild(div);
            
            if (item.items && item.items.length > 0) {
                this.createOutlineItems(item.items, container, level + 1);
            }
        });
    }
    
    // Sidebar
    toggleSidebar() {
        this.sidebar.classList.toggle('hidden');
        this.toggleSidebarBtn.textContent = this.sidebar.classList.contains('hidden') ? '▶' : '◀';
    }
    
    // Keyboard shortcuts
    handleKeyboard(event) {
        if (!this.pdfDoc) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                if (!event.target.matches('input')) {
                    event.preventDefault();
                    this.previousPage();
                }
                break;
            case 'ArrowRight':
                if (!event.target.matches('input')) {
                    event.preventDefault();
                    this.nextPage();
                }
                break;
            case '=':
            case '+':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.zoomIn();
                }
                break;
            case '-':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.zoomOut();
                }
                break;
            case 'f':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.searchInput.focus();
                }
                break;
        }
    }
    
    // Mouse wheel zoom
    handleWheel(event) {
        if (event.ctrlKey) {
            event.preventDefault();
            
            if (event.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        }
    }
}

// Initialize the PDF viewer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const viewer = new PDFViewer();
    
    // Make viewer globally accessible for debugging
    window.pdfViewer = viewer;
});
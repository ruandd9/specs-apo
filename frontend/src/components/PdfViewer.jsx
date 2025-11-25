import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import './PdfViewer.css';

// Configurar worker do PDF.js usando URL do unpkg
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const PdfViewer = ({ pdfUrl, watermarkText, title }) => {
  const [pdf, setPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1.0);
  const canvasRef = useRef(null);

  // Carregar PDF
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar PDF:', err);
        setError('Falha ao carregar PDF');
        setLoading(false);
      }
    };

    if (pdfUrl) {
      loadPdf();
    }
  }, [pdfUrl]);

  // Renderizar página
  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;

      try {
        const page = await pdf.getPage(currentPage);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const viewport = page.getViewport({ scale: zoom });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Adicionar watermark
        if (watermarkText) {
          context.save();
          context.globalAlpha = 0.3;
          context.font = '20px Arial';
          context.fillStyle = 'gray';
          context.textAlign = 'center';
          
          // Watermark no centro
          context.fillText(
            watermarkText,
            canvas.width / 2,
            canvas.height / 2
          );
          
          // Watermark no rodapé
          context.fillText(
            watermarkText,
            canvas.width / 2,
            canvas.height - 30
          );
          
          context.restore();
        }
      } catch (err) {
        console.error('Erro ao renderizar página:', err);
      }
    };

    renderPage();
  }, [pdf, currentPage, zoom, watermarkText]);

  // Navegação com teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === '+' && e.ctrlKey) {
        e.preventDefault();
        zoomIn();
      }
      if (e.key === '-' && e.ctrlKey) {
        e.preventDefault();
        zoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, zoom]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    const pageNum = parseInt(page);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const zoomIn = () => {
    if (zoom < 3.0) setZoom(zoom + 0.2);
  };

  const zoomOut = () => {
    if (zoom > 0.5) setZoom(zoom - 0.2);
  };

  const resetZoom = () => {
    setZoom(1.0);
  };

  if (loading) {
    return <div className="pdf-loading">Carregando PDF...</div>;
  }

  if (error) {
    return <div className="pdf-error">{error}</div>;
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-header">
        <h2>{title}</h2>
        <div className="page-info">
          Página {currentPage} de {totalPages}
        </div>
      </div>

      <div className="pdf-controls">
        <div className="navigation-controls">
          <button
            className="btn btn-secondary"
            onClick={prevPage}
            disabled={currentPage === 1}
            title="Página Anterior (←)"
          >
            ← Anterior
          </button>

          <div className="page-selector">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => goToPage(e.target.value)}
              className="page-input"
            />
            <span> / {totalPages}</span>
          </div>

          <button
            className="btn btn-secondary"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            title="Próxima Página (→)"
          >
            Próxima →
          </button>
        </div>

        <div className="zoom-controls">
          <button
            className="btn btn-sm"
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            title="Diminuir Zoom (Ctrl + -)"
          >
            -
          </button>
          <span className="zoom-level">{Math.round(zoom * 100)}%</span>
          <button
            className="btn btn-sm"
            onClick={zoomIn}
            disabled={zoom >= 3.0}
            title="Aumentar Zoom (Ctrl + +)"
          >
            +
          </button>
          <button className="btn btn-sm" onClick={resetZoom} title="Resetar Zoom">
            Reset
          </button>
        </div>
      </div>

      <div className="pdf-content" onContextMenu={(e) => e.preventDefault()}>
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            height: 'auto',
            userSelect: 'none',
          }}
        />
      </div>

      <div className="pdf-footer">
        <p className="help-text">
          💡 Use as setas ← → para navegar | Ctrl + / - para zoom
        </p>
        <p className="watermark-notice">
          Este documento está protegido e marcado com suas informações
        </p>
      </div>
    </div>
  );
};

export default PdfViewer;

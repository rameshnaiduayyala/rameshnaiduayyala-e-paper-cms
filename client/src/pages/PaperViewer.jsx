import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { ServiceUrl } from "../settings";
import api from "../api/axios";
import { useSwipeable } from "react-swipeable";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";

const PaperViewer = () => {
  const { id } = useParams();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/papers/${id}/pages`);
        setPages(res.data);
      } catch (err) {
        console.error("❌ Failed to load pages:", err);
        setError("Failed to load document. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, [id]);

  const handlePageChange = useCallback(
    (index) => {
      if (index < 0) index = 0;
      if (index >= pages.length) index = pages.length - 1;
      setCurrentPage(index);
      setImageLoading(true);
      // Reset zoom and rotation when changing pages
      setZoomLevel(1);
      setRotation(0);
    },
    [pages.length]
  );

  const goToNextPage = useCallback(() => {
    handlePageChange(currentPage + 1);
  }, [currentPage, handlePageChange]);

  const goToPrevPage = useCallback(() => {
    handlePageChange(currentPage - 1);
  }, [currentPage, handlePageChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") goToNextPage();
      if (e.key === "ArrowLeft") goToPrevPage();
      if (e.key === "Escape") setSidebarOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNextPage,
    onSwipedRight: goToPrevPage,
    trackMouse: true,
  });

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const downloadPage = () => {
    if (!pages[currentPage]) return;

    const link = document.createElement("a");
    link.href = `${ServiceUrl}/uploads/${pages[currentPage].pdfPagePath}`;
    link.download = `page-${pages[currentPage].pageNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading document...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!pages.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No pages found for this document.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen mt-16">
      {/* Sidebar Thumbnails */}
      <aside
        className={`fixed md:relative z-20 bg-gray-100 border-r p-2 overflow-y-auto transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-28 h-full`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm">Pages</h3>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => {
                handlePageChange(index);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              className={`block w-full rounded-lg overflow-hidden border-2 ${
                currentPage === index ? "border-blue-500" : "border-transparent"
              }`}
            >
              <img
                src={`${ServiceUrl}${page.imagePath}`}
                alt={`Thumb ${page.pageNumber}`}
                className="w-full hover:opacity-80 transition-opacity"
                loading="lazy"
              />
              <div className="text-xs text-center mt-1">
                Page {page.pageNumber}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="fixed top-20 left-2 md:hidden z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-gray-200 rounded-full shadow hover:bg-gray-300 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Main Page Viewer */}
      <main
        {...swipeHandlers}
        className="flex-1 flex flex-col items-center justify-start overflow-y-auto bg-gray-50 p-4 relative"
      >
        {/* Page Navigation and Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mb-4 gap-2">
          {/* Page Number Buttons */}
          <div className="flex overflow-x-auto space-x-2 w-full md:w-auto">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => handlePageChange(index)}
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  currentPage === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {page.pageNumber}
              </button>
            ))}
          </div>

          {/* Page Navigation and Tools */}
        </div>

        {/* Current Page with Frame */}
        {pages[currentPage] && (
          <div className="relative flex justify-center items-center w-full max-w-4xl">
            {/* Left Arrow for large screens */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className="absolute -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-10 hidden md:flex disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="border-4 border-gray-300 rounded shadow-lg w-full relative overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              <img
                ref={imageRef}
                src={`${ServiceUrl}${pages[currentPage].imagePath}`}
                alt={`Page ${pages[currentPage].pageNumber}`}
                className="w-full rounded transition-opacity duration-300"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  opacity: imageLoading ? 0 : 1,
                }}
                onLoad={handleImageLoad}
                loading="lazy"
              />
              <a
                href={`${ServiceUrl}/uploads/${pages[currentPage].pdfPagePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 text-xs text-white bg-black bg-opacity-70 px-2 py-1 rounded hover:bg-opacity-90 transition-all"
              >
                View PDF
              </a>
            </div>

            {/* Right Arrow for large screens */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === pages.length - 1}
              className="absolute right-[-40px] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-10 hidden md:flex disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-white rounded-lg shadow">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className="p-2 rounded-l-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-3 py-2 border-l border-r border-gray-200">
              <span className="text-sm font-medium">
                {currentPage + 1} / {pages.length}
              </span>
            </div>
            <button
              onClick={goToNextPage}
              disabled={currentPage === pages.length - 1}
              className="p-2 rounded-r-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex bg-white rounded-lg shadow">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="p-2 rounded-l-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-2 rounded-r-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaperViewer;

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { ServiceUrl } from "../settings";
import { motion } from "framer-motion";

function PaperViewer() {
  const { id } = useParams();
  const [pages, setPages] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const mainContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);

  useEffect(() => {
    api
      .get(`/papers/${id}/pages`)
      .then((res) => setPages(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // Scroll sync: highlight current visible page thumbnail
  const handleScroll = () => {
    if (!mainContainerRef.current) return;
    const scrollTop = mainContainerRef.current.scrollTop;
    let closestIndex = 0;
    let minDistance = Infinity;

    pages.forEach((page, idx) => {
      const el = document.getElementById(`page-${page.id}`);
      if (el) {
        const distance = Math.abs(el.offsetTop - scrollTop);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      }
    });

    if (closestIndex !== activePageIndex) {
      setActivePageIndex(closestIndex);
      // Scroll thumbnail into view
      if (thumbnailRefs.current[closestIndex]) {
        thumbnailRefs.current[closestIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleFullScreen = () => {
    const elem = mainContainerRef.current;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  };
  const scrollToPage = (index) => {
    const el = document.getElementById(`page-${pages[index].id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const goPrev = () => scrollToPage(Math.max(activePageIndex - 1, 0));
  const goNext = () =>
    scrollToPage(Math.min(activePageIndex + 1, pages.length - 1));

  return (
    <div className="flex h-screen pt-14">
      {/* Left Thumbnails */}
      <div className="w-64 overflow-y-auto border-r border-gray-200 p-2 bg-gray-50">
        {pages.map((page, idx) => (
          <div
            key={page.id}
            ref={(el) => (thumbnailRefs.current[idx] = el)}
            className={`mb-3 cursor-pointer rounded transition-all ${
              activePageIndex === idx
                ? "border-2 border-blue-500 shadow-lg"
                : "hover:shadow-md"
            }`}
            onClick={() => scrollToPage(idx)}
          >
            <img
              src={`${ServiceUrl}${page.imagePath}`}
              alt={`Page ${page.pageNumber}`}
              className="rounded w-full"
            />
            <p className="text-center text-sm mt-1">Page {page.pageNumber}</p>
          </div>
        ))}
      </div>

      {/* Main Pages */}
      <div
        ref={mainContainerRef}
        onScroll={handleScroll}
        className="flex-1 relative overflow-y-auto p-4"
      >
        {pages.map((page) => (
          <motion.img
            key={page.id}
            id={`page-${page.id}`}
            src={`${ServiceUrl}${page.imagePath}`}
            alt={`Page ${page.pageNumber}`}
            className="shadow-xl rounded-lg mb-6 w-full max-w-5xl mx-auto"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}

        {/* Floating Right Controls */}
        <div className="fixed top-32 right-2 flex flex-col gap-2 z-50">
          <button
            className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            +
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            −
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
            onClick={handleFullScreen}
            title="Full Screen"
          >
            ⛶
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-md shadow-md hover:bg-gray-300 transition disabled:opacity-50"
            onClick={goPrev}
            disabled={activePageIndex === 0}
            title="Previous Page"
          >
            ←
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-md shadow-md hover:bg-gray-300 transition disabled:opacity-50"
            onClick={goNext}
            disabled={activePageIndex === pages.length - 1}
            title="Next Page"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaperViewer;

import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfComp = ({ fileUrl }) => {
  // Plugin with NO sidebar (faster load)
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    // sidebarTabs: (defaultTabs) =>
    //   defaultTabs.filter(
    //     (tab) => tab.content && tab.content.type === "thumbnail"
    //   ),
    setInitialTab: () => Promise.resolve(0),
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const {
            EnterFullScreen,
            GoToNextPage,
            GoToPreviousPage,
            ZoomIn,
            ZoomOut,
          } = slots;
          return (
            <div className="flex flex-wrap items-center gap-2 px-2 py-1 bg-gray-100 border-b text-sm md:text-base">
              <GoToPreviousPage />
              <GoToNextPage />
              <span className="mx-1">|</span>
              <ZoomOut />
              <ZoomIn />
              <span className="flex-1" />
              <EnterFullScreen />
            </div>
          );
        }}
      </Toolbar>
    ),
  });

  return (
    <div className="w-full h-screen overflow-x-hidden">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          defaultScale={SpecialZoomLevel.PageWidth} // Fit to width
          renderLoader={(percentages) => (
            <div className="flex justify-center items-center h-full text-gray-600">
              <p>Loading PDF... {Math.round(percentages)}%</p>
            </div>
          )}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  );
};

export default PdfComp;

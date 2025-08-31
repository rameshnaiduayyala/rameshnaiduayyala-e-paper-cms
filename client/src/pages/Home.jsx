import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ServiceUrl } from "../settings";

function Home() {
  const [papers, setPapers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedDate) return;

    api
      .get(`/papers?date=${selectedDate}`)
      .then((res) => setPapers(res.data))
      .catch((err) => console.error(err));
  }, [selectedDate]);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-20">
      <div className="flex justify-end mb-5 ">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {papers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 h-full mb-20">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="cursor-pointer group flex flex-col items-center text-center bg-white p-2 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200"
              onClick={() => navigate(`/paper/${paper.id}`)}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {paper.title}
              </h3>

              {paper.thumbnail ? (
                <div className="overflow-hidden">
                  <img
                    src={`${ServiceUrl}${paper.thumbnail}`}
                    alt={paper.title}
                    className="w-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-64 max-w-xs bg-gray-100 flex items-center justify-center rounded-xl">
                  <span className="text-gray-400">No Preview</span>
                </div>
              )}

              <p className="text-gray-500 mt-3">{paper.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-16">
          No papers available for {selectedDate}
        </p>
      )}
    </div>
  );
}

export default Home;

import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../api/axios";
import { ServiceUrl } from "../settings";

function Home() {
  const [papers, setPapers] = useState([]);
  const { selectedDate } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedDate) return;
    console.log("🔄 Fetching papers for:", selectedDate);

    api
      .get(`/papers?date=${selectedDate}`)
      .then((res) => setPapers(res.data))
      .catch((err) => console.error(err));
  }, [selectedDate]);

  return (
    <div className="w-full px-6 pt-20 flex justify-center">
      {papers.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="cursor-pointer group flex flex-col items-center text-center bg-white p-3 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 max-w-[280px]"
              onClick={() => navigate(`/paper/${paper.id}`)}
            >
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {paper.title}
              </h3>

              {paper.thumbnail ? (
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={`${ServiceUrl}${paper.thumbnail}`}
                    alt={paper.title}
                    className="w-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">No Preview</span>
                </div>
              )}

              <p className="text-gray-500 mt-2 text-sm">{paper.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No papers available for {selectedDate}
        </p>
      )}
    </div>
  );
}

export default Home;

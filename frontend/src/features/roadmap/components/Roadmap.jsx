import React from "react";
import roadmapData from "../data/roadmap.json"; // ajuste le chemin selon ton projet

const statusColors = {
  done: "bg-green-500 border-green-500",
  "in-progress": "bg-blue-500 border-blue-500",
  planned: "bg-yellow-400 border-yellow-400",
  idea: "bg-gray-400 border-gray-400",
};

export default function Roadmap() {
  const { version, lastUpdate, sections } = roadmapData;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-10 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-semibold text-gray-800">Project Roadmap</h1>
        <p className="text-sm text-gray-500">
          Version {version} • Last update:{" "}
          {new Date(lastUpdate).toLocaleDateString()}
        </p>
      </header>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-300"></div>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <div key={index} className="relative pl-10">
              {/* Point */}
              <span
                className={`absolute left-[0.625rem] top-1 w-3.5 h-3.5 rounded-full border-2 ${statusColors[section.status]}`}
              ></span>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-medium text-gray-800">
                    {section.phase}
                  </h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full text-white capitalize ${
                      section.status === "done"
                        ? "bg-green-500"
                        : section.status === "in-progress"
                        ? "bg-blue-500"
                        : section.status === "planned"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {section.status.replace("-", " ")}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-2">
                  {section.description}
                </p>

                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {section.tasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { React, useState,  version } from "react";
import roadmapData from "../data/roadmap.json"; // ajuste le chemin selon ton projet

const statusColors = {
  done: "bg-green-500 border-green-500 text-green-100",
  "in-progress": "bg-blue-500 border-blue-500 text-blue-100",
  planned: "bg-yellow-400 border-yellow-400 text-yellow-100",
  bug:"bg-red-400 border-red-400 text-red-100",
  idea: "bg-gray-400 border-gray-400 text-gray-100",
};

export default function Roadmap() {
  const { sections } = roadmapData;

function toggleTaskStatus(sectionIndex, taskIndex) {
  const task = roadmapData.sections[sectionIndex].tasks[taskIndex];
  task.status = task.status === "done" ? "todo" : "done";

  // envoyer la mise à jour au serveur
  fetch("/update-task", {
    method: "POST",
    body: JSON.stringify({ sectionIndex, taskIndex, status: task.status }),
    headers: { "Content-Type": "application/json" }
  });
}

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Timeline */}
      <div className="relative z-[1]">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-300 z-0"></div>


        <div className="space-y-10">
          {sections.map((section, index) => (
            <div key={index} className=" relative z-0 pl-10">
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
                        : section.status === "todo"
                        ? "bg-yellow-300"
                        : section.status === "bug"
                        ? "bg-red-500"                        
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
    <li key={i} className="flex items-center gap-2 cursor-pointer" 
        onClick={() => toggleTaskStatus(index, i)}>
      <span
        className={`inline-flex items-center rounded-md 
         px-2 py-1 
        text-xs font-medium inset-ring inset-ring-gray-400/20 
        ${
          task.status === "done"
            ? "bg-green-500 text-green-100"
            : task.status === "in-progress"
            ? "bg-blue-500 text-blue-100"
            : task.status === "planned"
            ? "bg-yellow-500 text-yellow-100"
            : task.status === "todo"
            ? "bg-yellow-300  text-yellow-900"
            : task.status === "bug"
            ? "bg-red-500  text-red-100"                        
            : "bg-gray-400  text-gray-100"
        }`}
      >
        {task.status}
      </span>
      <span>{task.title}</span>
    </li>
  ))}
</ul>

              </div>
            </div>

          ))}
          
        </div>

      </div>
        <footer className="mt-10 text-sm text-center">
          <div className="text-gray-600">v{roadmapData.version} {roadmapData.status}</div>
          <div className="text-gray-400">Last Update : {roadmapData.lastUpdate}</div>
        </footer>
    </div>
  );
}

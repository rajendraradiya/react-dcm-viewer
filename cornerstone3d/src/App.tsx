import { useState } from "react";
import "./App.css";
import CornerstoneViewer from "./CornerstoneViewer";

function App() {
  const [fileUrl, setFileUrl] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    const url: any = URL.createObjectURL(file);
    setFileUrl(url);
    setFileName(file.name);
  };

  return (
    <div className=" flex flex-col items-center justify-between bg-gray-100 p-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800">cornerstone 3D Viewer</h1>

      {/* File Upload Input */}
      <div className="flex flex-col items-center mt-8">
        <label className="mb-2 text-lg text-gray-700" htmlFor="fileUpload">
          Upload a file:
        </label>
        <input
          type="file"
          accept=".dcm"
          onChange={handleFileChange}
          id="fileUpload"
          className="border border-gray-300 rounded px-4 py-2 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
        />
      </div>

      {/* Bottom Box */}
      <div
        className="w-full bg-white shadow-md rounded-lg p-4 mt-8"
        style={{ height: "77vh" }}
      >
        {fileUrl ? (
          <CornerstoneViewer url={fileUrl}></CornerstoneViewer>
        ) : (
          <div
            className="flex justify-center items-center"
            style={{ height: "100%" }}
          >
            <p className="text-gray-600">File not uploaded...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

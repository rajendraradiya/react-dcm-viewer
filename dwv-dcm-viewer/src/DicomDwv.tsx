import React, { useEffect, useRef, useState } from "react";
import { App, AppOptions, ViewConfig, ToolConfig } from "dwv";

interface Props {
  url: string;
}

const DicomDwv: React.FC<Props> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dwvApp = useRef<App | null>(null);

  useEffect(() => {
    // const byteArray = Uint8Array.from(atob(url), (c) => c.charCodeAt(0));
    // const blob = new Blob([byteArray], { type: "application/dicom" });
    // const blobUrl = URL.createObjectURL(blob);

    if (containerRef.current) {
      containerRef.current.innerHTML = "";

      if (dwvApp.current) {
        dwvApp.current.reset();
      }

      const app = new App();
      dwvApp.current = app;

      const viewConfig0 = new ViewConfig("dwv");
      const viewConfigs = { "*": [viewConfig0] };
      const options = new AppOptions(viewConfigs);
      let _tools = {
        Scroll: {},
        WindowLevel: {},
        ZoomAndPan: {},
        Opacity: {},
        Draw: {
          options: [
            "Arrow",
            "Ruler",
            "Circle",
            "Ellipse",
            "Rectangle",
            "Protractor",
            "Roi",
          ],
        },
        Brush: {},
        Floodfill: {},
        Livewire: {},
        Filter: { options: ["Sharpen"] },
      };
      // @ts-ignore
      options.tools = _tools;
      app.init(options);
      app.addEventListener("load", function () {
        app.setTool("Scroll");
      });
      app.loadURLs([url]);
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <div>
      <div
        ref={containerRef}
        id="dwv"
        style={{
          display: "flex",
          width: "100%",
          height: "70vh",
          background: "black",
        }}
      />
    </div>
  );
};

export default DicomDwv;

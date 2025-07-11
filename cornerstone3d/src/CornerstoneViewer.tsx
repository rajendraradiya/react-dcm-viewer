import React, { useEffect, useRef } from "react";

import {
  RenderingEngine,
  Enums as CoreEnums,
  type Types,
  getRenderingEngine,
  init as csRenderInit,
  // @ts-ignore
} from "@cornerstonejs/core";

import {
  init as csToolsInit,
  addTool,
  ToolGroupManager,
  StackScrollTool,
  Enums as ToolEnums,
  // @ts-ignore
} from "@cornerstonejs/tools";

// @ts-ignore
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";

interface Props {
  url: string;
}

const DicomViewer: React.FC<Props> = ({ url }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const renderingEngineId = "myRenderingEngine";
  const viewportId = "CT";
  const toolGroupId = "TOOLGROUP_ID";

  useEffect(() => {
    const setup = async () => {
      try {
        const prev = getRenderingEngine(renderingEngineId);
        if (prev) {
          prev.disableElement(viewportId);
          prev.destroy();
        }
      } catch {}

      await csRenderInit();
      await csToolsInit();
      dicomImageLoaderInit();

      addTool(StackScrollTool);

      // const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      // const blob = new Blob([byteArray], { type: "application/dicom" });
      // const blobUrl = URL.createObjectURL(blob);
      const imageId = `wadouri:${url}`;

      const renderingEngine = new RenderingEngine(renderingEngineId);

      const viewportInput = {
        viewportId,
        type: CoreEnums.ViewportType.STACK,
        element: elementRef.current!,
        defaultOptions: {
          orientation: CoreEnums.OrientationAxis.AXIAL,
        },
      };

      renderingEngine.enableElement(viewportInput);

      const viewport = renderingEngine.getViewport(
        viewportId
      ) as Types.IStackViewport;

      await viewport.setStack([imageId]);
      await viewport.render();

      // ✅ Only create toolGroup if it doesn’t exist
      let toolGroup: any = ToolGroupManager.getToolGroup(toolGroupId);
      if (!toolGroup) {
        toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
      }

      toolGroup.addViewport(viewportId, renderingEngineId);
      toolGroup.addTool(StackScrollTool.toolName);
      toolGroup.setToolActive(StackScrollTool.toolName, {
        bindings: [
          {
            mouseButton: ToolEnums.MouseBindings.Primary,
          },
        ],
      });
    };

    if (url && elementRef.current) {
      setup();
    }
  }, [url]);

  return (
    <div
      ref={elementRef}
      style={{
        width: "100%",
        height: "70vh",
      }}
    />
  );
};

export default DicomViewer;

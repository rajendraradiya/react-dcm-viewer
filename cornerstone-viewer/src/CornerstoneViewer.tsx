import React, { useEffect, useRef, useState } from "react";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";

// --- External references
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

// --- Worker init
cornerstoneWADOImageLoader.configure({ useWebWorkers: true });

try {
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: 8,
    startWebWorkersOnDemand: true,
    webWorkerPath: "/codecs/cornerstoneWADOImageLoaderWebWorker.min.js",
    taskConfiguration: {
      decodeTask: {
        loadCodecsOnStartup: true,
        initializeCodecsOnStartup: false,
        codecsPath: "/codecs/",
        usePDFJS: false,
        strict: true,
      },
    },
  });
} catch (error) {
  console.error("cornerstoneWADOImageLoader initialization error:", error);
}

// --- Tools init
if (typeof cornerstoneTools.init === "function") {
  cornerstoneTools.init({
    mouseEnabled: true,
    touchEnabled: true,
    showSVGCursors: true,
  });

  const fontFamily = "Work Sans, Roboto, OpenSans, HelveticaNeue, sans-serif";
  cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`);
  cornerstoneTools.toolStyle.setToolWidth(2);
  cornerstoneTools.toolColors.setToolColor("rgb(255, 255, 0)");
  cornerstoneTools.toolColors.setActiveColor("rgb(0, 255, 0)");
}

interface Props {
  url: string; // url string WITHOUT data: prefix
}

const loadCodecs = async () => {
  // @ts-ignore
  await import(/* webpackIgnore: true */ "/codecs/jpeg.js");
  // @ts-ignore
  await import(/* webpackIgnore: true */ "/codecs/jpegLossless.js");
};

const CornerstoneViewer: React.FC<Props> = ({ url }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const imageIdsRef = useRef<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const imageIds: string[] = [];
  const [imageCount, setImageCount] = useState<number>(0);

  const updateImage = async (frameIndex: number) => {
    const element = elementRef.current;
    if (!element || !imageIdsRef.current.length) return;

    const imageId = imageIdsRef.current[frameIndex];
    const image = await cornerstone.loadAndCacheImage(imageId);
    cornerstone.displayImage(element, image);

    await cornerstone
      .loadAndCacheImage(imageIdsRef.current[frameIndex])
      .then((image: any) => {
        cornerstone.displayImage(element, image);
      });
  };

  const handlePrev = () => {
    if (currentFrame > 0) {
      const newIndex = currentFrame - 1;
      setCurrentFrame(newIndex);
      updateImage(newIndex);
    }
  };

  const handleNext = () => {
    if (currentFrame < imageIdsRef.current.length - 1) {
      const newIndex = currentFrame + 1;
      setCurrentFrame(newIndex);
      updateImage(newIndex);
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const render = async () => {
      try {
        await loadCodecs();
        cornerstone.enable(element);

        // const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        // const dataSet = dicomParser.parseDicom(byteArray);
        // const blob = new Blob([byteArray], { type: "application/dicom" });
        // const blobUrl = URL.createObjectURL(blob);

        const baseImageId = `wadouri:${url}`;

        const image = await cornerstone.loadAndCacheImage(baseImageId);
        cornerstone.displayImage(element, image);

        const numFrames = parseInt(image.data.string("x00280008") || "1", 10);

        for (let i = 0; i < numFrames; i++) {
          imageIds.push(`${baseImageId}?frame=${i}`);
        }

        imageIdsRef.current = imageIds;
        setCurrentFrame(0);
        setImageCount(imageIds.length);

        // Tool stack setup
        cornerstoneTools.addStackStateManager(element, ["stack"]);
        cornerstoneTools.addToolState(element, "stack", {
          currentImageIdIndex: 0,
          imageIds,
        });

        // Tools
        cornerstoneTools.addTool(cornerstoneTools.PanTool);
        cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
        cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);
        cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 1 });
        cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 2 });
        cornerstoneTools.setToolActive("StackScrollMouseWheel", {});
      } catch (err) {
        console.error("DICOM render error:", err);
      }
    };

    render();

    return () => {
      if (element) {
        cornerstone.disable(element);
      }
    };
  }, [url]);

  return (
    <div style={{ width: "100%" }}>
      <div
        ref={elementRef}
        style={{
          width: "100%",
          height: "60vh",
          backgroundColor: "black",
        }}
      />

      <div className="flex flex-col items-center w-full mt-4 space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentFrame === 0}
            className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentFrame >= imageCount - 1}
            className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>

        {imageCount > 0 && (
          <div className="text-black text-lg">
            Frame {currentFrame + 1} of {imageCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default CornerstoneViewer;

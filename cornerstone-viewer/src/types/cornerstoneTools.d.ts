declare module "cornerstone-tools" {
  import * as cornerstone from "cornerstone-core";
  import * as cornerstoneMath from "cornerstone-math";
  import Hammer from "hammerjs";

  export interface Stack {
    currentImageIdIndex: number;
    imageIds: string[];
  }

  export interface CornerstoneToolsInitOptions {
    mouseEnabled?: boolean;
    touchEnabled?: boolean;
    globalToolSyncEnabled?: boolean;
    showSVGCursors?: boolean;
  }

  export function init(options?: CornerstoneToolsInitOptions): void;
  export function addTool(tool: any): void;
  export function setToolActive(toolName: string, options: any): void;

  export function addStackStateManager(
    element: HTMLElement,
    stateNames: string[]
  ): void;

  export function addToolState(
    element: HTMLElement,
    toolName: string,
    data: any
  ): void;

  export function clearToolState(
    element: HTMLElement,
    toolName: string
  ): void;
  
  export function removeToolState(
    element: HTMLElement,
    toolName: string
  ): void;
  
  export const StackScrollMouseWheelTool: any;
  export const PanTool: any;
  export const ZoomTool: any;
  export const WwwcTool: any;
  export const AngleTool: any;

  export const external: {
    cornerstone: typeof cornerstone;
    cornerstoneMath: typeof cornerstoneMath;
    Hammer: typeof Hammer;
  };

  export const browser: {
    SUPPORT_POINTER_EVENTS?: boolean;
  };
  export const textStyle: {
    setFont(font: string): void;
    getFont(): string;
  };

  export const toolStyle: {
    setToolWidth(width: number): void;
    getToolWidth(): number;
  };

  export const toolColors: {
    setToolColor(color: string): void;
    getToolColor(): string;
    setActiveColor(color: string): void;
    getActiveColor(): string;
  };
}

// src/types/cornerstone-math.d.ts
declare module "cornerstone-math" {
  export function vec3(): any;
  export function plane(): any;
  export function boundingBox(): any;
  export function point(): any;
}

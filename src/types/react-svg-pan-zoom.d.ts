// src/types/react-svg-pan-zoom.d.ts

declare module 'react-svg-pan-zoom' {
  import * as React from 'react';
  import { SVGProps } from 'react';

  export interface ReactSVGPanZoomProps {
    width: number;
    height: number;
    background: string;
    tool: string;
    onChangeTool: (tool: string) => void;
    onChangeValue?: (value: Value) => void;
    value?: Value;
    ref?: React.Ref<any>;
    detectAutoPan?: boolean;
    detectPinchGesture?: boolean;
    scaleFactorMin?: number;
    scaleFactorMax?: number;
    // Add any other props you are using
  }

  export interface Value {
    tool: string;
    scale: number;
    translationX: number;
    translationY: number;
    // Add other properties as needed
  }

  export const TOOL_NONE: string;

  class ReactSVGPanZoom extends React.Component<ReactSVGPanZoomProps> {}
  
  export default ReactSVGPanZoom;
}

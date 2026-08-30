"use client";

import React, { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 iMouse;

  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
      u.y
    );
    return res * res;
  }

  const mat2 mtx = mat2(0.80, 0.60, -0.60, 0.80);

  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.500000 * noise(p + iTime * 0.04); p = mtx * p * 2.02;
    f += 0.250000 * noise(p); p = mtx * p * 2.03;
    f += 0.125000 * noise(p); p = mtx * p * 2.01;
    f += 0.062500 * noise(p); p = mtx * p * 2.04;
    f += 0.031250 * noise(p); p = mtx * p * 2.01;
    return f / 0.96875;
  }

  float pattern(in vec2 p) {
    return fbm(p + fbm(p + fbm(p)));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.x;
    
    // Pure autonomous ambient topographic flow (zero cursor interference)
    vec2 p = uv * 3.2;
    float h = pattern(p);


    // Topographic contour line waves (30 isoline bands)
    float contour = cos(h * 68.0 + iTime * 0.12);
    float line = smoothstep(0.82, 0.98, contour);

    // Thicker index contours (every 5th line)
    float indexContour = cos(h * 13.6 + iTime * 0.024);
    float indexLine = smoothstep(0.88, 0.99, indexContour);

    float intensity = clamp(line * 0.75 + indexLine * 0.35, 0.0, 1.0);

    // AMOLED Pitch Black (#000000) background with Crisp White (#f5f5f5) topo lines
    vec3 bgColor = vec3(0.0, 0.0, 0.0);
    vec3 lineColor = vec3(0.96, 0.96, 0.96);
    vec3 finalColor = mix(bgColor, lineColor, intensity);

    gl_FragColor = vec4(finalColor, intensity * 0.9);
  }
`;

/**
 * Clean monochrome / platinum theme colors for Topographic styling
 */
export function extractShaderThemeColors() {
  return {
    light: "hsl(0, 0%, 20%)",      // Deep Obsidian for light mode
    dark: "hsl(0, 0%, 92%)",       // Crisp Platinum White for dark mode
  };
}


interface WarpShaderBackgroundProps {
  opacity?: number;
  onThemeColorsChange?: (colors: { light: string; dark: string }) => void;
}

export default function WarpShaderBackground({
  opacity = 0.65,
  onThemeColorsChange,
}: WarpShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    // Notify parent of extracted Material You palette
    const extractedColors = extractShaderThemeColors();
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.style.setProperty(
      "--primary-color",
      isDark ? extractedColors.dark : extractedColors.light
    );
    if (onThemeColorsChange) {
      onThemeColorsChange(extractedColors);
    }
  }, [onThemeColorsChange]);



  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(VERTEX_SHADER, gl.VERTEX_SHADER);
    const fragShader = compileShader(FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "iResolution");
    const timeLocation = gl.getUniformLocation(program, "iTime");
    const mouseLocation = gl.getUniformLocation(program, "iMouse");

    const resize = () => {
      // Mobile Performance Guard: auto-clamp DPR to 0.45x on mobile screens (<= 768px) for zero battery drain
      const isMobile = window.innerWidth <= 768;
      const dprScale = isMobile ? 0.45 : 0.65;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25) * dprScale;
      const displayWidth = Math.max(320, Math.floor(window.innerWidth * dpr));
      const displayHeight = Math.max(240, Math.floor(window.innerHeight * dpr));

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }
    };


    window.addEventListener("resize", resize);
    resize();

    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting && document.visibilityState === "visible";
    });
    observer.observe(canvas);

    let animationFrameId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      if (isVisibleRef.current) {
        const elapsed = (now - startTime) / 1000;

        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, elapsed);
        gl.uniform2f(mouseLocation, 0.0, 0.0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      gl.deleteProgram(program);
      document.documentElement.style.removeProperty("--primary-color");
    };


  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="bg-shader"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -2,
        opacity,
        pointerEvents: "none",
        willChange: "transform",
        transform: "translateZ(0)",
        transition: "opacity 1.5s ease",
      }}
    />
  );
}

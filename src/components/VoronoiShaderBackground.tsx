"use client";

import React, { useEffect, useRef } from "react";

// Voronoi - Distances by Inigo Quilez (2013)
// https://iquilezles.org/articles/voronoilines
// Adapted for WebGL / Next.js with real-time multi-spectrum theme synchronization
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

  vec2 hash2(vec2 p) {
    // Procedural pseudo-random hash
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
  }

  vec3 voronoi(in vec2 x, float t) {
    vec2 ip = floor(x);
    vec2 fp = fract(x);

    // First pass: regular Voronoi to find closest center
    vec2 mg = vec2(0.0);
    vec2 mr = vec2(0.0);
    float md = 8.0;

    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash2(ip + g);
        o = 0.5 + 0.5 * sin(t + 6.28318 * o);
        vec2 r = g + o - fp;
        float d = dot(r, r);

        if (d < md) {
          md = d;
          mr = r;
          mg = g;
        }
      }
    }

    // Second pass: exact mathematical distance to cell borders
    md = 8.0;
    for (int j = -2; j <= 2; j++) {
      for (int i = -2; i <= 2; i++) {
        vec2 g = mg + vec2(float(i), float(j));
        vec2 o = hash2(ip + g);
        o = 0.5 + 0.5 * sin(t + 6.28318 * o);
        vec2 r = g + o - fp;

        if (dot(mr - r, mr - r) > 0.00001) {
          md = min(md, dot(0.5 * (mr + r), normalize(r - mr)));
        }
      }
    }

    return vec3(md, mr);
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
    
    // Slow, soothing harmonic flow
    float t = iTime * 0.45;
    
    vec3 c = voronoi(6.5 * p, t);

    // Multi-Spectrum Edge & Crystal Color Evolution
    float cycle = fract(iTime * 0.035);
    vec3 edgeCol;
    if (cycle < 0.16) {
      // Golden Amber Flare
      float f = cycle / 0.16;
      edgeCol = mix(vec3(1.0, 0.65, 0.10), vec3(0.20, 0.95, 0.55), f);
    } else if (cycle < 0.33) {
      // Emerald Matrix Neon
      float f = (cycle - 0.16) / 0.17;
      edgeCol = mix(vec3(0.20, 0.95, 0.55), vec3(0.12, 0.88, 0.98), f);
    } else if (cycle < 0.50) {
      // Glacier Cyan & Aquamarine
      float f = (cycle - 0.33) / 0.17;
      edgeCol = mix(vec3(0.12, 0.88, 0.98), vec3(0.28, 0.48, 0.98), f);
    } else if (cycle < 0.67) {
      // Cobalt Sapphire & Royal Indigo
      float f = (cycle - 0.50) / 0.17;
      edgeCol = mix(vec3(0.28, 0.48, 0.98), vec3(0.75, 0.35, 0.98), f);
    } else if (cycle < 0.84) {
      // Cosmic Ultra-Violet & Orchid
      float f = (cycle - 0.67) / 0.17;
      edgeCol = mix(vec3(0.75, 0.35, 0.98), vec3(0.96, 0.96, 1.0), f);
    } else {
      // Diamond Platinum Monochrome -> Return to Amber
      float f = (cycle - 0.84) / 0.16;
      edgeCol = mix(vec3(0.96, 0.96, 1.0), vec3(1.0, 0.65, 0.10), f);
    }

    // Mathematical grey/white isolines inside cells (dimmed for high-contrast readability)
    float isolineWave = c.x * (0.5 + 0.5 * sin(48.0 * c.x));
    vec3 col = isolineWave * vec3(0.45, 0.45, 0.50);

    // Glowing cell boundary edges
    col = mix(edgeCol, col, smoothstep(0.035, 0.075, c.x));

    // Animated cell nucleus feature points
    float dd = length(c.yz);
    col = mix(edgeCol * 1.15, col, smoothstep(0.0, 0.11, dd));
    col += edgeCol * (1.0 - smoothstep(0.0, 0.035, dd)) * 0.8;

    // Ambient edge vignette
    col *= 1.0 - dot(p, p) * 0.75;

    gl_FragColor = vec4(col * 0.75, 1.0);
  }
`;

/**
 * Extracts real-time Voronoi theme colors based on Inigo Quilez's edge spectrum
 */
export function extractVoronoiThemeColors(timeSec: number) {
  const cycle = (timeSec * 0.035) % 1.0;

  const isDarkMode =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : true;

  let lightColor = "hsl(38, 90%, 35%)";
  let darkColor = "hsl(38, 95%, 60%)";

  if (cycle < 0.16) {
    // Golden Amber
    const f = cycle / 0.16;
    const hue = Math.round(38 + f * 112); // 38 -> 150
    lightColor = `hsl(${hue}, 85%, 32%)`;
    darkColor = `hsl(${hue}, 95%, 60%)`;
  } else if (cycle < 0.33) {
    // Emerald Matrix
    const f = (cycle - 0.16) / 0.17;
    const hue = Math.round(150 + f * 40); // 150 -> 190
    lightColor = `hsl(${hue}, 80%, 28%)`;
    darkColor = `hsl(${hue}, 90%, 60%)`;
  } else if (cycle < 0.50) {
    // Glacier Cyan
    const f = (cycle - 0.33) / 0.17;
    const hue = Math.round(190 + f * 35); // 190 -> 225
    lightColor = `hsl(${hue}, 85%, 30%)`;
    darkColor = `hsl(${hue}, 95%, 65%)`;
  } else if (cycle < 0.67) {
    // Cobalt Sapphire
    const f = (cycle - 0.50) / 0.17;
    const hue = Math.round(225 + f * 55); // 225 -> 280
    lightColor = `hsl(${hue}, 85%, 34%)`;
    darkColor = `hsl(${hue}, 90%, 68%)`;
  } else if (cycle < 0.84) {
    // Cosmic Ultra-Violet
    const f = (cycle - 0.67) / 0.17;
    if (f > 0.6) {
      lightColor = "hsl(0, 0%, 20%)";
      darkColor = "hsl(0, 0%, 96%)";
    } else {
      const hue = Math.round(280);
      lightColor = `hsl(${hue}, 80%, 35%)`;
      darkColor = `hsl(${hue}, 90%, 70%)`;
    }
  } else {
    // Diamond Platinum -> Amber
    const f = (cycle - 0.84) / 0.16;
    if (f < 0.4) {
      lightColor = "hsl(0, 0%, 20%)";
      darkColor = "hsl(0, 0%, 96%)";
    } else {
      lightColor = "hsl(38, 85%, 32%)";
      darkColor = "hsl(38, 95%, 60%)";
    }
  }

  return {
    light: lightColor,
    dark: darkColor,
    active: isDarkMode ? darkColor : lightColor,
  };
}

interface VoronoiShaderBackgroundProps {
  opacity?: number;
  onThemeColorsChange?: (colors: { light: string; dark: string }) => void;
}

export default function VoronoiShaderBackground({
  opacity = 0.52,
  onThemeColorsChange: _onThemeColorsChange,
}: VoronoiShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(true);

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
        console.error("Voronoi shader compile error:", gl.getShaderInfoLog(shader));
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
      console.error("Voronoi program link error:", gl.getProgramInfoLog(program));
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

    const resize = () => {
      // Mobile Performance Guard: auto-clamp DPR to 0.42x on mobile screens (<= 768px)
      const isMobile = window.innerWidth <= 768;
      const dprScale = isMobile ? 0.42 : 0.60;
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
    let lastThemeUpdate = 0;
    const startTime = performance.now();

    const updateThemeColor = (elapsed: number) => {
      const colors = extractVoronoiThemeColors(elapsed);
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.style.setProperty(
        "--primary-color",
        isDark ? colors.dark : colors.light
      );
    };

    // Instant frame-0 initial color sync (0ms)
    updateThemeColor(0);

    const render = (now: number) => {
      if (isVisibleRef.current) {
        const elapsed = (now - startTime) / 1000;
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, elapsed);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Throttle CSS variable style recalculation to at most once every 120ms
        if (now - lastThemeUpdate > 120) {
          updateThemeColor(elapsed);
          lastThemeUpdate = now;
        }
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
      id="bg-voronoi"
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

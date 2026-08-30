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

  #define S(a, b, t) smoothstep(a, b, t)
  #define NUM_LAYERS 4.0

  float N21(vec2 p) {
    vec3 a = fract(vec3(p.xyx) * vec3(213.897, 653.453, 253.098));
    a += dot(a, a.yzx + 79.76);
    return fract((a.x + a.y) * a.z);
  }

  vec2 GetPos(vec2 id, vec2 offs, float t) {
    float n = N21(id + offs);
    float n1 = fract(n * 10.0);
    float n2 = fract(n * 100.0);
    float a = t + n;
    return offs + vec2(sin(a * n1), cos(a * n2)) * 0.4;
  }

  float df_line(in vec2 a, in vec2 b, in vec2 p) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);	
    return length(pa - ba * h);
  }

  float line(vec2 a, vec2 b, vec2 uv) {
    float r1 = 0.04;
    float r2 = 0.01;
    
    float d = df_line(a, b, uv);
    float d2 = length(a - b);
    float fade = S(1.5, 0.5, d2);
    fade += S(0.05, 0.02, abs(d2 - 0.75));
    return S(r1, r2, d) * fade;
  }

  float NetLayer(vec2 st, float n, float t) {
    vec2 id = floor(st) + n;
    st = fract(st) - 0.5;
   
    vec2 p0 = GetPos(id, vec2(-1.0, -1.0), t);
    vec2 p1 = GetPos(id, vec2( 0.0, -1.0), t);
    vec2 p2 = GetPos(id, vec2( 1.0, -1.0), t);
    vec2 p3 = GetPos(id, vec2(-1.0,  0.0), t);
    vec2 p4 = GetPos(id, vec2( 0.0,  0.0), t);
    vec2 p5 = GetPos(id, vec2( 1.0,  0.0), t);
    vec2 p6 = GetPos(id, vec2(-1.0,  1.0), t);
    vec2 p7 = GetPos(id, vec2( 0.0,  1.0), t);
    vec2 p8 = GetPos(id, vec2( 1.0,  1.0), t);
    
    float m = 0.0;
    float sparkle = 0.0;

    // Center node connections
    m += line(p4, p0, st) + line(p4, p1, st) + line(p4, p2, st);
    m += line(p4, p3, st) + line(p4, p5, st) + line(p4, p6, st);
    m += line(p4, p7, st) + line(p4, p8, st);
    m += line(p1, p3, st) + line(p1, p5, st) + line(p7, p5, st) + line(p7, p3, st);

    // Star sparkles on all 9 nodes
    vec2 pts[9];
    pts[0] = p0; pts[1] = p1; pts[2] = p2;
    pts[3] = p3; pts[4] = p4; pts[5] = p5;
    pts[6] = p6; pts[7] = p7; pts[8] = p8;

    for (int i = 0; i < 9; i++) {
      float d = length(st - pts[i]);
      float s = (0.0028 / (d * d + 0.0004));
      s *= S(1.0, 0.7, d);
      float pulse = sin((fract(pts[i].x) + fract(pts[i].y) + t) * 5.0) * 0.35 + 0.5;
      pulse = pow(pulse, 12.0);
      sparkle += s * pulse;
    }
    
    // Soft, gentle harmonic pulse without blinding flash surges
    float sPhase = (sin(t + n) + sin(t * 0.1)) * 0.2 + 0.45;
    m += sparkle * sPhase;
    
    return m;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
    vec2 M = vec2(0.0);
    
    float t = iTime * 0.07;
    
    float s = sin(t);
    float c = cos(t);
    mat2 rot = mat2(c, -s, s, c);
    vec2 st = uv * rot;  
    
    float m = 0.0;
    for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYERS) {
      float z = fract(t + i);
      float size = mix(15.0, 1.0, z);
      float fade = S(0.0, 0.6, z) * S(1.0, 0.8, z);
      m += fade * NetLayer(st * size - M * z, i, iTime * 0.8);
    }
    
    // 10-Phase Multi-Spectrum Celestial Palette (Platinum White, Gold, Sunset Coral, Lime, Emerald, Cyan, Cobalt Sapphire, Violet, Magenta, Ruby)
    // Multi-Spectrum Palette (Obsidian & Diamond Monochrome, Solar Gold, Coral, Lime, Emerald, Cyan, Sapphire, Violet, Magenta -> Return to Monochrome. ZERO RED!)
    float cycle = fract(t * 0.12);
    vec3 baseCol;
    if (cycle < 0.15) {
      // Phase 0: Pure Obsidian Black & Diamond Monochrome White
      baseCol = vec3(0.96, 0.96, 1.0);
    } else if (cycle < 0.28) {
      // Phase 1: Diamond Monochrome -> Solar Gold
      float f = (cycle - 0.15) / 0.13;
      baseCol = mix(vec3(0.96, 0.96, 1.0), vec3(0.98, 0.82, 0.25), f);
    } else if (cycle < 0.40) {
      // Phase 2: Solar Gold -> Warm Sunset Coral
      float f = (cycle - 0.28) / 0.12;
      baseCol = mix(vec3(0.98, 0.82, 0.25), vec3(0.98, 0.52, 0.20), f);
    } else if (cycle < 0.52) {
      // Phase 3: Sunset Coral -> Electric Lime Aurora
      float f = (cycle - 0.40) / 0.12;
      baseCol = mix(vec3(0.98, 0.52, 0.20), vec3(0.65, 0.95, 0.22), f);
    } else if (cycle < 0.64) {
      // Phase 4: Electric Lime -> Matrix Emerald
      float f = (cycle - 0.52) / 0.12;
      baseCol = mix(vec3(0.65, 0.95, 0.22), vec3(0.18, 0.94, 0.52), f);
    } else if (cycle < 0.76) {
      // Phase 5: Matrix Emerald -> Glacier Cyan & Aquamarine
      float f = (cycle - 0.64) / 0.12;
      baseCol = mix(vec3(0.18, 0.94, 0.52), vec3(0.12, 0.88, 0.98), f);
    } else if (cycle < 0.86) {
      // Phase 6: Glacier Cyan -> Cobalt Sapphire & Deep Indigo
      float f = (cycle - 0.76) / 0.10;
      baseCol = mix(vec3(0.12, 0.88, 0.98), vec3(0.28, 0.48, 0.98), f);
    } else if (cycle < 0.94) {
      // Phase 7: Cobalt Sapphire -> Cosmic Ultra-Violet & Orchid
      float f = (cycle - 0.86) / 0.08;
      baseCol = mix(vec3(0.28, 0.48, 0.98), vec3(0.70, 0.35, 0.98), f);
    } else {
      // Phase 8: Cosmic Violet -> Cyberpunk Magenta -> Return to Diamond Monochrome White
      float f = (cycle - 0.94) / 0.06;
      baseCol = mix(vec3(0.70, 0.35, 0.98), vec3(0.96, 0.96, 1.0), f);
    }

    vec3 col = baseCol * m * 0.72;
    
    // Vignette for ambient edge focus
    col *= 1.0 - dot(uv, uv) * 0.75;
    
    gl_FragColor = vec4(col, clamp(m * 0.8, 0.0, 0.75));
  }
`;

/**
 * Extracts real-time celestial theme colors (Obsidian Monochrome, Gold, Coral, Lime, Emerald, Cyan, Sapphire, Violet - Zero Red)
 */
export function extractUniverseThemeColors(timeSec: number) {
  const t = timeSec * 0.07;
  const cycle = (t * 0.12) % 1.0;

  const isDarkMode =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : true;

  let lightColor = "hsl(0, 0%, 20%)";
  let darkColor = "hsl(0, 0%, 96%)";

  if (cycle < 0.15) {
    // Pure Obsidian Black & Diamond Monochrome White
    lightColor = "hsl(0, 0%, 20%)";
    darkColor = "hsl(0, 0%, 96%)";
  } else if (cycle < 0.28) {
    // Diamond Monochrome -> Solar Gold
    const f = (cycle - 0.15) / 0.13;
    if (f < 0.25) {
      lightColor = "hsl(0, 0%, 20%)";
      darkColor = "hsl(0, 0%, 96%)";
    } else {
      const hue = Math.round(45);
      lightColor = `hsl(${hue}, 85%, 32%)`;
      darkColor = `hsl(${hue}, 95%, 62%)`;
    }
  } else if (cycle < 0.40) {
    // Solar Gold -> Warm Sunset Coral
    const f = (cycle - 0.28) / 0.12;
    const hue = Math.round(45 - f * 20);
    lightColor = `hsl(${hue}, 90%, 34%)`;
    darkColor = `hsl(${hue}, 95%, 62%)`;
  } else if (cycle < 0.52) {
    // Sunset Coral -> Electric Lime Aurora
    const f = (cycle - 0.40) / 0.12;
    const hue = Math.round(25 + f * 70);
    lightColor = `hsl(${hue}, 85%, 28%)`;
    darkColor = `hsl(${hue}, 90%, 58%)`;
  } else if (cycle < 0.64) {
    // Electric Lime -> Matrix Emerald
    const f = (cycle - 0.52) / 0.12;
    const hue = Math.round(95 + f * 53);
    lightColor = `hsl(${hue}, 80%, 28%)`;
    darkColor = `hsl(${hue}, 88%, 62%)`;
  } else if (cycle < 0.76) {
    // Matrix Emerald -> Glacier Cyan & Aquamarine
    const f = (cycle - 0.64) / 0.12;
    const hue = Math.round(148 + f * 40);
    lightColor = `hsl(${hue}, 85%, 30%)`;
    darkColor = `hsl(${hue}, 95%, 65%)`;
  } else if (cycle < 0.86) {
    // Glacier Cyan -> Cobalt Sapphire & Deep Indigo
    const f = (cycle - 0.76) / 0.10;
    const hue = Math.round(188 + f * 37);
    lightColor = `hsl(${hue}, 85%, 34%)`;
    darkColor = `hsl(${hue}, 90%, 68%)`;
  } else if (cycle < 0.94) {
    // Cobalt Sapphire -> Cosmic Ultra-Violet & Orchid
    const f = (cycle - 0.86) / 0.08;
    const hue = Math.round(225 + f * 50);
    lightColor = `hsl(${hue}, 80%, 35%)`;
    darkColor = `hsl(${hue}, 90%, 70%)`;
  } else {
    // Cosmic Ultra-Violet -> Return to Obsidian Black & Diamond Monochrome White
    const f = (cycle - 0.94) / 0.06;
    if (f > 0.5) {
      lightColor = "hsl(0, 0%, 20%)";
      darkColor = "hsl(0, 0%, 96%)";
    } else {
      const hue = Math.round(275 + f * 40);
      lightColor = `hsl(${hue}, 85%, 35%)`;
      darkColor = `hsl(${hue}, 95%, 68%)`;
    }
  }

  return {
    light: lightColor,
    dark: darkColor,
    active: isDarkMode ? darkColor : lightColor,
  };
}



interface UniverseWithinBackgroundProps {
  opacity?: number;
  onThemeColorsChange?: (colors: { light: string; dark: string }) => void;
}

export default function UniverseWithinBackground({
  opacity = 0.52,
  onThemeColorsChange: _onThemeColorsChange,
}: UniverseWithinBackgroundProps) {

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
        console.error("Universe shader compile error:", gl.getShaderInfoLog(shader));
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
      console.error("Universe program link error:", gl.getProgramInfoLog(program));
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
    let lastThemeUpdate = 0;
    const startTime = performance.now();

    const updateThemeColor = (elapsed: number) => {
      const colors = extractUniverseThemeColors(elapsed);
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
        gl.uniform2f(mouseLocation, 0.0, 0.0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Throttle CSS variable style recalculation to at most once every 120ms (eliminates main-thread recalculate-style stalls)
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
      id="bg-universe"
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

"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Domain-warped fbm gradient in the site's palette. Reacts to the pointer.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i+vec2(1.0,0.0));
  float c = hash(i+vec2(0.0,1.0));
  float d = hash(i+vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v = 0.0; float amp = 0.5;
  for(int i=0;i<5;i++){ v += amp*noise(p); p *= 2.02; amp *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  vec2 p = uv; p.x *= aspect;
  vec2 m = u_mouse; m.x *= aspect;

  float t = u_time * 0.05;
  vec2 q = vec2(fbm(p*1.6 + t), fbm(p*1.6 - t + 3.1));
  float pull = 0.35 / (0.15 + distance(p, m));
  vec2 r = vec2(fbm(p*2.2 + q + t + m*pull*0.15), fbm(p*2.2 + q - t));
  float f = fbm(p*1.8 + r);

  vec3 accent   = vec3(1.000, 0.290, 0.110); // #ff4a1c
  vec3 electric = vec3(0.231, 0.278, 1.000); // #3b47ff
  vec3 lime     = vec3(0.784, 0.980, 0.235); // #c8fa3c
  vec3 blush    = vec3(1.000, 0.560, 0.694); // #ff8fb1

  vec3 col = mix(electric, accent, smoothstep(0.2, 0.8, f));
  col = mix(col, lime, smoothstep(0.5, 1.0, r.x));
  col = mix(col, blush, smoothstep(0.6, 1.0, q.y) * 0.6);
  col = mix(col, vec3(0.043), smoothstep(0.75, 0.05, f) * 0.35);

  col += pull * 0.02 * accent;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export function ShaderField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: false });

    if (!gl) {
      // Fallback: a static bold gradient so the hero still looks intentional.
      canvas.style.background =
        "radial-gradient(120% 120% at 20% 20%, #3b47ff, #ff4a1c 55%, #0b0b0d)";
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    const mouse = { x: 0.5, y: 0.5 };
    const mtarget = { x: 0.5, y: 0.5 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mtarget.x = (e.clientX - rect.left) / rect.width;
      mtarget.y = 1 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    resize();

    const start = performance.now();
    let rafId = 0;
    const render = () => {
      mouse.x += (mtarget.x - mouse.x) * 0.06;
      mouse.y += (mtarget.y - mouse.y) * 0.06;
      const time = reduced ? 8 : (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";

/*
 * Animated light rays (WebGL) — Evexa Royal Blue rays fanning down from
 * the top edge of their container. Same shader and parameters as the
 * original component; pauses while off-screen; falls back to a static
 * image when WebGL is unavailable.
 */

const SPEED = 10;
const INTENSITY = 20;
const RAYS = 30;
const COLOR: [number, number, number, number] = [0 / 255, 49 / 255, 213 / 255, 1];

const VERT = "attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.,1.);}";

/* Exact fragment shader of the original component (unused noise helpers removed) */
const FRAG = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_colors[2];
uniform float u_intensity;
uniform float u_rays;
uniform float u_reach;
uniform vec2 u_rayPos1;
uniform vec2 u_rayPos2;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed)
{
    vec2 sourceToCoord = coord - raySource;
    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
    float diagonal = length(u_resolution);
    return clamp(
        (.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + u_time * speed)),
        u_reach, 1.0) *
        clamp((diagonal - length(sourceToCoord)) / diagonal, u_reach, 1.0);
}

void main()
{
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1.0 - uv.y;
    vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    float speed = u_rays * 10.0;

    vec2 rayPos1 = u_rayPos1;
    vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
    float raySeedA1 = 36.2214*speed;
    float raySeedB1 = 21.11349*speed;
    float raySpeed1 = 1.5*speed;

    vec2 rayPos2 = u_rayPos2;
    vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
    float raySeedA2 = 22.39910*speed;
    float raySeedB2 = 18.0234*speed;
    float raySpeed2 = 1.1*speed;

    float strength1 = rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);
    float strength2 = rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);

    float brightness = 1.0*u_reach - (coord.y / u_resolution.y);
    float attenuation = clamp(brightness + (0.5 + u_intensity), 0.0, 1.0);

    float alpha1 = strength1 * attenuation * u_colors[0].a;
    float alpha2 = strength2 * attenuation * u_colors[1].a;

    vec3 premultColor1 = u_colors[0].rgb * alpha1;
    vec3 premultColor2 = u_colors[1].rgb * alpha2;

    vec3 blendedColor = premultColor1 + premultColor2;
    float blendedAlpha = alpha1 + alpha2 * (1.0 - alpha1);

    vec3 finalRGB = blendedColor / max(blendedAlpha, 0.0001);

    gl_FragColor = vec4(finalRGB * blendedAlpha, blendedAlpha);
}
`;

export default function LightRays({
  position = 50,
  reach = 30,
  fallbackImage,
  className,
}: {
  /** horizontal origin of the rays, % of width */
  position?: number;
  /** 0–100: how far the rays stay bright */
  reach?: number;
  fallbackImage: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";
    host.insertBefore(canvas, host.firstChild);

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: true, preserveDrawingBuffer: true });
    const fallback = () => {
      canvas.remove();
      const img = document.createElement("img");
      img.src = fallbackImage;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none;";
      host.insertBefore(img, host.firstChild);
      return () => img.remove();
    };
    if (!gl) return fallback();

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return fallback();
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = (name: string) => gl.getUniformLocation(program, name);
    const uRes = U("u_resolution");
    const uTime = U("u_time");
    const uPos1 = U("u_rayPos1");
    const uPos2 = U("u_rayPos2");
    gl.uniform4fv(U("u_colors[0]"), [...COLOR, ...COLOR]);
    gl.uniform1f(U("u_intensity"), (INTENSITY / 100) * 0.5);
    gl.uniform1f(U("u_rays"), (RAYS / 100) * 0.3);
    gl.uniform1f(U("u_reach"), (reach / 100) * 0.5);

    let time = Math.random() * 10000;
    let raf = 0;
    let last = performance.now();
    let running = true;

    const resize = () => {
      const w = Math.max(1, Math.round(host.clientWidth));
      const h = Math.max(1, Math.round(host.clientHeight));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uPos1, (position / 100) * w, -0.4 * h);
      gl.uniform2f(uPos2, (position / 100 + 0.02) * w, -0.5 * h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const frame = (now: number) => {
      if (!running) return;
      time += (now - last) * (SPEED / 1e3 / 10);
      last = now;
      gl.uniform1f(uTime, time);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "100px" }
    );
    io.observe(host);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.remove();
    };
  }, [position, reach, fallbackImage]);

  return <div ref={hostRef} className={className} style={{ pointerEvents: "none" }} aria-hidden="true" />;
}

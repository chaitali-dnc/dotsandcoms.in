import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function isWebGLAvailable() {
    try {
        const canvas = document.createElement("canvas");
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
    } catch (e) {
        return false;
    }
}

export default function ThreeBackground3() {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
    const [webglSupported] = useState(() => isWebGLAvailable());

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (!containerRef.current || !webglSupported) return;

        const container = containerRef.current;
        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
        camera.position.z = 12;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch (err) {
            console.warn("WebGL not supported, falling back to CSS grid:", err);
            return;
        }

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight1.position.set(5, 8, 5);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xffaa66, 0.4);
        dirLight2.position.set(-5, -5, -2);
        scene.add(dirLight2);

        const gridWidth = 45;
        const gridHeight = 30;
        const widthSegments = 90;
        const heightSegments = 60;

        const geometry = new THREE.PlaneGeometry(gridWidth, gridHeight, widthSegments, heightSegments);

        const material = new THREE.MeshStandardMaterial({
            color: 0x64748b,
            wireframe: true,
            transparent: true,
            opacity: 0.08,
            roughness: 0.3,
            metalness: 0.1,
        });

        const gridMesh = new THREE.Mesh(geometry, material);
        gridMesh.rotation.x = -0.4;
        gridMesh.rotation.y = 0.1;
        gridMesh.position.set(0, 0, -2);
        scene.add(gridMesh);

        const GRID_DEPTH = 14;
        const COVERAGE_MARGIN = 1.6;

        const fitGridToViewport = () => {
            const aspect = width / height;
            const vFOV = (camera.fov * Math.PI) / 180;
            const visibleHeight = 2 * Math.tan(vFOV / 2) * GRID_DEPTH;
            const visibleWidth = visibleHeight * aspect;

            const scaleX = (visibleWidth * COVERAGE_MARGIN) / gridWidth;
            const scaleY = (visibleHeight * COVERAGE_MARGIN) / gridHeight;

            const finalScale = Math.max(scaleX, scaleY, 1);
            gridMesh.scale.set(finalScale, finalScale, 1);
        };

        fitGridToViewport();

        const targetMouse = new THREE.Vector2(0, 0);
        const mouse = new THREE.Vector2(0, 0);
        let scrollY = 0;

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            targetMouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
            targetMouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
        };

        const handleMouseLeave = () => {
            targetMouse.x = 0;
            targetMouse.y = 0;
        };

        const handleScroll = () => {
            scrollY = window.scrollY;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("scroll", handleScroll);

        const handleResize = () => {
            if (!containerRef.current) return;
            width = container.clientWidth || window.innerWidth;
            height = container.clientHeight || window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            fitGridToViewport();
        };
        window.addEventListener("resize", handleResize);

        // Mobile fix: container height can be 0 at the instant this effect runs
        // (banner height depends on flex content that hasn't finished laying
        // out yet). A ResizeObserver catches the real size as soon as it's
        // available and re-fits the camera + grid, instead of relying on a
        // single mount-time measurement.
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
            if (isMobile) {
                renderer.render(scene, camera);
            }
        });
        resizeObserver.observe(container);

        let animationFrameId;
        const clock = new THREE.Clock();

        const animate = () => {
            const time = clock.getElapsedTime();
            const scrollOffset = scrollY * 0.002;

            mouse.x += (targetMouse.x - mouse.x) * 0.05;
            mouse.y += (targetMouse.y - mouse.y) * 0.05;

            const aspect = width / height;
            const vFOV = (camera.fov * Math.PI) / 180;
            const visibleHeight = 2 * Math.tan(vFOV / 2) * GRID_DEPTH;
            const visibleWidth = visibleHeight * aspect;
            const mouseX3D = mouse.x * (visibleWidth / 2);
            const mouseY3D = mouse.y * (visibleHeight / 2);

            gridMesh.rotation.x = -0.4 - mouse.y * 0.18 - scrollOffset * 0.1;
            gridMesh.rotation.y = 0.1 + mouse.x * 0.18;

            gridMesh.position.x = mouse.x * 2.2;
            gridMesh.position.y = mouse.y * 1.5;

            const positionAttribute = geometry.attributes.position;
            const scale = gridMesh.scale.x;

            for (let i = 0; i < positionAttribute.count; i++) {
                const x = positionAttribute.getX(i);
                const y = positionAttribute.getY(i);

                const worldX = x * scale + gridMesh.position.x;
                const worldY = y * scale + gridMesh.position.y;
                const dx = worldX - mouseX3D;
                const dy = worldY - mouseY3D;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const rippleRadius = 7.5 * scale;
                let mouseSwell = 0;
                if (dist < rippleRadius) {
                    const force = (rippleRadius - dist) / rippleRadius;
                    mouseSwell = Math.sin(force * Math.PI) * 0.9;
                }

                const waveTime = isMobile ? 0 : time;
                const z = Math.sin(x * 0.15 + waveTime * 0.35)
                    * Math.cos(y * 0.18 + waveTime * 0.25) * 0.7
                    + Math.sin(y * 0.12 - waveTime * 0.18) * 0.3
                    + mouseSwell;

                positionAttribute.setZ(i, z);
            }
            positionAttribute.needsUpdate = true;

            renderer.render(scene, camera);

            if (isMobile) return;
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [isMobile, webglSupported]);

    if (!webglSupported) {
        return (
            <div 
                className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)] bg-[size:4rem_4rem]"
                aria-hidden="true"
            />
        );
    }

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
            aria-hidden="true"
        />
    );
}
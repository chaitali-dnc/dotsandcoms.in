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

export default function ThreeBackground() {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
    const [webglSupported] = useState(() => isWebGLAvailable());

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (!containerRef.current || !webglSupported) return;

        const container = containerRef.current;
        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || window.innerHeight;

        // 1. Scene setup
        const scene = new THREE.Scene();

        // 2. Camera setup
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
        camera.position.z = 12;

        // 3. Renderer setup
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

        // 4. Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight1.position.set(5, 8, 5);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xffaa66, 0.4); // Soft orange rim highlight
        dirLight2.position.set(-5, -5, -2);
        scene.add(dirLight2);

        // 5. Create undulating grid mesh (fabric wave)
        const gridWidth = 45;
        const gridHeight = 30;
        const widthSegments = 45;
        const heightSegments = 30;
        
        const geometry = new THREE.PlaneGeometry(gridWidth, gridHeight, widthSegments, heightSegments);
        
        // Soft neutral slate gray instead of brand red to make it much lighter and seamless
        const material = new THREE.MeshStandardMaterial({
            color: 0x64748b, // Darker neutral slate-500 gray
            wireframe: true,
            transparent: true,
            opacity: 0.08, // Darker grid lines
            roughness: 0.3,
            metalness: 0.1,
        });

        const gridMesh = new THREE.Mesh(geometry, material);
        // Tilt slightly for 3D fabric perspective
        gridMesh.rotation.x = -0.4;
        gridMesh.rotation.y = 0.1;
        gridMesh.position.set(0, 0, -2); // Push slightly back
        scene.add(gridMesh);

        // 6. Interaction & scroll state
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
        };
        window.addEventListener("resize", handleResize);

        // 7. Animation Loop
        let animationFrameId;
        const clock = new THREE.Clock();

        const animate = () => {
            const time = clock.getElapsedTime();
            const scrollOffset = scrollY * 0.002;

            // Smoothly lerp mouse coordinates for fluid movement
            mouse.x += (targetMouse.x - mouse.x) * 0.05;
            mouse.y += (targetMouse.y - mouse.y) * 0.05;

            // 3D projection of mouse coordinates at z = -2 (grid depth)
            const aspect = width / height;
            const vFOV = (camera.fov * Math.PI) / 180;
            const visibleHeight = 2 * Math.tan(vFOV / 2) * 14; // distance is camera.z - gridMesh.z = 12 - (-2) = 14
            const visibleWidth = visibleHeight * aspect;
            const mouseX3D = mouse.x * (visibleWidth / 2);
            const mouseY3D = mouse.y * (visibleHeight / 2);

            // Tilt & translate grid based on mouse position (increased range for higher responsiveness)
            gridMesh.rotation.x = -0.4 - mouse.y * 0.18 - scrollOffset * 0.1;
            gridMesh.rotation.y = 0.1 + mouse.x * 0.18;

            gridMesh.position.x = mouse.x * 2.2;
            gridMesh.position.y = mouse.y * 1.5;

            // Undulate the grid vertices like a calm fabric
            const positionAttribute = geometry.attributes.position;
            
            for (let i = 0; i < positionAttribute.count; i++) {
                const x = positionAttribute.getX(i);
                const y = positionAttribute.getY(i);

                // Calculate distance from local vertex to world mouse pointer
                const dx = (x + gridMesh.position.x) - mouseX3D;
                const dy = (y + gridMesh.position.y) - mouseY3D;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Localized tactile swell: deforms the fabric mesh smoothly under the cursor
                const rippleRadius = 7.5;
                let mouseSwell = 0;
                if (dist < rippleRadius) {
                    const force = (rippleRadius - dist) / rippleRadius;
                    mouseSwell = Math.sin(force * Math.PI) * 0.9; // Smooth localized bump
                }

                // If mobile, keep wave static (time = 0)
                const waveTime = isMobile ? 0 : time;
                // Wave formula + mouse swell influence
                const z = Math.sin(x * 0.15 + waveTime * 0.35) 
                        * Math.cos(y * 0.18 + waveTime * 0.25) * 0.7
                        + Math.sin(y * 0.12 - waveTime * 0.18) * 0.3
                        + mouseSwell;

                positionAttribute.setZ(i, z);
            }
            positionAttribute.needsUpdate = true;

            // Render
            renderer.render(scene, camera);

            // Do not animate on mobile to completely remove active CPU usage
            if (isMobile) return;

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // 8. Cleanup function
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            // Dispose geometries, materials, and renderer
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

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CAMPAIGN_INFO } from '../../data/students';

export const BouquetViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [arSupported, setArSupported] = useState(false);
  const [arActive, setArActive] = useState(false);
  const startARRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let mixer: THREE.AnimationMixer;
    let model: THREE.Object3D;
    let xrSession: any = null;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(navigator.userAgent);

    const checkXR = async () => {
      const xr = (navigator as any).xr;
      if (xr?.isSessionSupported) {
        const supported = await xr.isSessionSupported('immersive-ar');
        setArSupported(supported);
      }
    };
    checkXR();

    const init = () => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f0710);
      scene.fog = new THREE.Fog(0x0f0710, 1, 15);

      camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
      camera.position.set(0, 1, 3);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.5;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.5;
      controls.minDistance = 1.5;
      controls.maxDistance = 6;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(3, 5, 4);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      scene.add(dirLight);

      const fillLight = new THREE.DirectionalLight(0xffc0cb, 0.5);
      fillLight.position.set(-3, 2, -3);
      scene.add(fillLight);

      const loader = new GLTFLoader();
      loader.load(
        CAMPAIGN_INFO.bouquetModelGlb,
        (gltf: any) => {
          model = gltf.scene;
          model.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim;
          model.scale.set(scale, scale, scale);
          model.position.x -= center.x * scale;
          model.position.y -= (center.y - size.y / 2) * scale;
          model.position.z -= center.z * scale;

          if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip: any) => {
              mixer.clipAction(clip).play();
            });
          }

          scene.add(model);
          controls.target.set(0, 0.5, 0);
          controls.update();
          setModelLoaded(true);
        },
        undefined,
        (err: any) => {
          console.error('GLTFLoader error:', err);
          setModelError(true);
        }
      );

      const onResize = () => {
        if (!camera || !renderer) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', onResize);

      const animate = () => {
        if (mixer) mixer.update(0.016);
        if (controls && !xrSession) controls.update();
        if (renderer && scene && camera) renderer.render(scene, camera);
      };
      renderer.setAnimationLoop(animate);

      const startAR = async () => {
        try {
          const xr = (navigator as any).xr;
          if (xr?.requestSession) {
            const session = await xr.requestSession('immersive-ar', {
              requiredFeatures: ['hit-test'],
            });
            xrSession = session;
            renderer.xr.setSession(session);
            setArActive(true);

            session.addEventListener('end', () => {
              xrSession = null;
              setArActive(false);
              renderer.xr.setSession(null);
              controls.enabled = true;
              controls.autoRotate = true;
            });
            controls.enabled = false;
            controls.autoRotate = false;
            return;
          }

          const modelUrl = CAMPAIGN_INFO.bouquetModelGlb;
          const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${modelUrl}` : modelUrl;

          if (isIOS) {
            const a = document.createElement('a');
            a.rel = 'ar';
            a.href = fullUrl;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else if (isAndroid) {
            const intentUrl = `intent://intent/#Intent;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.google.ar.sceneviewer;S.browser_fallback_url=${encodeURIComponent(fullUrl)};end`;
            window.location.href = intentUrl;
          } else {
            window.open(fullUrl, '_blank');
          }
        } catch (err: any) {
          console.error('AR error:', err);
          setArActive(false);
        }
      };
      startARRef.current = startAR;

      const stopAR = () => {
        if (xrSession) {
          xrSession.end().catch(() => {});
        }
      };

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.setAnimationLoop(null);
      if (xrSession) {
        xrSession.end().catch(() => {});
      }
      if (controls) controls.dispose();
      if (renderer) {
        renderer.renderLists.dispose();
        renderer.dispose();
      }
      if (container) container.innerHTML = '';
    };
    };

    return init();
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-rose-950/20 via-pink-950/10 to-rose-950/30 border border-rose-300/20 backdrop-blur-md">
      <div ref={containerRef} className="w-full h-full" />

      {!modelLoaded && !modelError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-10 h-10 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-rose-200 tracking-wider font-light">Arranging your fresh flowers...</p>
        </div>
      )}

      {modelError && !modelLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-3xl mb-3">⚠️</div>
          <p className="text-xs text-rose-300 text-center px-4">3D model unavailable on this device</p>
        </div>
      )}

      <div className="absolute bottom-4 inset-x-0 flex justify-center px-4 pointer-events-auto">
        <button
          onClick={() => startARRef.current?.()}
          disabled={!modelLoaded || arActive}
          className="group relative inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-full shadow-lg shadow-rose-600/40 hover:shadow-rose-600/60 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:pointer-events-none"
        >
          <svg className="w-5 h-5 mr-2 -ml-1 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
          {arActive ? 'AR Active' : arSupported ? 'View Bouquet in AR' : 'View 3D Bouquet'}
        </button>
      </div>
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] tracking-widest uppercase text-rose-200">
        {arActive ? 'AR Mode - Move phone to scan' : 'Touch &amp; Drag to Rotate 3D'}
      </div>
    </div>
  );
};

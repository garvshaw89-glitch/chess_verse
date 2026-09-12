import { useState, useEffect } from 'react';

export type QualityTier = 'high' | 'medium' | 'low';
export type QualitySetting = 'auto' | 'high' | 'medium' | 'low';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isUltrawide: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  isTouch: boolean;
  width: number;
  height: number;
  aspectRatio: number;
  dpr: number;
  detectedTier: QualityTier;
}

/**
 * Estimate GPU and device performance tier
 */
export function detectDevicePerformanceTier(): QualityTier {
  if (typeof window === 'undefined') return 'high';

  try {
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || (isMobile ? 4 : 8);
    const dpr = window.devicePixelRatio || 1;

    // Check WebGL GPU capabilities
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    let isLowPowerGpu = false;

    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
        const lowerRenderer = renderer.toLowerCase();
        if (
          lowerRenderer.includes('mali-400') ||
          lowerRenderer.includes('mali-450') ||
          lowerRenderer.includes('adreno 3') ||
          lowerRenderer.includes('intel hd 3000') ||
          lowerRenderer.includes('powervr') ||
          lowerRenderer.includes('swiftshader') ||
          lowerRenderer.includes('software')
        ) {
          isLowPowerGpu = true;
        }
      }
    }

    if (isLowPowerGpu || memory <= 2 || (isMobile && cores <= 4 && dpr > 2.5)) {
      return 'low';
    }

    if (isMobile || memory <= 4 || cores <= 4 || window.innerWidth < 1024) {
      return 'medium';
    }

    return 'high';
  } catch {
    return 'medium';
  }
}

/**
 * Get full device layout and screen info
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isUltrawide: false,
      isLandscape: true,
      isPortrait: false,
      isTouch: false,
      width: 1920,
      height: 1080,
      aspectRatio: 1.77,
      dpr: 1,
      detectedTier: 'high'
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspectRatio = width / Math.max(1, height);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Mobile: phone portrait (<640px) or phone landscape (<900px width with aspect > 1.6 and height < 500px)
  const isMobileLandscape = width < 960 && height <= 520 && aspectRatio > 1.4;
  const isMobilePortrait = width < 640 && height > width;
  const isMobile = isMobilePortrait || isMobileLandscape || (width < 768 && isTouch);

  // Tablet: 640px to 1180px in portrait, or 768px to 1280px in landscape touch
  const isTablet = !isMobile && (
    (width >= 640 && width <= 1024 && !isMobileLandscape) ||
    (isTouch && width <= 1366 && height <= 1024)
  );

  // Ultrawide: width >= 2100 or aspect >= 2.15
  const isUltrawide = width >= 2560 || (aspectRatio >= 2.15 && width >= 1920);

  const isDesktop = !isMobile && !isTablet;
  const isLandscape = width >= height;
  const isPortrait = height > width;

  return {
    isMobile,
    isTablet,
    isDesktop,
    isUltrawide,
    isLandscape,
    isPortrait,
    isTouch,
    width,
    height,
    aspectRatio,
    dpr: Math.min(window.devicePixelRatio || 1, 3),
    detectedTier: detectDevicePerformanceTier()
  };
}

/**
 * Hook to listen for device resize, orientation change, and layout changes
 */
export function useDevice(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>(() => getDeviceInfo());

  useEffect(() => {
    let timeoutId: any = null;

    const update = () => {
      setInfo(getDeviceInfo());
    };

    const handleResize = () => {
      // Debounce slightly for smooth performance on fast window drag
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(update, 50);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Initial check
    update();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return info;
}

/**
 * Resolves effective quality tier based on settings and hardware
 */
export function resolveEffectiveTier(setting: QualitySetting, detected: QualityTier): QualityTier {
  if (setting === 'auto') return detected;
  return setting;
}

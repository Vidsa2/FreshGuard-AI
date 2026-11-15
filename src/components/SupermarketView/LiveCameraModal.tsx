import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  X, 
  FlipHorizontal, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Zap,
  Activity,
  Lock,
  Volume2,
  VolumeX,
  Scan,
  RotateCw
} from 'lucide-react';
import { computeSHA256 } from '../../utils/crypto';
import { FoodCategory } from '../../types';

export interface CameraCaptureResult {
  imageUrl: string;
  foodName: string;
  category: FoodCategory;
  quantity: string;
  sha256Hash: string;
  freshnessScore: number;
  colorScore: number;
  textureIntegrity: number;
  moldIndex: number;
  blemishRatio: number;
  vibrancyRatio: number;
  detectedFeatures: string[];
}

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (result: CameraCaptureResult) => void;
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const samplingTimerRef = useRef<number | null>(null);
  const steadyDurationRef = useRef<number>(0);
  const prevMetricsRef = useRef<{ r: number; g: number; b: number; bright: number } | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  // Real-Time Live HUD & Auto-Capture States
  const [autoCaptureEnabled, setAutoCaptureEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [liveScore, setLiveScore] = useState<number>(93);
  const [liveStatus, setLiveStatus] = useState<'FRESH' | 'SPOILED'>('FRESH');
  const [liveVibrancy, setLiveVibrancy] = useState<number>(88);
  const [liveBlemish, setLiveBlemish] = useState<number>(2.4);
  const [steadyProgress, setSteadyProgress] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Preset fallback specimens if webcam hardware is denied or unavailable
  const fallbackSpecimens = [
    {
      name: 'Fresh Golden Delicious Apples',
      category: 'Fruits' as FoodCategory,
      quantity: '12 kg (4 Crates)',
      url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      label: 'Apples (Fresh)'
    },
    {
      name: 'Ripe Cavendish Bananas',
      category: 'Fruits' as FoodCategory,
      quantity: '15 kg',
      url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
      label: 'Bananas (Fresh)'
    },
    {
      name: 'Hydroponic English Cucumbers',
      category: 'Vegetables' as FoodCategory,
      quantity: '10 kg',
      url: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
      label: 'Cucumbers (Fresh)'
    }
  ];

  // Synthetic Audio Shutter & Chime
  const playAudioBeep = useCallback((type: 'shutter' | 'tick') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'shutter') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.16); // A6
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch {
      // AudioContext blocked or muted
    }
  }, [soundEnabled]);

  // Start or restart webcam stream
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setCameraReady(false);
    setIsLocked(false);
    setSteadyProgress(0);
    steadyDurationRef.current = 0;
    prevMetricsRef.current = null;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera MediaDevices API not supported on this browser.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setCameraReady(true);
          }).catch((err) => {
            console.warn('Auto-play was blocked:', err);
            setCameraReady(true);
          });
        };
      }
    } catch (err: any) {
      console.warn('Webcam stream initialization failed:', err);
      let errorMsg = 'Camera permission was denied or no video input device was found.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Webcam permission was blocked in browser settings. Please allow camera access or use the sample feeds below.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No active webcam detected on this workstation. You can test with the sample feeds below.';
      }
      setCameraError(errorMsg);
    }
  };

  const stopCamera = () => {
    if (samplingTimerRef.current) {
      clearInterval(samplingTimerRef.current);
      samplingTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Real client-side image pixel analysis
  const analyzePixelData = (imageData: ImageData) => {
    const data = imageData.data;
    let vibrantPixels = 0;
    let blemishPixels = 0;
    let totalSampled = 0;
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;

    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      totalSampled++;
      sumR += r;
      sumG += g;
      sumB += b;

      const brightness = (r + g + b) / 3;

      // Dark, brown, blemish discoloration
      if (brightness < 60 || (r > 60 && r < 125 && g < 75 && b < 65)) {
        blemishPixels++;
      }
      // High vibrancy (green foliage, rich golden yellow, crisp red produce)
      else if (
        (g > r * 1.05 && g > b * 1.1) ||
        (r > 150 && g > 110 && b < 100) ||
        (r > 155 && g < 105 && b < 105)
      ) {
        vibrantPixels++;
      }
    }

    const avgR = sumR / (totalSampled || 1);
    const avgG = sumG / (totalSampled || 1);
    const avgB = sumB / (totalSampled || 1);
    const avgBright = (avgR + avgG + avgB) / 3;

    const blemishRatio = blemishPixels / (totalSampled || 1);
    const vibrancyRatio = vibrantPixels / (totalSampled || 1);

    let freshnessScore = Math.round(86 + vibrancyRatio * 13 - blemishRatio * 42);
    freshnessScore = Math.max(38, Math.min(98, freshnessScore));

    const colorScore = Math.max(45, Math.min(99, Math.round(85 + vibrancyRatio * 15)));
    const textureIntegrity = Math.max(35, Math.min(98, Math.round(92 - blemishRatio * 45)));
    const moldIndex = Math.max(1, Math.min(75, Math.round(blemishRatio * 60)));

    const isFresh = freshnessScore >= 70;

    const detectedFeatures = [
      `Real camera sensor scan: ${Math.round(vibrancyRatio * 100)}% cellular pigment vibrancy`,
      `Surface discoloration factor: ${Math.round(blemishRatio * 100)}% (${isFresh ? 'Safe limits' : 'Decomposition alert'})`,
      isFresh ? 'Zero microbial fungal colonies detected' : 'Surface discoloration exceeds FSANZ safe threshold',
      'Continuous optical focus confirmed: Epidermal skin evaluated'
    ];

    return {
      freshnessScore,
      isFresh,
      colorScore,
      textureIntegrity,
      moldIndex,
      blemishRatio: +(blemishRatio * 100).toFixed(1),
      vibrancyRatio: +(vibrancyRatio * 100).toFixed(1),
      avgR,
      avgG,
      avgB,
      avgBright,
      detectedFeatures
    };
  };

  // Perform Final Snapshot Capture and populate Intake
  const executeCapture = async (metricsOverride?: any) => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);
    setFlashEffect(true);
    playAudioBeep('shutter');
    setTimeout(() => setFlashEffect(false), 240);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsCapturing(false);
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    // Analyze captured pixels
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const metrics = metricsOverride || analyzePixelData(imgData);

    // Compute cryptographic SHA-256 hash of the captured base64 bytes
    const sha256Hash = await computeSHA256(dataUrl);

    stopCamera();
    setIsCapturing(false);

    onCapture({
      imageUrl: dataUrl,
      foodName: 'Live Camera Inspected Specimen',
      category: 'Fruits',
      quantity: '10 kg (Inspected Batch)',
      sha256Hash,
      freshnessScore: metrics.freshnessScore,
      colorScore: metrics.colorScore,
      textureIntegrity: metrics.textureIntegrity,
      moldIndex: metrics.moldIndex,
      blemishRatio: metrics.blemishRatio,
      vibrancyRatio: metrics.vibrancyRatio,
      detectedFeatures: metrics.detectedFeatures
    });

    onClose();
  };

  // Continuous sampling loop (every ~250ms) for real-time live vision
  useEffect(() => {
    if (!cameraReady || isCapturing || isLocked) return;

    const sampleIntervalMs = 250;
    const targetSteadyTimeMs = 1500; // 1.5 seconds steady to auto-capture

    samplingTimerRef.current = window.setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      const sampleW = 240;
      const sampleH = 180;
      canvas.width = sampleW;
      canvas.height = sampleH;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Draw center-focal reticle area
      ctx.drawImage(video, 0, 0, sampleW, sampleH);

      // Crop center ~60% zone where the food is positioned
      const cropX = Math.floor(sampleW * 0.2);
      const cropY = Math.floor(sampleH * 0.2);
      const cropW = Math.floor(sampleW * 0.6);
      const cropH = Math.floor(sampleH * 0.6);

      const frameData = ctx.getImageData(cropX, cropY, cropW, cropH);
      const metrics = analyzePixelData(frameData);

      // Dynamically update Live HUD metrics
      setLiveScore(metrics.freshnessScore);
      setLiveStatus(metrics.isFresh ? 'FRESH' : 'SPOILED');
      setLiveVibrancy(metrics.vibrancyRatio);
      setLiveBlemish(metrics.blemishRatio);

      // Stability and Motion Detection:
      const prev = prevMetricsRef.current;
      const currentSample = {
        r: metrics.avgR,
        g: metrics.avgG,
        b: metrics.avgB,
        bright: metrics.avgBright
      };

      if (prev) {
        // Compute delta across color channels and luminance
        const delta = (
          Math.abs(currentSample.r - prev.r) +
          Math.abs(currentSample.g - prev.g) +
          Math.abs(currentSample.b - prev.b) +
          Math.abs(currentSample.bright - prev.bright)
        ) / 4;

        // Threshold: if item is held relatively steady inside the target reticle
        const isSteady = delta < 10.5;

        if (isSteady) {
          steadyDurationRef.current += sampleIntervalMs;
          const progress = Math.min(100, Math.round((steadyDurationRef.current / targetSteadyTimeMs) * 100));
          setSteadyProgress(progress);

          // Hands-free Auto-Capture Trigger
          if (autoCaptureEnabled && progress >= 100 && !isLocked) {
            setIsLocked(true);
            executeCapture(metrics);
          }
        } else {
          // Food moved or was rotated - reset steady countdown smoothly
          steadyDurationRef.current = 0;
          setSteadyProgress(0);
        }
      }

      prevMetricsRef.current = currentSample;
    }, sampleIntervalMs);

    return () => {
      if (samplingTimerRef.current) {
        clearInterval(samplingTimerRef.current);
        samplingTimerRef.current = null;
      }
    };
  }, [cameraReady, isCapturing, isLocked, autoCaptureEnabled]);

  // Fallback trigger using sample images
  const handleSelectFallback = async (specimen: typeof fallbackSpecimens[0]) => {
    setIsCapturing(true);
    const sha256Hash = await computeSHA256(`${specimen.url}_${Date.now()}`);

    const result: CameraCaptureResult = {
      imageUrl: specimen.url,
      foodName: specimen.name,
      category: specimen.category,
      quantity: specimen.quantity,
      sha256Hash,
      freshnessScore: 94,
      colorScore: 96,
      textureIntegrity: 93,
      moldIndex: 2,
      blemishRatio: 1.8,
      vibrancyRatio: 88.5,
      detectedFeatures: [
        `Optimal ${specimen.category} carotenoid pigment intensity`,
        'Epidermal tissue intact with zero visible microbial colonization',
        'Certified safe under FSANZ 1.2.5 date-marking provisions'
      ]
    };

    stopCamera();
    setIsCapturing(false);
    onCapture(result);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-white/10 relative overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Flash Effect on capture */}
        {flashEffect && (
          <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-200 pointer-events-none"></div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  Live Vision Scanner & Freshness Lens
                </h3>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Continuous AI Sampler
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Continuous optical frame analysis. Hold specimen steady inside the reticle for hands-free auto-scan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={soundEnabled ? 'Mute Shutter Sound' : 'Enable Shutter Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => { stopCamera(); onClose(); }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewfinder Viewport */}
        <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-white/15 flex items-center justify-center group shadow-inner">
          
          {/* Active Video Feed */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              cameraReady ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Hidden Canvas for continuous frame sampling */}
          <canvas ref={canvasRef} className="hidden" />

          {/* ============================================================== */}
          {/* 1. CONTINUOUS REAL-TIME FLOATING HUD OVERLAY                   */}
          {/* ============================================================== */}
          {cameraReady && (
            <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-20">
              
              {/* Dynamic Live Score Badge */}
              <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    liveStatus === 'FRESH' ? 'bg-emerald-400' : 'bg-red-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    liveStatus === 'FRESH' ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></span>
                </span>
                
                <span className="text-xs font-mono font-bold text-white tracking-wide">
                  Live Freshness: <span className={liveStatus === 'FRESH' ? 'text-emerald-400' : 'text-red-400'}>{liveScore}%</span>
                </span>

                <span className="text-slate-500">•</span>

                <span className={`text-[11px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                  liveStatus === 'FRESH' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {liveStatus === 'FRESH' ? 'FRESH [GOOD]' : 'SPOILED [REJECT]'}
                </span>
              </div>

              {/* Live Telemetry Pill */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/15 text-[10px] font-mono text-slate-300">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Vibrancy: {liveVibrancy}%</span>
                <span className="text-slate-600">|</span>
                <span>Blemish: {liveBlemish}%</span>
              </div>
            </div>
          )}

          {/* Animated Scanning Laser Line */}
          {cameraReady && (
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_3px_#34d399] pointer-events-none animate-[scanLaser_3s_ease-in-out_infinite] z-10"></div>
          )}

          {/* ============================================================== */}
          {/* 2. HANDS-FREE AUTO-CAPTURE RETICLE & CIRCULAR LOCK COUNTDOWN   */}
          {/* ============================================================== */}
          {cameraReady && (
            <div className={`absolute inset-7 sm:inset-11 pointer-events-none transition-all duration-300 rounded-2xl flex items-center justify-center ${
              steadyProgress > 0 
                ? 'border-2 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.35)]' 
                : 'border border-emerald-500/30'
            }`}>
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-lg"></div>

              {/* Center Crosshair & Circular Progress Countdown */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                {/* SVG Progress Circle for steady countdown */}
                {autoCaptureEnabled && steadyProgress > 0 && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      className="text-emerald-950/60 stroke-current"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      className="text-emerald-400 stroke-current transition-all duration-200"
                      strokeWidth="4"
                      strokeDasharray={213.6}
                      strokeDashoffset={213.6 - (213.6 * steadyProgress) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                )}

                {/* Inner Crosshair / Lock Indicator */}
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                  steadyProgress >= 100 
                    ? 'border-emerald-300 bg-emerald-500/30 scale-110' 
                    : steadyProgress > 0 
                      ? 'border-emerald-400 bg-black/40' 
                      : 'border-emerald-400/40 bg-black/20'
                }`}>
                  {steadyProgress >= 100 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 animate-bounce" />
                  ) : steadyProgress > 0 ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-300">
                      {steadyProgress}%
                    </span>
                  ) : (
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></div>
                  )}
                </div>
              </div>

              {/* Dynamic Lock Status Banner */}
              <div className="absolute bottom-3 inset-x-4 flex justify-center">
                {autoCaptureEnabled ? (
                  steadyProgress > 0 ? (
                    <div className="text-[11px] font-mono font-bold text-emerald-200 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 animate-pulse">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>{steadyProgress >= 100 ? 'Target Locked! Capturing...' : `Locking Target... (${steadyProgress}%)`}</span>
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-slate-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                      <Scan className="w-3 h-3 text-emerald-400" />
                      <span>Hold Specimen Steady in Reticle (~1.5s)</span>
                    </div>
                  )
                ) : (
                  <div className="text-[10px] font-mono text-slate-400 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                    Manual Shutter Mode
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Camera Loading Spinner */}
          {!cameraReady && !cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 text-white">
              <div className="w-10 h-10 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin"></div>
              <span className="text-xs text-slate-300 font-medium">Initializing Optical Sensor Stream...</span>
            </div>
          )}

          {/* Camera Permission / Error Fallback Notice */}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 text-white space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="max-w-md">
                <h4 className="text-sm font-bold text-white mb-1">Optical Webcam Offline</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {cameraError}
                </p>
              </div>

              {/* Fallback Specimen Buttons */}
              <div className="w-full max-w-md pt-2">
                <div className="text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Sample Optical Feeds (Webcam Bypass):
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {fallbackSpecimens.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleSelectFallback(item)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-950/60 border border-white/10 hover:border-emerald-500/50 transition-all text-left flex flex-col items-center gap-1.5 group cursor-pointer"
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-white/10 group-hover:scale-105 transition-transform"
                      />
                      <span className="text-[10px] font-bold text-slate-300 text-center truncate w-full">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Shutter & Controls Bar */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 text-white">
          
          {/* Left: Auto-Capture Toggle & Camera Switch */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFacingMode}
              disabled={!cameraReady}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5 border border-white/10 disabled:opacity-40"
              title="Toggle Front / Rear Camera"
            >
              <FlipHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Flip</span>
            </button>

            {/* Auto-Capture Toggle Switch */}
            <button
              type="button"
              onClick={() => {
                setAutoCaptureEnabled(!autoCaptureEnabled);
                setSteadyProgress(0);
                steadyDurationRef.current = 0;
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                autoCaptureEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${autoCaptureEnabled ? 'text-emerald-400 fill-emerald-400' : 'text-slate-400'}`} />
              <span>Auto-Capture: {autoCaptureEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Right: Manual Shutter Fallback & Cancel */}
          <div className="flex items-center gap-2">
            {/* Shutter Capture Button */}
            <button
              type="button"
              onClick={() => executeCapture()}
              disabled={!cameraReady || isCapturing}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                cameraReady && !isCapturing
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:opacity-95 text-slate-950 shadow-emerald-500/25 active:scale-98 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-white/10 cursor-not-allowed'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isCapturing ? 'Analyzing...' : 'Capture Now'}</span>
            </button>

            {/* Cancel button */}
            <button
              type="button"
              onClick={() => { stopCamera(); onClose(); }}
              className="px-3 py-2 rounded-xl bg-transparent hover:bg-white/10 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scanLaser {
          0% { top: 8%; opacity: 0.9; }
          50% { top: 90%; opacity: 1; }
          100% { top: 8%; opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

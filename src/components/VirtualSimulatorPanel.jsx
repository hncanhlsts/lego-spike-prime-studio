import React, { useEffect, useRef } from 'react';
import {
  Map,
  Box,
  RotateCcw,
  CheckCircle2,
  Hand,
  Monitor
} from 'lucide-react';
import * as THREE from 'three';

export default function VirtualSimulatorPanel({
  simMode,
  setSimMode,
  mapType,
  setMapType,
  robotPose,
  onResetSimulator,
  telemetry,
  missionCompleted,
  onManualNudgeArm
}) {
  const canvas2DRef = useRef(null);
  const mount3DRef = useRef(null);
  const sceneObjectsRef = useRef(null);

  useEffect(() => {
    if (simMode !== '2D') return;
    const canvas = canvas2DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // 1. Vẽ nền sa bàn
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // 2. Vẽ chi tiết bản đồ
    if (mapType === 'line_track') {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(70, H / 2);
      ctx.bezierCurveTo(180, H / 2 - 70, 270, H / 2 + 70, 410, H / 2);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(425, H / 2 - 26, 36, 52);
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.strokeRect(425, H / 2 - 26, 36, 52);
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 10px Inter';
      ctx.fillText('OBSTACLE (E)', 408, H / 2 - 32);
    } else if (mapType === 'maze') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(40, 35, 260, 14);
      ctx.fillRect(40, 135, 155, 14);
      ctx.fillRect(290, 35, 14, 210);
      ctx.fillRect(185, 135, 14, 110);

      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.fillRect(55, 60, 55, 55);
      ctx.fillStyle = '#1d4ed8';
      ctx.font = 'bold 10px Inter';
      ctx.fillText('START', 65, 92);

      ctx.fillStyle = 'rgba(34, 197, 94, 0.28)';
      ctx.fillRect(210, 185, 70, 55);
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.strokeRect(210, 185, 70, 55);
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 11px Inter';
      ctx.fillText('GOAL', 228, 216);
    } else {
      const colors = [
        { hex: '#ef4444', name: 'RED (9)' },
        { hex: '#eab308', name: 'YELLOW (7)' },
        { hex: '#22c55e', name: 'GREEN (6)' },
        { hex: '#3b82f6', name: 'BLUE (3)' }
      ];
      colors.forEach((col, i) => {
        ctx.fillStyle = col.hex;
        ctx.fillRect(170 + i * 52, 40, 30, 185);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px Inter';
        ctx.fillText(col.name, 166 + i * 52, 34);
      });

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(435, H / 2 - 30, 32, 60);
    }

    // 3. Đường vết di chuyển
    if (robotPose.trail && robotPose.trail.length > 1) {
      ctx.strokeStyle = 'rgba(234, 51, 150, 0.5)';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      robotPose.trail.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Vẽ Robot LEGO SPIKE Prime với nhãn cổng A, B, D, E rõ ràng cho Học sinh
    ctx.save();
    ctx.translate(robotPose.x, robotPose.y);
    ctx.rotate((robotPose.angle * Math.PI) / 180);

    // Chùm sóng siêu âm Distance Sensor (Port E)
    ctx.fillStyle = 'rgba(14, 184, 214, 0.18)';
    ctx.beginPath();
    ctx.moveTo(22, 0);
    ctx.lineTo(22 + Math.min(robotPose.distanceCm * 1.4, 150), -26);
    ctx.lineTo(22 + Math.min(robotPose.distanceCm * 1.4, 150), 26);
    ctx.closePath();
    ctx.fill();

    // 2 Bánh xe xanh (Port A Trái, Port B Phải)
    ctx.fillStyle = '#0090FF';
    ctx.fillRect(-16, -25, 32, 8);
    ctx.fillRect(-16, 17, 32, 8);

    // Khung Magenta Driving Base
    ctx.fillStyle = '#EA3396';
    ctx.fillRect(-20, -17, 40, 34);

    // Thân Hub vàng ở giữa
    ctx.fillStyle = '#FFD500';
    ctx.fillRect(-14, -12, 28, 24);

    // Nhãn cổng A và B ngay trên 2 bánh xe
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Inter';
    ctx.fillText('A', -3, -19);
    ctx.fillText('B', -3, 24);

    // Mắt Cảm biến màu (Port D) & Khoảng cách (Port E) ở mũi Robot
    ctx.fillStyle = '#0EB8D6';
    ctx.beginPath();
    ctx.arc(21, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 7px Inter';
    ctx.fillText('D/E', 15, 2.5);

    ctx.restore();
  }, [simMode, mapType, robotPose]);

  // Không gian 3D (Three.js) cho các bài Cơ cấu Nâng, Hạ, Kéo, Thả
  useEffect(() => {
    if (simMode !== '3D') return;
    const container = mount3DRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 260;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a');

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(6.5, 5.2, 7.5);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(8, 12, 6);
    scene.add(dirLight);

    const grid = new THREE.GridHelper(16, 16, 0x38bdf8, 0x1e293b);
    scene.add(grid);

    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    const chassisGeo = new THREE.BoxGeometry(2.2, 0.35, 1.6);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0xea3396, roughness: 0.3 });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.position.y = 0.45;
    robotGroup.add(chassisMesh);

    const hubGeo = new THREE.BoxGeometry(1.6, 0.65, 1.25);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xffd500, roughness: 0.25 });
    const hubMesh = new THREE.Mesh(hubGeo, hubMat);
    hubMesh.position.set(-0.1, 0.95, 0);
    robotGroup.add(hubMesh);

    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.25, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0090ff, roughness: 0.4 });

    const leftWheel = new THREE.Mesh(wheelGeo, wheelMat);
    leftWheel.rotation.x = Math.PI / 2;
    leftWheel.position.set(0.2, 0.55, -0.95);
    robotGroup.add(leftWheel);

    const rightWheel = new THREE.Mesh(wheelGeo, wheelMat);
    rightWheel.rotation.x = Math.PI / 2;
    rightWheel.position.set(0.2, 0.55, 0.95);
    robotGroup.add(rightWheel);

    const armPivot = new THREE.Group();
    armPivot.position.set(0.95, 0.85, 0);
    robotGroup.add(armPivot);

    const beamGeo = new THREE.BoxGeometry(1.65, 0.16, 0.14);
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x0eb8d6 });
    const leftBeam = new THREE.Mesh(beamGeo, beamMat);
    leftBeam.position.set(0.75, 0, -0.38);
    armPivot.add(leftBeam);

    const rightBeam = new THREE.Mesh(beamGeo, beamMat);
    rightBeam.position.set(0.75, 0, 0.38);
    armPivot.add(rightBeam);

    const gripperGroup = new THREE.Group();
    gripperGroup.position.set(1.55, -0.1, 0);
    armPivot.add(gripperGroup);

    const fingerGeo = new THREE.BoxGeometry(0.45, 0.22, 0.1);
    const fingerMat = new THREE.MeshStandardMaterial({ color: 0xff8c1a });
    const leftFinger = new THREE.Mesh(fingerGeo, fingerMat);
    leftFinger.position.set(0.2, 0, -0.32);
    gripperGroup.add(leftFinger);

    const rightFinger = new THREE.Mesh(fingerGeo, fingerMat);
    rightFinger.position.set(0.2, 0, 0.32);
    gripperGroup.add(rightFinger);

    const cargoGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    const cargoMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.3 });
    const cargoCube = new THREE.Mesh(cargoGeo, cargoMat);
    cargoCube.position.set(2.9, 0.3, 0);
    scene.add(cargoCube);

    sceneObjectsRef.current = {
      scene,
      camera,
      renderer,
      robotGroup,
      armPivot,
      leftFinger,
      rightFinger,
      cargoCube
    };

    let isDragging = false;
    let prevX = 0;
    let camAngle = 0.75;

    const onPointerDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      camAngle -= dx * 0.01;
      camera.position.x = Math.cos(camAngle) * 9.2;
      camera.position.z = Math.sin(camAngle) * 9.2;
      camera.lookAt(0.8, 0.8, 0);
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
    };
  }, [simMode]);

  useEffect(() => {
    if (simMode !== '3D' || !sceneObjectsRef.current) return;
    const { robotGroup, armPivot, leftFinger, rightFinger, cargoCube } =
      sceneObjectsRef.current;

    const worldX = (robotPose.x - 90) / 45;
    const worldZ = (robotPose.y - 135) / 45;
    robotGroup.position.set(worldX, 0, worldZ);
    robotGroup.rotation.y = -(robotPose.angle * Math.PI) / 180;

    const armRad = ((robotPose.armAngle - 25) * Math.PI) / 180;
    armPivot.rotation.z = armRad;

    const fingerOffset = robotPose.gripperClosed ? 0.22 : 0.38;
    leftFinger.position.z = -fingerOffset;
    rightFinger.position.z = fingerOffset;

    if (robotPose.cargoGrabbed) {
      const tipLocal = new THREE.Vector3(1.75, -0.1, 0);
      armPivot.localToWorld(tipLocal);
      cargoCube.position.copy(tipLocal);
    } else {
      cargoCube.position.set(3.2, 0.28, 0);
    }
  }, [simMode, robotPose]);

  return (
    <div className="flex flex-col h-full bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden">
      {/* HEADER KHU VỰC 3: THANH CÔNG CỤ SA BÀN CỐ ĐỊNH 1 DÒNG (H-11), KHÔNG BAO GIỜ BỊ ÉP DỌC */}
      <div className="h-11 shrink-0 flex items-center justify-between gap-2 px-3 bg-slate-950 border-b border-slate-800 whitespace-nowrap overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          {simMode === '2D' ? (
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value)}
              className="bg-slate-900 text-slate-100 text-[11px] font-bold h-7 px-2.5 rounded-lg border border-slate-700 focus:outline-none cursor-pointer shrink-0 whitespace-nowrap"
            >
              <option value="line_track">Sa bàn 1: Dò Line & Vật cản</option>
              <option value="maze">Sa bàn 2: Mê cung Góc vuông</option>
              <option value="sensor_lab">Sa bàn 3: Dải màu Cảm biến</option>
            </select>
          ) : (
            <span className="bg-orange-500/20 text-orange-300 border border-orange-500/40 h-7 px-2.5 rounded-lg text-[11px] font-bold inline-flex items-center shrink-0 whitespace-nowrap">
              Mô phỏng Tay Nâng & Gắp 3D (Port C)
            </span>
          )}

          {/* Ô trạng thái cố định kích thước 1 dòng, không làm thay đổi chiều cao thanh công cụ */}
          <span
            className={`inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-bold border shrink-0 whitespace-nowrap ${
              missionCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 shrink-0 ${
                missionCompleted ? 'text-emerald-400' : 'text-slate-600'
              }`}
            />
            <span>{missionCompleted ? 'Hoàn thành! Sẵn sàng kết nối' : 'Sẵn sàng chạy thử'}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setSimMode('2D')}
              className={`inline-flex items-center gap-1 h-6 px-2.5 rounded text-[11px] font-bold transition shrink-0 whitespace-nowrap ${
                simMode === '2D'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5 shrink-0" />
              <span>Sa bàn 2D</span>
            </button>
            <button
              onClick={() => setSimMode('3D')}
              className={`inline-flex items-center gap-1 h-6 px-2.5 rounded text-[11px] font-bold transition shrink-0 whitespace-nowrap ${
                simMode === '3D'
                  ? 'bg-orange-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5 shrink-0" />
              <span>Không gian 3D</span>
            </button>
          </div>

          <button
            onClick={onResetSimulator}
            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold h-7 px-2.5 rounded-lg border border-slate-700 shrink-0 whitespace-nowrap"
          >
            <RotateCcw className="w-3 h-3 shrink-0" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* KHUNG MÔ PHỎNG 2D HOẶC 3D (KÍCH THƯỚC CỐ ĐỊNH TUYỆT ĐỐI) */}
      <div className="relative flex-1 min-h-0 bg-slate-950 flex items-center justify-center overflow-hidden">
        {simMode === '2D' ? (
          <canvas
            ref={canvas2DRef}
            width={520}
            height={265}
            className="w-full h-full object-contain bg-slate-100"
          />
        ) : (
          <div ref={mount3DRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        )}

        {/* Thông báo hoàn thành nhiệm vụ dạng Overlay nổi cố định góc dưới phải, không làm nhảy kích thước Sa bàn */}
        {missionCompleted && simMode === '2D' && (
          <div className="absolute bottom-2.5 right-3 pointer-events-none bg-emerald-950/90 backdrop-blur border border-emerald-400/60 text-emerald-200 px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Hoàn thành nhiệm vụ! Sẵn sàng kết nối Robot thật</span>
          </div>
        )}

        {/* Cửa sổ nổi Màn hình Hiển thị (Display Extension - Mục 17 trong tài liệu) */}
        {telemetry.displayMessage && (
          <div className="absolute top-2.5 right-3 pointer-events-none bg-teal-950/95 border-2 border-teal-400 text-teal-100 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-extrabold">
            <Monitor className="w-4 h-4 text-teal-300" />
            <span>Display: "{telemetry.displayMessage}"</span>
          </div>
        )}

        {simMode === '3D' && (
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-xl text-[11px]">
            <span className="text-slate-300 flex items-center gap-1.5 font-semibold truncate">
              <Hand className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate">Xoay 3D | Thử nhanh Cổng C:</span>
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onManualNudgeArm('lift')}
                className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                ⬆ 75°
              </button>
              <button
                onClick={() => onManualNudgeArm('lower')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
              >
                ⬇ 10°
              </button>
              <button
                onClick={() => onManualNudgeArm('toggleGrip')}
                className="px-2 py-0.5 rounded bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold"
              >
                {robotPose.gripperClosed ? 'Open (-90°)' : 'Close (+90°)'}
              </button>
            </div>
          </div>
        )}

        <div className="absolute top-2.5 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <span className="bg-slate-950/90 text-slate-200 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800">
            Driving Base (A+B): X={Math.round(robotPose.x)} Y={Math.round(robotPose.y)} | Yaw={Math.round(telemetry.gyroYaw)}°
          </span>
          <span className="bg-slate-950/90 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800">
            [E] distance = {Math.round(telemetry.distanceSensor.cm)} cm
          </span>
          <span className="bg-slate-950/90 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800">
            [D] color = {telemetry.colorSensor.color} ({telemetry.colorSensor.reflection}%)
          </span>
        </div>
      </div>
    </div>
  );
}

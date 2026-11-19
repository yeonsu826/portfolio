import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export type StoryPrint = { title: string; subtitle: string; text: string; note: string; image?: string; color: string; number: string };
const W = 3, H = 4.15;

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, lineHeight: number) {
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const letter of paragraph) {
      if (ctx.measureText(line + letter).width > width && line) { ctx.fillText(line, x, y); y += lineHeight; line = ''; }
      line += letter;
    }
    ctx.fillText(line, x, y); y += lineHeight;
  }
  return y;
}

function usePrint(data: StoryPrint, side: 'left' | 'right') {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    let cancelled = false;
    let resource: THREE.CanvasTexture | undefined;
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 1660;
    const ctx = canvas.getContext('2d')!;
    const paint = async () => {
      await document.fonts.ready;
      ctx.fillStyle = side === 'left' ? data.color : '#f6f0e2'; ctx.fillRect(0, 0, 1200, 1660);
      for (let n = 0; n < 16000; n++) { ctx.fillStyle = n % 2 ? '#ffffff09' : '#263d2508'; ctx.fillRect((n * 137.17) % 1200, (n * 83.73) % 1660, 2, 2); }
      ctx.fillStyle = '#55634d'; ctx.font = '22px sans-serif'; ctx.fillText(data.number + ' / JEONG YEON SU', 100, 110);
      ctx.strokeStyle = '#52624740'; ctx.beginPath(); ctx.moveTo(100, 150); ctx.lineTo(1100, 150); ctx.stroke();
      if (side === 'left') {
        if (data.image) {
          const img = new Image(); img.src = data.image;
          try { await img.decode(); const scale = Math.min(1000 / img.width, 1120 / img.height); const width = img.width * scale, height = img.height * scale;
            ctx.save(); ctx.translate(600, 810); ctx.rotate(-.045); ctx.shadowColor = '#1b2c2445'; ctx.shadowBlur = 35; ctx.shadowOffsetY = 25; ctx.fillStyle = '#fffbef'; ctx.fillRect(-width / 2 - 20, -height / 2 - 20, width + 40, height + 40); ctx.shadowColor = 'transparent'; ctx.drawImage(img, -width / 2, -height / 2, width, height); ctx.restore();
          } catch { ctx.font = '100px serif'; ctx.fillText('YS', 470, 800); }
        } else { ctx.fillStyle = '#344b37'; ctx.font = 'italic 430px Georgia'; ctx.fillText('YS', 250, 940); ctx.font = '120px serif'; ctx.fillStyle = '#ede5cc'; ctx.fillText('✳', 820, 510); }
        ctx.fillStyle = '#293e30'; ctx.font = '42px "Noto Serif KR",serif'; wrap(ctx, data.subtitle, 100, 1470, 1000, 60);
      } else {
        ctx.fillStyle = '#778565'; ctx.font = '26px sans-serif'; wrap(ctx, data.subtitle, 100, 230, 980, 42);
        ctx.fillStyle = '#283d30'; ctx.font = '82px "Noto Serif KR",serif'; let y = wrap(ctx, data.title, 100, 390, 980, 116);
        y += 65; ctx.fillStyle = '#465942'; ctx.font = '38px "Malgun Gothic",sans-serif'; y = wrap(ctx, data.text, 100, y, 980, 70);
        y += 65; ctx.strokeStyle = '#52624740'; ctx.beginPath(); ctx.moveTo(100, y); ctx.lineTo(1100, y); ctx.stroke(); y += 65;
        ctx.font = '22px sans-serif'; ctx.fillStyle = '#899476'; ctx.fillText('BEHIND THE PROJECT', 100, y); y += 65;
        ctx.font = '31px "Malgun Gothic",sans-serif'; ctx.fillStyle = '#59684f'; wrap(ctx, data.note, 100, y, 980, 58);
      }
      const shade = ctx.createLinearGradient(0, 0, 1200, 0);
      if (side === 'right') { shade.addColorStop(0, '#1e291f28'); shade.addColorStop(.12, '#1e291f00'); }
      else { shade.addColorStop(.88, '#1e291f00'); shade.addColorStop(1, '#1e291f28'); }
      ctx.fillStyle = shade; ctx.fillRect(0, 0, 1200, 1660);
      ctx.font = '22px sans-serif'; ctx.fillStyle = '#7c876b'; ctx.fillText('DESIGN · DEVELOP · EXPLORE', 100, 1580);
      if (cancelled) return;
      resource = new THREE.CanvasTexture(canvas); resource.colorSpace = THREE.SRGBColorSpace; resource.anisotropy = 8; setTexture(resource);
    };
    paint();
    return () => { cancelled = true; resource?.dispose(); };
  }, [data, side]);
  return texture;
}

function Leaf({ front, back, direction }: { front: THREE.Texture | null; back: THREE.Texture | null; direction: 'next' | 'prev' }) {
  const frontMesh = useRef<THREE.Mesh>(null);
  const backMesh = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  const geometry = useMemo(() => { const g = new THREE.PlaneGeometry(W, H, 60, 1); g.translate(W / 2, 0, 0); return g; }, []);
  const reverse = useMemo(() => { const g = geometry.clone(); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i)); return g; }, [geometry]);
  useEffect(() => () => { geometry.dispose(); reverse.dispose(); }, [geometry, reverse]);
  useFrame((_, dt) => {
    elapsed.current += dt;
    const t = Math.min(elapsed.current / 1.8, 1); const eased = t * t * (3 - 2 * t);
    const angle = (direction === 'next' ? eased : 1 - eased) * Math.PI;
    for (const g of [geometry, reverse]) {
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = i % 61 / 60; const localAngle = angle - Math.sin(Math.PI * t) * .5 * u;
        pos.setX(i, Math.cos(localAngle) * W * u);
        pos.setZ(i, .13 + Math.sin(localAngle) * W * u + Math.sin(Math.PI * u) * Math.sin(Math.PI * t) * .23);
      }
      pos.needsUpdate = true; g.computeVertexNormals();
    }
  });
  return <group><mesh ref={frontMesh} geometry={geometry} castShadow receiveShadow><meshStandardMaterial map={front} color={front ? '#ffffff' : '#f5efdf'} roughness={.92} side={THREE.FrontSide} /></mesh><mesh ref={backMesh} geometry={reverse} castShadow receiveShadow><meshStandardMaterial map={back} color={back ? '#ffffff' : '#f5efdf'} roughness={.92} side={THREE.BackSide} /></mesh></group>;
}

function Scene({ current, previous, direction, mobile }: { current: StoryPrint; previous?: StoryPrint; direction?: 'next' | 'prev'; mobile: boolean }) {
  const left = usePrint(current, 'left'), right = usePrint(current, 'right');
  const oldLeft = usePrint(previous ?? current, 'left'), oldRight = usePrint(previous ?? current, 'right');
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useEffect(() => { camera.position.set(.25, mobile ? 8 : 5, mobile ? 6.8 : 3.8); camera.lookAt(0, 0, 0); }, [camera, mobile]);
  useFrame(state => { if (group.current) { group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, state.pointer.x * .025, .04); } });
  return <><ambientLight intensity={1.4} /><directionalLight position={[-4, 8, 3]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-.0002} /><directionalLight position={[5, 4, -4]} intensity={.7} />
    <group rotation={[-Math.PI / 2, 0, -.04]} ref={group}>
      <mesh position={[0, 0, -.18]} castShadow receiveShadow><boxGeometry args={[6.2, H + .18, .16]} /><meshStandardMaterial color="#596d4d" roughness={.75} /></mesh>
      {[-1, 1].map(side => <group key={side}><mesh position={[side * W / 2, 0, -.045]} castShadow receiveShadow><boxGeometry args={[W - .02, H, .16]} /><meshStandardMaterial color="#d5ceba" roughness={.9} /></mesh>{Array.from({ length: 13 }, (_, i) => <mesh key={i} position={[side * W / 2, 0, -.115 + i * .011]}><boxGeometry args={[W, H + .015, .003]} /><meshStandardMaterial color={i % 2 ? '#e7dfc9' : '#bbb49f'} /></mesh>)}</group>)}
      <mesh position={[-W / 2, 0, .055]} receiveShadow><planeGeometry args={[W, H]} /><meshBasicMaterial toneMapped={false} key={(direction === 'next' ? oldLeft : left)?.uuid ?? 'left-paper'} map={direction === 'next' ? oldLeft : left} color="#ffffff" /></mesh>
      <mesh position={[W / 2, 0, .06]} receiveShadow><planeGeometry args={[W, H]} /><meshBasicMaterial toneMapped={false} key={(direction === 'prev' ? oldRight : right)?.uuid ?? 'right-paper'} map={direction === 'prev' ? oldRight : right} color="#ffffff" /></mesh>
      <mesh position={[0, 0, .04]}><boxGeometry args={[.045, H, .06]} /><meshStandardMaterial color="#bdb7a4" /></mesh>
      {direction && previous && <Leaf key={`${current.number}-${direction}`} direction={direction} front={direction === 'next' ? oldRight : right} back={direction === 'next' ? left : oldLeft} />}
    </group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.35, 0]} receiveShadow><planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={.35} /></mesh>
  </>;
}

export default function StoryBook3D({ current, previous, direction }: { current: StoryPrint; previous?: StoryPrint; direction?: 'next' | 'prev' }) {
  const [mobile, setMobile] = useState(() => window.innerWidth < 761);
  useEffect(() => { const query = window.matchMedia('(max-width:760px)'); const update = () => setMobile(query.matches); query.addEventListener('change', update); return () => query.removeEventListener('change', update); }, []);
  return <Canvas shadows dpr={[1, 2]} camera={{ position: [.25, 5, 3.8], fov: 34 }} gl={{ antialias: true, alpha: true }} fallback={<div className="ps-webgl-fallback">3D 화면을 사용할 수 없습니다. 아래 ‘내용 읽기’를 펼쳐 프로젝트를 확인하세요.</div>}><Scene current={current} previous={previous} direction={direction} mobile={mobile} /></Canvas>;
}

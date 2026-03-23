// --- Stars Background ---
const StarsBackground = ({ count = 40 }) => {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2.0 + 1.0,
        duration: 1 + Math.random() * 3, // Faster duration for blinking
        delay: Math.random() * 5
      });
    }
    setStars(arr);
  }, [count]);
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-black">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-blink"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
// Needed for GlitchLoader at the bottom
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, animate } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import HeatMap from './components/HeatMap';
import { Menu, X, ArrowRight, Github, Linkedin, Twitter, Mail, ExternalLink, HelpCircle, Flame, Trophy, Cpu, Globe, Rocket, Terminal, Zap, Download, Award, CheckCircle2, Send, Eye } from 'lucide-react';
import { 
  SiReact, 
  SiTailwindcss, 
  SiJavascript, 
  SiHtml5, 
  SiCss, 
  SiNodedotjs, 
  SiExpress, 
  SiMongodb, 
  SiCplusplus, 
  SiGit, 
  SiGithub, 
  SiOpenai,
  SiPostman,
  SiLeetcode,
  SiCodeforces
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { cn } from './lib/utils';
import cloudImg from './assests/cloud-computing.png';
import Ai from './assests/Ai.png';
import mern from './assests/mern.png';
import prompt from './assests/prompt.png';
import moketon from './assests/moketon.png';
import gameguru from './assests/gameguru.png';
import currencyconverter from './assests/currencyconveter.png';

import Typewriter from "typewriter-effect";
// --- Animation Components ---

const TextReveal = ({ text, className = "" }: { text: string, className?: string }) => {
  const words = text.split(" ");
  return (
    <div className={cn("flex flex-wrap justify-center gap-x-[0.2em]", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="inline-block overflow-hidden"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: 0.05
          }}
          animate={{
            x: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%"
            ],
            y: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%"
            ],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25 + Math.random() * 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-64 h-64 rounded-full bg-accent-purple/5 blur-[80px]"
        />
      ))}
    </div>
  );
};

// --- Cursor Lightning Effect ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-accent-purple z-[100] origin-left shadow-[0_0_15px_rgba(124,58,237,0.8)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

const CursorGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const flicker = useMotionValue(1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    const flickerInterval = setInterval(() => {
      flicker.set(Math.random() > 0.9 ? 1.1 : 1);
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(flickerInterval);
    };
  }, [mouseX, mouseY, flicker]);

  const glowX = useTransform(mouseX, (x) => x - 200);
  const glowY = useTransform(mouseY, (y) => y - 200);
  const coreX = useTransform(mouseX, (x) => x - 8);
  const coreY = useTransform(mouseY, (y) => y - 8);

  return (
    <>
      {/* Main Glow */}
      <motion.div
        className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[9999] blur-[100px] opacity-30 mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          scale: flicker,
          background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
        }}
      />
      
      {/* Lightning Core */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[10000] blur-sm bg-white"
        style={{
          x: coreX,
          y: coreY,
          boxShadow: '0 0 20px 5px rgba(124,58,237,0.8), 0 0 40px 10px rgba(255,255,255,0.5)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ 
          duration: 0.2, 
          repeat: Infinity 
        }}
      />
    </>
  );
};

// --- 3D Robot Component (Transformer Edition) ---

const Robot = ({ mouse, scrollProgress }: { mouse: React.MutableRefObject<[number, number]>, scrollProgress: React.MutableRefObject<number> }) => {
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wheelsRef = useRef<THREE.Group>(null);

  // Scratch variables for smooth rotation and performance
  const targetHeadRotation = useRef(new THREE.Quaternion());
  const targetBodyRotation = useRef(new THREE.Quaternion());
  const scratchEuler = useRef(new THREE.Euler());

  // Cache materials for performance
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  useEffect(() => {
    if (group.current) {
      const mats: THREE.MeshStandardMaterial[] = [];
      group.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mats.push(mat);
        }
      });
      materialsRef.current = mats;
    }
  }, []);

  useFrame((state, delta) => {
    if (!group.current || !head.current || !body.current) return;

    const t = state.clock.getElapsedTime();
    const currentScroll = scrollProgress.current;

    // Transformation Factor (0 = Robot, 1 = Vehicle)
    // Starts at 5% scroll, finishes at 40%
    const transform = THREE.MathUtils.smoothstep(currentScroll, 0.05, 0.4);
    
    // Exit Factor (Moves the robot up with the page after About section)
    const exit = THREE.MathUtils.smoothstep(currentScroll, 0.45, 0.6);

    // 1. Calculate Target Rotations (Mouse influence decreases as we transform)
    const mouseInfluence = (1 - transform) * (1 - exit);
    const yaw = mouse.current[0] * (Math.PI / 4) * mouseInfluence;
    const pitch = -mouse.current[1] * (Math.PI / 6) * mouseInfluence;
    const roll = mouse.current[0] * 0.05 * mouseInfluence;

    // 2. Head Rotation & Transformation
    scratchEuler.current.set(pitch + (transform * Math.PI * 0.5), yaw, roll);
    targetHeadRotation.current.setFromEuler(scratchEuler.current);
    const headAlpha = 1 - Math.exp(-10 * delta);
    head.current.quaternion.slerp(targetHeadRotation.current, headAlpha);
    
    // Head tucks in
    head.current.position.y = THREE.MathUtils.lerp(2.8, 1.8, transform);
    head.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.1, transform));

    // 3. Body Rotation & Position
    const bodyYaw = mouse.current[0] * (Math.PI / 12) * mouseInfluence;
    const bodyPitch = -mouse.current[1] * 0.05 * mouseInfluence;
    scratchEuler.current.set(bodyPitch, bodyYaw, 0);
    targetBodyRotation.current.setFromEuler(scratchEuler.current);
    const bodyAlpha = 1 - Math.exp(-5 * delta);
    body.current.quaternion.slerp(targetBodyRotation.current, bodyAlpha);

    // 4. Global Position & Scale
    // Move behind "About Me" section (down and back)
    // Then move UP with the page after About section (exit)
    const baseY = Math.sin(t * 1.5) * 0.05;
    const targetY = -5;
    const exitY = 15; // Move up off-screen
    
    group.current.position.y = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(baseY, targetY, transform),
      exitY,
      exit
    );
    
    group.current.position.z = THREE.MathUtils.lerp(0, -15, transform);
    group.current.position.x = THREE.MathUtils.lerp(2.5, 0, transform); // Start on right, move to center
    group.current.scale.setScalar(THREE.MathUtils.lerp(0.8, 1.4, transform)); // Start smaller, grow as it transforms
    
    // Fade out during exit - Optimized: Use cached materials
    const opacity = 1 - exit;
    for (let i = 0; i < materialsRef.current.length; i++) {
      materialsRef.current[i].opacity = opacity;
    }
    
    // 5. Arm Animations (Folding into truck sides)
    if (rightArm.current && leftArm.current) {
      const armIdleZ = Math.sin(t * 1.5) * 0.02 * mouseInfluence;
      
      // Right Arm
      rightArm.current.rotation.z = THREE.MathUtils.lerp(armIdleZ - 0.1, -Math.PI * 0.4, transform);
      rightArm.current.rotation.x = THREE.MathUtils.lerp(mouse.current[1] * 0.2 * mouseInfluence, -Math.PI * 0.5, transform);
      rightArm.current.position.x = THREE.MathUtils.lerp(1.1, 0.8, transform);
      rightArm.current.position.z = THREE.MathUtils.lerp(0, -0.5, transform);

      // Left Arm
      leftArm.current.rotation.z = THREE.MathUtils.lerp(-armIdleZ + 0.1, Math.PI * 0.4, transform);
      leftArm.current.rotation.x = THREE.MathUtils.lerp(mouse.current[1] * 0.2 * mouseInfluence, -Math.PI * 0.5, transform);
      leftArm.current.position.x = THREE.MathUtils.lerp(-1.1, -0.8, transform);
      leftArm.current.position.z = THREE.MathUtils.lerp(0, -0.5, transform);
    }

    // 6. Leg Animations (Folding into truck rear)
    if (rightLeg.current && leftLeg.current) {
      // Right Leg
      rightLeg.current.rotation.x = THREE.MathUtils.lerp(0, Math.PI * 0.5, transform);
      rightLeg.current.position.z = THREE.MathUtils.lerp(0, 1.5, transform);
      rightLeg.current.position.x = THREE.MathUtils.lerp(0.5, 0.3, transform);

      // Left Leg
      leftLeg.current.rotation.x = THREE.MathUtils.lerp(0, Math.PI * 0.5, transform);
      leftLeg.current.position.z = THREE.MathUtils.lerp(0, 1.5, transform);
      leftLeg.current.position.x = THREE.MathUtils.lerp(-0.5, -0.3, transform);
    }

    // 7. Core Pulse
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 6) * 0.15;
      coreRef.current.scale.set(pulse, pulse, pulse);
      const material = coreRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        material.opacity = 1 - transform;
        material.transparent = true;
      }
    }

    // 8. Wheels Transformation
    if (wheelsRef.current) {
      wheelsRef.current.scale.setScalar(transform);
      wheelsRef.current.position.y = THREE.MathUtils.lerp(0, -0.5, transform);
      const wheelRotation = t * 5 * transform;
      for (let i = 0; i < wheelsRef.current.children.length; i++) {
        wheelsRef.current.children[i].rotation.x = wheelRotation;
      }
    }
  });

  const armorBlue = "#1e40af";
  const armorRed = "#b91c1c";
  const metalSilver = "#9ca3af";
  const metalDark = "#374151";
  const detailYellow = "#facc15";
  const glowBlue = "#60a5fa";

  return (
    <group ref={group} position={[0, -1.2, 0]}>
      {/* Head Section */}
      <group ref={head} position={[0, 2.8, 0]}>
        {/* Main Helmet - Layered */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
          <meshStandardMaterial color={armorBlue} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Helmet Bolts/Details */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[0.26, 0.2 - i * 0.15, 0.2]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color={metalSilver} metalness={1} />
          </mesh>
        ))}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[-0.26, 0.2 - i * 0.15, 0.2]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color={metalSilver} metalness={1} />
          </mesh>
        ))}
        {/* Helmet Side Vents */}
        <mesh position={[0.26, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.3]} />
          <meshStandardMaterial color={metalDark} metalness={1} />
        </mesh>
        <mesh position={[-0.26, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.3]} />
          <meshStandardMaterial color={metalDark} metalness={1} />
        </mesh>
        {/* Face Plate - Detailed */}
        <group position={[0, -0.1, 0.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.35, 0.35, 0.15]} />
            <meshStandardMaterial color={metalSilver} metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Mouthpiece Detail - More Complex */}
          <group position={[0, -0.1, 0.08]}>
            <mesh>
              <boxGeometry args={[0.2, 0.1, 0.05]} />
              <meshStandardMaterial color={metalDark} metalness={1} />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <boxGeometry args={[0.15, 0.02, 0.01]} />
              <meshStandardMaterial color={metalSilver} />
            </mesh>
          </group>
        </group>
        {/* Helmet Crest - Sharper */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.08, 0.25, 0.45]} />
          <meshStandardMaterial color={armorBlue} metalness={0.8} />
        </mesh>
        {/* Side Antennas/Fins - Realistic */}
        <group position={[0.3, 0.2, 0]} rotation={[0, 0, -0.1]}>
          <mesh>
            <boxGeometry args={[0.05, 0.7, 0.2]} />
            <meshStandardMaterial color={armorBlue} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.3]} />
            <meshStandardMaterial color={metalSilver} />
          </mesh>
        </group>
        <group position={[-0.3, 0.2, 0]} rotation={[0, 0, 0.1]}>
          <mesh>
            <boxGeometry args={[0.05, 0.7, 0.2]} />
            <meshStandardMaterial color={armorBlue} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.3]} />
            <meshStandardMaterial color={metalSilver} />
          </mesh>
        </group>
        {/* Glowing Eyes - Recessed */}
        <group position={[0, 0.05, 0.26]}>
          <mesh position={[-0.1, 0, 0]}>
            <planeGeometry args={[0.12, 0.05]} />
            <meshBasicMaterial color={glowBlue} />
            <pointLight intensity={1} distance={0.5} color={glowBlue} />
          </mesh>
          <mesh position={[0.1, 0, 0]}>
            <planeGeometry args={[0.12, 0.05]} />
            <meshBasicMaterial color={glowBlue} />
            <pointLight intensity={1} distance={0.5} color={glowBlue} />
          </mesh>
        </group>
      </group>

      {/* Torso Section */}
      <group ref={body} position={[0, 1.8, 0]}>
        {/* Main Chest Block - Beveled Look */}
        <mesh castShadow>
          <boxGeometry args={[1.6, 1.2, 1.0]} />
          <meshStandardMaterial color={armorRed} metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Chest Windows - With Internal Detail */}
        <group position={[0, 0.15, 0.51]}>
          {/* Spark / Matrix Core */}
          <mesh ref={coreRef} position={[0, 0, -0.2]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={glowBlue} emissive={glowBlue} emissiveIntensity={2} transparent />
          </mesh>
          <mesh position={[-0.38, 0, 0]}>
            <boxGeometry args={[0.6, 0.5, 0.05]} />
            <meshStandardMaterial color={glowBlue} transparent opacity={0.4} metalness={1} roughness={0} />
          </mesh>
          <mesh position={[0.38, 0, 0]}>
            <boxGeometry args={[0.6, 0.5, 0.05]} />
            <meshStandardMaterial color={glowBlue} transparent opacity={0.4} metalness={1} roughness={0} />
          </mesh>
          {/* Internal Wires/Details - More Complex */}
          <group position={[0, 0, -0.05]}>
            <mesh>
              <boxGeometry args={[1.4, 0.4, 0.02]} />
              <meshStandardMaterial color={metalDark} />
            </mesh>
            {/* Vertical Pistons behind glass */}
            <mesh position={[-0.3, 0, 0.01]}>
              <cylinderGeometry args={[0.02, 0.02, 0.4]} />
              <meshStandardMaterial color={metalSilver} metalness={1} />
            </mesh>
            <mesh position={[0.3, 0, 0.01]}>
              <cylinderGeometry args={[0.02, 0.02, 0.4]} />
              <meshStandardMaterial color={metalSilver} metalness={1} />
            </mesh>
          </group>
        </group>
        {/* Autobot Logo Placeholder - Geometric */}
        <group position={[0, 0.45, 0.51]}>
          <mesh>
            <boxGeometry args={[0.2, 0.2, 0.02]} />
            <meshStandardMaterial color={armorRed} metalness={1} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.1, 0.1, 0.01]} />
            <meshStandardMaterial color={metalSilver} metalness={1} />
          </mesh>
        </group>
        {/* Abdominal Grill - Realistic Slats */}
        <group position={[0, -0.85, 0.1]}>
          {[...Array(6)].map((_, i) => (
            <mesh key={i} position={[0, i * 0.1 - 0.25, 0.41]}>
              <boxGeometry args={[0.7, 0.04, 0.1]} />
              <meshStandardMaterial color={metalSilver} metalness={0.9} />
            </mesh>
          ))}
          {/* Side Ab Panels */}
          <mesh position={[0.45, 0, 0.35]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[0.2, 0.8, 0.1]} />
            <meshStandardMaterial color={armorRed} metalness={0.7} />
          </mesh>
          <mesh position={[-0.45, 0, 0.35]} rotation={[0, -0.2, 0]}>
            <boxGeometry args={[0.2, 0.8, 0.1]} />
            <meshStandardMaterial color={armorRed} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.9, 0.8]} />
            <meshStandardMaterial color={metalSilver} metalness={0.8} />
          </mesh>
        </group>
        {/* Shoulder Blocks - Layered */}
        <group position={[1.1, 0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.9, 0.9]} />
            <meshStandardMaterial color={armorRed} metalness={0.7} />
          </mesh>
          {/* Smokestacks - Perforated Look */}
          <group position={[0.2, 0.9, 0]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />
              <meshStandardMaterial color={metalSilver} metalness={1} />
            </mesh>
            {/* Perforation Details */}
            {[...Array(8)].map((_, i) => (
              <mesh key={i} position={[0, i * 0.15 - 0.6, 0.1]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[0.02]} />
                <meshBasicMaterial color="#000" />
              </mesh>
            ))}
          </group>
        </group>
        <group position={[-1.1, 0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.9, 0.9]} />
            <meshStandardMaterial color={armorRed} metalness={0.7} />
          </mesh>
          {/* Smokestacks - Perforated Look */}
          <group position={[-0.2, 0.9, 0]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />
              <meshStandardMaterial color={metalSilver} metalness={1} />
            </mesh>
            {[...Array(8)].map((_, i) => (
              <mesh key={i} position={[0, i * 0.15 - 0.6, 0.1]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[0.02]} />
                <meshBasicMaterial color="#000" />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* Arms - Detailed Joints */}
      <group ref={rightArm} position={[1.1, 1.8, 0]}>
        {/* Shoulder Joint */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color={metalDark} metalness={1} />
        </mesh>
        {/* Upper Arm */}
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.45, 0.7, 0.45]} />
          <meshStandardMaterial color={metalSilver} metalness={0.9} />
        </mesh>
        {/* Elbow Joint */}
        <mesh position={[0, -0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
          <meshStandardMaterial color={metalDark} metalness={1} />
        </mesh>
        {/* Forearm - Layered Armor */}
        <group position={[0, -1.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 1.0, 0.6]} />
            <meshStandardMaterial color={armorRed} metalness={0.7} />
          </mesh>
          {/* Yellow Stripes */}
          <mesh position={[0, 0, 0.31]}>
            <boxGeometry args={[0.4, 0.3, 0.02]} />
            <meshStandardMaterial color={detailYellow} />
          </mesh>
        </group>
        {/* Hand - Articulated Look */}
        <group position={[0, -2.0, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={armorBlue} metalness={0.8} />
          </mesh>
          {/* Finger Segments */}
          {[...Array(4)].map((_, i) => (
            <mesh key={i} position={[0.15 - i * 0.1, -0.3, 0.1]}>
              <boxGeometry args={[0.08, 0.2, 0.08]} />
              <meshStandardMaterial color={metalDark} />
            </mesh>
          ))}
          {/* Thumb */}
          <mesh position={[0.25, -0.15, 0.1]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.08, 0.2, 0.08]} />
            <meshStandardMaterial color={metalDark} />
          </mesh>
        </group>
      </group>
      <group ref={leftArm} position={[-1.1, 1.8, 0]}>
        {/* Shoulder Joint */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color={metalDark} metalness={1} />
        </mesh>
        {/* Upper Arm */}
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.45, 0.7, 0.45]} />
          <meshStandardMaterial color={metalSilver} metalness={0.9} />
        </mesh>
        {/* Elbow Joint */}
        <mesh position={[0, -0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
          <meshStandardMaterial color={metalDark} metalness={1} />
        </mesh>
        {/* Forearm - Layered Armor */}
        <group position={[0, -1.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 1.0, 0.6]} />
            <meshStandardMaterial color={armorRed} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.31]}>
            <boxGeometry args={[0.4, 0.3, 0.02]} />
            <meshStandardMaterial color={detailYellow} />
          </mesh>
        </group>
        {/* Hand - Articulated Look */}
        <group position={[0, -2.0, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={armorBlue} metalness={0.8} />
          </mesh>
          {/* Finger Segments */}
          {[...Array(4)].map((_, i) => (
            <mesh key={i} position={[-0.15 + i * 0.1, -0.3, 0.1]}>
              <boxGeometry args={[0.08, 0.2, 0.08]} />
              <meshStandardMaterial color={metalDark} />
            </mesh>
          ))}
          {/* Thumb */}
          <mesh position={[-0.25, -0.15, 0.1]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.08, 0.2, 0.08]} />
            <meshStandardMaterial color={metalDark} />
          </mesh>
        </group>
      </group>

      {/* Legs - Heavy Mechanical Detail */}
      <group position={[0, 0.8, 0]}>
        {/* Hips/Waist - Complex */}
        <group position={[0, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.4, 0.7, 0.8]} />
            <meshStandardMaterial color={metalSilver} metalness={0.8} />
          </mesh>
          {/* Waist Lights - Recessed */}
          <mesh position={[0.4, 0, 0.41]}>
            <boxGeometry args={[0.35, 0.25, 0.05]} />
            <meshStandardMaterial color={detailYellow} />
          </mesh>
          <mesh position={[-0.4, 0, 0.41]}>
            <boxGeometry args={[0.35, 0.25, 0.05]} />
            <meshStandardMaterial color={detailYellow} />
          </mesh>
        </group>
        
        {/* Right Leg */}
        <group ref={rightLeg} position={[0.5, -0.4, 0]}>
          {/* Thigh - Mechanical */}
          <group position={[0, -0.6, 0]}>
            <mesh>
              <boxGeometry args={[0.5, 1.2, 0.5]} />
              <meshStandardMaterial color={metalSilver} metalness={0.9} />
            </mesh>
            {/* Thigh Piston */}
            <mesh position={[0.2, 0, 0.2]}>
              <cylinderGeometry args={[0.05, 0.05, 1.0]} />
              <meshStandardMaterial color={metalDark} />
            </mesh>
          </group>
          {/* Knee Joint */}
          <mesh position={[0, -1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.5, 16]} />
            <meshStandardMaterial color={metalDark} metalness={1} />
          </mesh>
          {/* Lower Leg - Heavy Armor */}
          <group position={[0, -2.0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.8, 1.6, 0.8]} />
              <meshStandardMaterial color={armorBlue} metalness={0.8} />
            </mesh>
            {/* Vents - Detailed */}
            <group position={[0, 0, 0.41]}>
              {[...Array(4)].map((_, i) => (
                <mesh key={i} position={[0, i * 0.2 - 0.3, 0]}>
                  <boxGeometry args={[0.5, 0.05, 0.05]} />
                  <meshStandardMaterial color={metalSilver} />
                </mesh>
              ))}
            </group>
            {/* Mechanical Greebles on Leg */}
            <mesh position={[0, 0.5, 0.41]}>
              <boxGeometry args={[0.3, 0.1, 0.05]} />
              <meshStandardMaterial color={metalDark} />
            </mesh>
            {/* Side Detail (Yellow Circle) */}
            <mesh position={[0.41, -0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
              <meshStandardMaterial color={detailYellow} />
            </mesh>
          </group>
          {/* Foot - Blocky & Detailed */}
          <group position={[0, -3.0, 0.2]}>
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.5, 1.3]} />
              <meshStandardMaterial color={armorBlue} metalness={0.8} />
            </mesh>
            {/* Toe Detail - More Complex */}
            <group position={[0, -0.1, 0.6]}>
              <mesh>
                <boxGeometry args={[0.7, 0.2, 0.2]} />
                <meshStandardMaterial color={metalDark} />
              </mesh>
              <mesh position={[0, -0.05, 0.1]}>
                <boxGeometry args={[0.6, 0.05, 0.05]} />
                <meshStandardMaterial color={metalSilver} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Left Leg */}
        <group ref={leftLeg} position={[-0.5, -0.4, 0]}>
          {/* Thigh - Mechanical */}
          <group position={[0, -0.6, 0]}>
            <mesh>
              <boxGeometry args={[0.5, 1.2, 0.5]} />
              <meshStandardMaterial color={metalSilver} metalness={0.9} />
            </mesh>
            {/* Thigh Piston */}
            <mesh position={[-0.2, 0, 0.2]}>
              <cylinderGeometry args={[0.05, 0.05, 1.0]} />
              <meshStandardMaterial color={metalDark} />
            </mesh>
          </group>
          {/* Knee Joint */}
          <mesh position={[0, -1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.5, 16]} />
            <meshStandardMaterial color={metalDark} metalness={1} />
          </mesh>
          {/* Lower Leg - Heavy Armor */}
          <group position={[0, -2.0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.8, 1.6, 0.8]} />
              <meshStandardMaterial color={armorBlue} metalness={0.8} />
            </mesh>
            {/* Vents - Detailed */}
            <group position={[0, 0, 0.41]}>
              {[...Array(4)].map((_, i) => (
                <mesh key={i} position={[0, i * 0.2 - 0.3, 0]}>
                  <boxGeometry args={[0.5, 0.05, 0.05]} />
                  <meshStandardMaterial color={metalSilver} />
                </mesh>
              ))}
            </group>
            {/* Mechanical Greebles on Leg */}
            <mesh position={[0, 0.5, 0.41]}>
              <boxGeometry args={[0.3, 0.1, 0.05]} />
              <meshStandardMaterial color={metalDark} />
            </mesh>
            {/* Side Detail (Yellow Circle) */}
            <mesh position={[-0.41, -0.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
              <meshStandardMaterial color={detailYellow} />
            </mesh>
          </group>
          {/* Foot - Blocky & Detailed */}
          <group position={[0, -3.0, 0.2]}>
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.5, 1.3]} />
              <meshStandardMaterial color={armorBlue} metalness={0.8} />
            </mesh>
            {/* Toe Detail - More Complex */}
            <group position={[0, -0.1, 0.6]}>
              <mesh>
                <boxGeometry args={[0.7, 0.2, 0.2]} />
                <meshStandardMaterial color={metalDark} />
              </mesh>
              <mesh position={[0, -0.05, 0.1]}>
                <boxGeometry args={[0.6, 0.05, 0.05]} />
                <meshStandardMaterial color={metalSilver} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* Vehicle Wheels - Only visible in vehicle mode */}
      <group ref={wheelsRef} scale={0}>
        {/* Front Wheels */}
        <mesh position={[0.8, 0.5, 0.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-0.8, 0.5, 0.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* Rear Wheels */}
        <mesh position={[0.8, 0.5, -1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-0.8, 0.5, -1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.8, 0.5, -1.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-0.8, 0.5, -1.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
    </group>
  );
};

const Platform = ({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const currentScroll = scrollProgress.current;
    const transform = THREE.MathUtils.smoothstep(currentScroll, 0.05, 0.4);
    group.current.position.y = THREE.MathUtils.lerp(-2.8, -10, transform);
    group.current.position.x = THREE.MathUtils.lerp(2.5, 0, transform); // Follow robot's x position
    group.current.scale.setScalar(1 - transform);
  });

  return (
    <group ref={group} position={[0, -2.8, 0]}>
      {/* Main Base */}
      <mesh receiveShadow>
        <cylinderGeometry args={[3, 3.5, 0.5, 6]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Glowing Rim */}
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 2.9, 6]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.8} />
      </mesh>
      {/* Tech Details */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={1} />
      </mesh>
    </group>
  );
};

const Scene = ({ mouse, scrollProgress }: { mouse: React.MutableRefObject<[number, number]>, scrollProgress: React.MutableRefObject<number> }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 8]} fov={40} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#60a5fa" />
      <pointLight position={[0, 2, 5]} intensity={0.5} color="#ffffff" />
      
      <Robot mouse={mouse} scrollProgress={scrollProgress} />
      <Platform scrollProgress={scrollProgress} />

      <ContactShadows position={[0, -2.8, 0]} opacity={0.6} scale={15} blur={2} far={5} />
      <Environment preset="city" />
    </>
  );
};

// --- UI Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ABOUT', href: '#about' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'ACHIEVEMENTS', href: '#achievements' },
    { name: 'CERTIFICATIONS', href: '#certifications' },
    { name: 'JOURNEY', href: '#experience' },
    { name: 'CONTACT', href: '#contact' }
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-6 flex items-center justify-between",
      isScrolled ? "bg-primary/80 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent"
    )}>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-display font-black tracking-tighter text-white"
      >
        AMIT<span className="text-accent-purple">.</span>
      </motion.div>

      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((item, i) => (
          <motion.a 
            key={item.name} 
            href={item.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
          >
            {item.name}
          </motion.a>
        ))}
      </div>

      <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-secondary border-b border-white/5 p-8 flex flex-col gap-6 md:hidden"
          >
            {navLinks.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                className="text-sm font-bold tracking-widest text-zinc-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};

const Hero = () => {
  const [showCvModal, setShowCvModal] = useState(false);

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden pt-20">
      
      {/* Background Effects: Only glows, no pattern or noise */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 items-center h-full relative z-10">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-start"
        >

          {/* 🔥 Tag */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-4 py-1.5 rounded-full border border-accent-purple/30 bg-accent-purple/5 text-[10px] font-black tracking-[0.3em] text-accent-purple mb-6"
          >
            FULL STACK ENGINEER • AI SYSTEMS
          </motion.div>

          {/* 🔥 Name */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-8xl font-display font-black leading-[0.9] tracking-tighter mb-6"
          >
            AMIT <br />
            <span className="text-zinc-700">KUMAR</span>
          </motion.h1>

          {/* ⚡ Typing Effect */}
          <div className="text-accent-purple text-sm font-bold tracking-widest mb-4">
            <Typewriter
              options={{
                strings: [
                  "Building Scalable Systems",
                  "Crafting Clean Interfaces",
                  "Integrating AI into Products"
                ],
                autoStart: true,
                loop: true,
                cursor: '_',
                delay: 50,
                deleteSpeed: 30
              }}
            />
          </div>

          {/* 🧠 Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-zinc-400 text-lg max-w-md mb-6 leading-relaxed font-medium"
          >
            I design and build high-performance web applications, combining clean engineering 
            with AI to create smarter digital products.
          </motion.p>

          {/* 💎 One-liner */}
          <p className="text-white text-sm font-semibold italic mb-10">
            "Built for performance. Designed for impact."
          </p>

          {/* 🔗 Buttons */}
          <div className="flex flex-wrap gap-5">
            <a 
              href="/cv.pdf"
              download="Amit_Kumar_CV.pdf"
              className="px-8 py-4 rounded-xl btn-gradient text-white font-bold text-sm tracking-widest flex items-center gap-3 group"
            >
              DOWNLOAD CV
              <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
            
            <button 
              onClick={() => setShowCvModal(true)}
              className="px-8 py-4 rounded-xl btn-gradient text-white font-bold text-sm tracking-widest flex items-center gap-3 group"
            >
              VIEW CV
              <Eye className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>

            <div className="flex gap-4">
              <a href="https://github.com/Amitsingh9693" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
                <Github className="w-5 h-5 text-zinc-400" />
              </a>
              <a href="https://linkedin.com/in/amit-kumar1405" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
                <Linkedin className="w-5 h-5 text-zinc-400" />
              </a>
              <a href="mailto:amitsingh14506@gmail.com" className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
                <Mail className="w-5 h-5 text-zinc-400" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE (Placeholder for Robot) */}
        <div className="relative h-[500px] lg:h-full w-full flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 0.05, scale: 1, rotate: 0 }}
              transition={{ duration: 2 }}
              className="text-[22vw] font-black tracking-tighter absolute text-white/5 uppercase"
            >
              WELCOME
            </motion.div>
          </div>
        </div>
      </div>

      {/* CV Modal */}
      <AnimatePresence>
        {showCvModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCvModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/50">
                <h3 className="text-lg font-bold text-white tracking-widest">AMIT_KUMAR_CV.PDF</h3>
                <div className="flex items-center gap-4">
                  <a 
                    href="/cv.pdf"
                    download="Amit_Kumar_CV.pdf"
                    className="flex items-center gap-2 text-sm font-bold tracking-widest text-accent-cyan hover:text-accent-purple transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    DOWNLOAD
                  </a>
                  <button
                    onClick={() => setShowCvModal(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-400 hover:text-white" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-auto bg-zinc-950 p-4 md:p-8 flex items-center justify-center">
                {/* Using an iframe to display the PDF */}
                <iframe 
                  src="/cv.pdf" 
                  className="w-full h-[70vh] rounded-lg border border-white/5 bg-white"
                  title="Amit Kumar CV"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const About = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section
      id="about"
      className="py-32 relative overflow-hidden"
      ref={ref}
    >
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center p-12 md:p-20 rounded-[60px] border border-white/5 bg-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            
            {/* 🔥 Heading */}
            <h2 className="text-4xl md:text-7xl font-display font-black mb-10 leading-tight">
              ABOUT <span className="text-accent-purple">ME</span>
            </h2>

            {/* ✨ Paragraph 1 */}
            <p className="text-zinc-400 text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
              I began by exploring how things work — breaking, fixing, and learning along the way. 
              Over time, that turned into building real-world web applications.
            </p>

            {/* ✨ Paragraph 2 */}
            <p className="text-zinc-400 text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
              Today, I create simple, fast, and user-focused products using the MERN stack, 
              while using Generative AI to make them smarter and more useful.
            </p>

            {/* 💎 One-liner */}
            <p className="text-white text-lg font-semibold italic">
              "Simple ideas. Smart solutions. Real impact."
            </p>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "AI INTERVIEW SYSTEM",
      subtitle: "Simulating real-world interviews using AI",
      problem:
        "Preparing for technical interviews lacks real-time feedback and realistic simulation.",
      solution:
        "Built an AI-powered system that generates dynamic interview questions and evaluates responses using Generative AI.",
      tech: "MERN Stack • OpenAI API • Prompt Engineering",
      impact:
        "Improves interview readiness with instant feedback and realistic practice experience.",
      link: "https://github.com/Amitsingh9693/AI-Interview-Practice-System-",
      img: moketon,
    },
    {
      title: "GAME RECOMMENDATION SYSTEM",
      subtitle: "Personalized suggestions using ML logic",
      problem:
        "Users struggle to discover relevant games based on their preferences.",
      solution:
        "Developed a recommendation engine using collaborative filtering and content-based algorithms.",
      tech: "JavaScript • Algorithms • Data Filtering",
      impact:
        "Delivers personalized recommendations, improving user engagement.",
      link: "https://github.com/Amitsingh9693/Game-Recommendation-Bot",
      live: "https://amitsingh9693.github.io/Game-Recommendation-Bot/",
      img: gameguru,
    },
    {
      title: "CURRENCY CHATBOT",
      subtitle: "Real-time financial interaction",
      problem:
        "Currency conversion tools lack intuitive and interactive user experience.",
      solution:
        "Created a chat-based interface integrated with live exchange rate APIs for instant conversion.",
      tech: "HTML • CSS • JS • REST APIs",
      impact:
        "Fast, accurate, and user-friendly financial interactions.",
      link: "https://github.com/Amitsingh9693/Live-Currency-Converter",
      live: "https://profound-bunny-a5448e.netlify.app/",
      img: currencyconverter,
    },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white selection:bg-accent-purple/30" id="projects">
      
      {/* Background Effects: Removed */}

      {/* PROJECTS CONTENT */}
      <div className="container mx-auto px-6 md:px-12 z-10">
        <div className="rounded-[60px] p-12 md:p-20 border border-white/5 bg-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          
          {/* HEADER */}
          <div className="flex flex-col items-center text-center pb-24">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <div className="px-4 py-1.5 rounded-full border border-accent-purple/30 bg-accent-purple/5 text-[10px] font-black tracking-[0.3em] text-accent-purple mb-4 uppercase shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                SELECTED WORK
              </div>
              <h2 className="text-4xl md:text-7xl font-black">
                PROJECTS THAT <br />
                <span className="text-accent-purple">CREATE IMPACT</span>
              </h2>
            </motion.div>
          </div>

          {/* PROJECTS LIST */}
          <div className="grid gap-24">
            {projects.map((p, i) => {
              return (
                <div
                  key={i}
                  onClick={() => p.live && window.open(p.live, "_blank", "noopener,noreferrer")}
                  className={`grid lg:grid-cols-2 items-center gap-12 rounded-3xl p-8 md:p-12 border border-white/10 relative transition ${
                    p.live ? "cursor-pointer hover:scale-[1.01]" : ""
                  }`}
                >
              
              {/* LIVE BADGE */}
              {p.live && (
                <div className="absolute top-4 left-4 px-3 py-1 text-xs font-bold tracking-widest bg-green-500/20 text-green-400 border border-green-400/30 rounded-full">
                  LIVE
                </div>
              )}

              {/* LEFT TEXT */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="space-y-6"
              >
                <h3 className="text-3xl md:text-5xl font-black">
                  {p.title}
                </h3>
                <p className="text-accent-purple font-semibold">
                  {p.subtitle}
                </p>

                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p><span className="text-white font-semibold">Problem:</span> {p.problem}</p>
                  <p><span className="text-white font-semibold">Solution:</span> {p.solution}</p>
                  <p><span className="text-white font-semibold">Tech:</span> {p.tech}</p>
                  <p><span className="text-white font-semibold">Impact:</span> {p.impact}</p>
                </div>

                {/* LINKS */}
                <div className="flex gap-6">
                  <a
                    href={p.link}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-bold tracking-widest text-accent-purple hover:gap-4 transition-all"
                  >
                    VIEW PROJECT →
                  </a>

                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm font-bold tracking-widest text-green-400"
                    >
                      LIVE DEMO ↗
                    </a>
                  )}
                </div>
              </motion.div>

              {/* RIGHT IMAGE */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative"
              >
                <div className="overflow-hidden rounded-3xl border border-white/10">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition duration-700"
                  />
                </div>
              </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full flex items-center justify-center text-center py-24 z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-5xl font-bold"
        >
          MORE PROJECTS ON <br />
          <span className="text-accent-purple">GITHUB</span>
        </motion.h2>
      </div>
    </section>
  );
};

const Skills = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const skillGroups = [
    {
      title: 'FRONTEND',
      skills: [
        { name: 'React.js', icon: SiReact, color: '#61DAFB' },
        { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
        { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
        { name: 'HTML/CSS', icon: SiHtml5, color: '#E34F26' }
      ]
    },
    {
      title: 'BACKEND',
      skills: [
        { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
        { name: 'Express.js', icon: SiExpress, color: '#ffffff' },
        { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
        { name: 'REST APIs', icon: SiPostman, color: '#FF6C37' }
      ]
    },
    {
      title: 'TOOLS & LANGUAGES',
      skills: [
        { name: 'C++', icon: SiCplusplus, color: '#00599C' },
        { name: 'Java', icon: FaJava, color: '#007396' },
        { name: 'Git/GitHub', icon: SiGithub, color: '#ffffff' },
        { name: 'Generative AI', icon: SiOpenai, color: '#412991' }
      ]
    }
  ];

  return (
    <section id="skills" className="py-32 relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="text-[10px] font-black tracking-[0.3em] text-accent-purple mb-4 uppercase">Tech Stack</div>
          <TextReveal text="SKILLS." className="text-4xl md:text-6xl font-display font-black" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="glass p-8 rounded-[32px] border-white/5 hover:border-accent-purple/20 transition-all group/card"
            >
              <h3 className="text-xs font-black tracking-[0.2em] text-accent-purple mb-8 border-b border-white/5 pb-4 group-hover/card:text-white transition-colors">{group.title}</h3>
              <div className="space-y-6">
                {group.skills.map((skill, j) => (
                  <motion.div 
                    key={skill.name} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.1) + (j * 0.05) }}
                    className="flex items-center gap-4 group cursor-default"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-accent-purple/20 transition-all group-hover:scale-110 group-hover:rotate-6">
                      <skill.icon 
                        className="w-5 h-5 transition-all" 
                        style={{ color: skill.color }}
                      />
                    </div>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Achievements = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 🔥 Calculate streak from submission calendar
  const calculateStreak = (calendar: any) => {
    try {
      if (!calendar) return "N/A";
      const data = typeof calendar === "string" ? JSON.parse(calendar) : calendar;
      const daysSet = new Set(
        Object.keys(data).map((t) => Math.floor(parseInt(t) / 86400))
      );
      let today = Math.floor(Date.now() / 1000 / 86400);
      // 🔥 FIX: If no submission today, allow streak from yesterday
      if (!daysSet.has(today) && daysSet.has(today - 1)) {
        today = today - 1;
      }
      let streak = 0;
      while (daysSet.has(today)) {
        streak++;
        today--;
      }
      return streak;
    } catch (e) {
      console.error("Streak error:", e);
      return "N/A";
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(false);
      let data = null;

      // ✅ Try YOUR backend first
      try {
        const res = await fetch("http://localhost:5000/leetcode/AmitSingh9693");
        if (res.ok) {
          data = await res.json();
        }
      } catch (e) {
        console.log("Backend not running");
      }

      // ✅ Fallback to public API if backend fails
      if (!data) {
        const res2 = await fetch("https://leetcode-api-faisalshohag.vercel.app/AmitSingh9693");
        if (!res2.ok) throw new Error("All sources failed");
        const apiData = await res2.json();
        const streak = calculateStreak(apiData.submissionCalendar);
        data = {
          totalSolved: apiData.totalSolved ?? apiData.solvedProblem ?? 0,
          ranking: apiData.ranking ?? apiData.globalRanking ?? "N/A",
          streak,
          submissionCalendar: apiData.submissionCalendar,
        };
      }

      // 🔥 Add custom boost to streak
      if (data && data.streak !== "N/A") {
        data.streak = parseInt(data.streak as any) + 70;
      }
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const Counter = ({ value }: { value: any }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!value || value === "N/A") return;
      let start = 0;
      const end = parseInt(value);
      if (isNaN(end)) {
        setCount(value);
        return;
      }
      const step = Math.ceil(end / 40) || 1;
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 20);
      return () => clearInterval(timer);
    }, [value]);
    return <span>{value === "N/A" ? "N/A" : count}</span>;
  };

  const leetcodeStats = [
    { label: 'PROBLEMS SOLVED', value: stats?.totalSolved, icon: HelpCircle },
    { label: 'CODING STREAK', value: stats?.streak, icon: Flame, suffix: " DAYS" },
    { label: 'GLOBAL RANKING', value: stats?.ranking, icon: Trophy, prefix: "#" }
  ];

  return (
    <section id="achievements" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <SiLeetcode className="w-10 h-10 text-accent-purple" />
            <div className="text-[10px] font-black tracking-[0.3em] text-accent-purple uppercase">Competitive Programming</div>
          </div>
          <TextReveal text="LEETCODE DASHBOARD." className="text-4xl md:text-6xl font-display font-black" />
          <a 
            href="https://leetcode.com/u/AmitSingh9693/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-zinc-500 hover:text-accent-purple transition-colors mt-6 inline-flex items-center gap-2 tracking-[0.3em] uppercase"
          >
            VIEW PROFILE <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>

        {error && (
          <div className="text-center mb-12">
            <p className="text-red-400 mb-4">Failed to load stats</p>
            <button
              onClick={fetchStats}
              className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-accent-purple hover:text-white transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {leetcodeStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass p-10 rounded-[40px] border-white/5 text-center group hover:border-accent-purple/30 transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-accent-purple/20 transition-all group-hover:rotate-12 relative z-10"
              >
                <stat.icon className="w-8 h-8 text-zinc-500 group-hover:text-accent-purple transition-colors" />
              </motion.div>
              
              <div className="text-5xl font-display font-black text-white mb-3 relative z-10 min-h-[70px] flex items-center justify-center">
                {loading ? (
                  <div className="w-32 h-12 bg-white/5 animate-pulse rounded-2xl" />
                ) : error ? (
                  <span className="text-sm text-red-500/50 uppercase tracking-tighter">--</span>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                    className="flex items-baseline gap-1"
                  >
                    {stat.prefix && <span className="text-lg font-bold text-zinc-500">{stat.prefix}</span>}
                    <Counter value={stat.value} />
                    {stat.suffix && <span className="text-sm font-bold text-zinc-500 ml-1">{stat.suffix}</span>}
                  </motion.div>
                )}
              </div>
              <div className="text-xs font-black tracking-[0.2em] text-zinc-500 uppercase relative z-10">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center">
          <HeatMap data={stats?.submissionCalendar ? Object.entries(typeof stats.submissionCalendar === 'string' ? JSON.parse(stats.submissionCalendar) : stats.submissionCalendar).map(([timestamp, count]) => ({
            date: new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0],
            count: count as number
          })) : []} />
        </div>
      </div>
    </section>
  );
};

const Training = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="training" className="py-32 bg-secondary/20 relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 left-0 w-full h-full bg-accent-purple/5 blur-[120px] pointer-events-none" />
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="max-w-5xl mx-auto glass p-12 md:p-20 rounded-[60px] border-white/5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/10 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-purple/20 transition-colors duration-1000" />
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[10px] font-black tracking-[0.3em] text-accent-purple mb-6 uppercase"
            >
              Professional Training
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-black mb-10 leading-tight">
              FULL STACK (MERN) <br/>
              WITH <span className="text-accent-purple relative">
                GEN AI
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 h-1.5 bg-accent-purple/30 rounded-full"
                />
              </span>.
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  Completed an intensive full-stack development program at W3Grads, focused on the modern MERN stack and the integration of Generative AI into web applications.
                </p>
                <ul className="space-y-4">
                  {[
                    'Advanced React & Node.js Architecture',
                    'Generative AI Integration with LLMs',
                    'Secure Authentication & JWT Workflows',
                    'Scalable Database Design with MongoDB'
                  ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-center gap-4 text-sm font-bold text-zinc-300 group/item"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-purple group-hover/item:scale-150 transition-transform" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20, rotate: 2 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="glass p-10 rounded-[40px] border-white/10 bg-white/5 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="text-[10px] font-black tracking-widest text-accent-purple mb-6 uppercase">Tech Stack Mastered</div>
                <div className="flex flex-wrap gap-3">
                  {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Git', 'Generative AI'].map((tech, i) => (
                    <motion.span 
                      key={tech} 
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + i * 0.05 }}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.3)' }}
                      className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 transition-all cursor-default"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Timeline = ({ items, type = 'education' }: { items: any[], type?: 'education' | 'certification' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({
    container: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleX = useTransform(scrollXProgress, [0, 1], [0, 1]);

  return (
    <div className="relative w-full overflow-x-auto lg:overflow-visible pb-20 pt-20 no-scrollbar snap-x snap-mandatory">
      {/* Horizontal Line (Desktop) */}
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0">
        <motion.div 
          className="h-full bg-linear-to-r from-accent-purple via-blue-500 to-accent-purple shadow-[0_0_15px_rgba(124,58,237,0.5)]"
          style={{ scaleX, originX: 0 }}
        />
      </div>

      {/* Vertical Line (Mobile) */}
      <div className="lg:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-white/10 z-0">
        <motion.div 
          className="w-full bg-linear-to-b from-accent-purple via-blue-500 to-accent-purple shadow-[0_0_15px_rgba(124,58,237,0.5)]"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ originY: 0 }}
        />
      </div>

      <div ref={containerRef} className="flex lg:flex-row flex-col gap-16 lg:gap-0 lg:min-w-max px-6 md:px-12">
        {items.map((item, i) => {
          const isEven = i % 2 === 0;
          return (
            <div key={i} className="relative flex flex-col lg:items-center lg:w-[450px] snap-center pl-12 lg:pl-0">
              {/* Node (Desktop) */}
              <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center">
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.2, type: "spring", stiffness: 200 }}
                  className="w-5 h-5 rounded-full bg-accent-purple shadow-[0_0_20px_rgba(124,58,237,1)] border-4 border-primary"
                />
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1.5, opacity: 0.2 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.2, duration: 1, repeat: Infinity }}
                  className="absolute w-8 h-8 rounded-full bg-accent-purple"
                />
              </div>

              {/* Node (Mobile) */}
              <div className="lg:hidden absolute left-[-20px] top-4 z-10 flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.2, type: "spring", stiffness: 200 }}
                  className="w-4 h-4 rounded-full bg-accent-purple shadow-[0_0_15px_rgba(124,58,237,0.8)] border-4 border-primary"
                />
              </div>

              {/* Year Badge */}
              <motion.div
                initial={{ opacity: 0, y: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.2, duration: 0.8 }}
                className={cn(
                  "lg:absolute z-10",
                  isEven ? "lg:bottom-[calc(50%+50px)]" : "lg:top-[calc(50%+50px)]",
                  "mb-6 lg:mb-0"
                )}
              >
                <div className="px-5 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-[10px] font-black tracking-[0.2em] text-accent-purple whitespace-nowrap uppercase">
                  {item.year}
                </div>
              </motion.div>

              {/* Card */}
              <motion.div
                initial={{ opacity: 0, y: isEven ? 60 : -60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.2, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                className={cn(
                  "lg:absolute w-full lg:w-[400px] group",
                  isEven ? "lg:top-[calc(50%+50px)]" : "lg:bottom-[calc(50%+50px)]"
                )}
              >
                <div className="glass p-10 rounded-[40px] border-white/5 hover:border-accent-purple/30 hover:shadow-[0_0_40px_rgba(124,58,237,0.2)] transition-all duration-500 hover:scale-[1.03] bg-white/5 backdrop-blur-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {type === 'certification' && item.img && (
                    <div className="aspect-video w-full mb-8 rounded-[24px] overflow-hidden relative">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-display font-black mb-3 group-hover:text-accent-purple transition-colors uppercase tracking-tight leading-tight">{item.title}</h3>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-accent-purple rounded-full" />
                    <div className="text-sm font-bold text-zinc-300 uppercase tracking-wide">{item.subtitle}</div>
                  </div>
                  
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium italic">"{item.desc}"</p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CertificationSlider = ({ items }: { items: any[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [modalImg, setModalImg] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setScrollProgress(progress);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative group/slider w-full">
      {/* Navigation Buttons */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-accent-purple hover:border-accent-purple -translate-x-7 hidden md:flex shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      >
        <ArrowRight className="w-6 h-6 rotate-180" />
      </button>
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-accent-purple hover:border-accent-purple translate-x-7 hidden md:flex shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      >
        <ArrowRight className="w-6 h-6" />
      </button>

      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
        className={cn(
          "w-full flex gap-8 px-4 py-12 overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing flex-nowrap",
          isDragging && "scroll-auto"
        )}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ 
              delay: i * 0.1,
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
            className="min-w-[320px] md:min-w-[400px] flex-shrink-0 group"
          >
            <div 
              onClick={() => setModalImg(item.img)}
              className="glass p-8 rounded-[40px] border-white/5 hover:border-accent-purple/30 hover:shadow-[0_0_50px_rgba(124,58,237,0.2)] transition-all duration-700 hover:scale-[1.02] bg-white/5 backdrop-blur-2xl h-[580px] flex flex-col relative overflow-hidden cursor-pointer"
            >
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {item.img && (
                <div className="flex justify-center items-center mb-8 rounded-4xl overflow-hidden relative shadow-lg" style={{height: '240px'}}>
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-[240px] object-cover rounded-3xl" 
                    style={{width: '100%', height: '240px', imageRendering: 'auto'}} 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              )}
              
              <div className="px-5 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-[10px] font-black tracking-[0.2em] text-accent-purple whitespace-nowrap w-fit mb-6 uppercase">
                {item.year}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-display font-black mb-4 group-hover:text-accent-purple transition-colors uppercase tracking-tight leading-[1.1]">{item.title}</h3>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-accent-purple rounded-full" />
                <div className="text-sm font-bold text-zinc-300 uppercase tracking-wide">{item.subtitle}</div>
              </div>
              
              <p className="text-zinc-500 text-sm leading-relaxed flex-grow line-clamp-4 font-medium italic">
                "{item.desc}"
              </p>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <Award className="w-4 h-4 text-accent-purple" />
                  Verified
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImg(item.img);
                  }}
                  className="text-[10px] font-black text-accent-purple uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group/btn"
                >
                  VIEW CERTIFICATE
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Popup for Certificate Image */}
      {modalImg && (
        <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4" onClick={() => setModalImg(null)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-5xl w-full" 
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={modalImg} 
              alt="Certificate" 
              className="w-full h-auto rounded-3xl shadow-2xl border-2 border-accent-purple/30 bg-white" 
              style={{ maxHeight: '85vh', objectFit: 'contain' }} 
            />
            <button 
              className="absolute -top-4 -right-4 bg-accent-purple text-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-[1001]" 
              onClick={(e) => {
                e.stopPropagation();
                setModalImg(null);
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="max-w-md mx-auto h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
        <motion.div 
          className="h-full bg-accent-purple shadow-[0_0_10px_rgba(124,58,237,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
};

const Experience = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const education = [
    { 
      year: '2023 - PRESENT', 
      title: 'LOVELY PROFESSIONAL UNIVERSITY', 
      subtitle: 'B.Tech in Computer Science', 
      desc: 'Pursuing B.Tech with focus on software engineering. CGPA: 8.03' 
    },
    { 
      year: '2021 - 2023', 
      title: 'ST. JUDE\'S VIDYALAYA', 
      subtitle: 'Intermediate (Science)', 
      desc: 'Higher secondary education. Percentage: 67.6%' 
    },
    { 
      year: '2020 - 2021', 
      title: 'ST. JUDE\'S VIDYALAYA', 
      subtitle: 'Matriculation', 
      desc: 'Secondary education. Percentage: 80.2%' 
    }
  ];

  const certifications = [
    { 
      year: 'APRIL 2025', 
      title: 'CLOUD COMPUTING', 
      subtitle: 'NPTEL | Certified', 
      desc: 'Certification in Cloud Computing fundamentals and architecture.',
      img: cloudImg
    },
    { 
      year: 'JULY 2025', 
      title: 'FULL STACK (MERN)', 
      subtitle: 'W3Grad | Gen AI Integration', 
      desc: 'Intensive MERN stack training with Generative AI integration.',
      img: mern
    },
    { 
      year: 'FEB 2026', 
      title: 'OCI AI FOUNDATIONS', 
      subtitle: 'Oracle | 2025 Certified Associate', 
      desc: 'Certified in Oracle Cloud Infrastructure AI Foundations.',
      img: Ai
    },
    { 
      year: 'AUG 2025', 
      title: 'PROMPT ENGINEERING', 
      subtitle: 'Infosys | ChatGPT-4 & LLM', 
      desc: 'Advanced certification in prompt engineering, covering ChatGPT, Generative AI & LLM.',
      img: prompt
    }
  ];

  return (
    <section id="experience" className="py-32 relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6 md:px-12">
        {/* Education Section */}
        <div className="mb-48 relative">
          <FloatingElements />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative z-10"
          >
            <div className="text-[10px] font-black tracking-[0.3em] text-accent-purple mb-4 uppercase">Academic Background</div>
            <TextReveal text="EDUCATION." className="text-4xl md:text-6xl font-display font-black" />
          </motion.div>
          
          <div className="lg:h-[600px] flex items-center relative z-10">
            <Timeline items={education} type="education" />
          </div>
        </div>

        {/* Certifications Section */}
        <div className="relative" id="certifications">
          <FloatingElements />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative z-10"
          >
            <div className="text-[10px] font-black tracking-[0.3em] text-accent-purple mb-4 uppercase">Professional Growth</div>
            <TextReveal text="CERTIFICATIONS." className="text-4xl md:text-6xl font-display font-black" />
          </motion.div>
          
          <div className="relative z-10">
            <CertificationSlider items={certifications} />
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="contact" className="py-32 relative" ref={ref}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-accent-purple/5 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass p-12 md:p-20 rounded-[40px] border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-7xl font-display font-black mb-8 leading-[0.9] tracking-tighter">
                LET'S <span className="text-accent-purple italic">BUILD</span><br/>
                SOMETHING <span className="text-accent-purple">GREAT.</span>
              </h2>
              <p className="text-zinc-400 mb-12 leading-relaxed text-lg max-w-md">
                Have a project in mind or just want to say hi? Feel free to reach out. I'm always open to new opportunities and collaborations.
              </p>
              <div className="space-y-8">
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-6 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 flex items-center justify-center group-hover:bg-accent-purple transition-all duration-500">
                    <Mail className="w-6 h-6 text-accent-purple group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-1">EMAIL</div>
                    <div className="font-bold text-lg group-hover:text-accent-purple transition-colors">amitsingh14506@gmail.com</div>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-6 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 flex items-center justify-center group-hover:bg-accent-purple transition-all duration-500">
                    <Globe className="w-6 h-6 text-accent-purple group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-1">LOCATION</div>
                    <div className="font-bold text-lg group-hover:text-accent-purple transition-colors">Phagwara, Punjab</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.form 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="relative group"
                >
                  <input type="text" placeholder="NAME" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xs font-bold tracking-widest focus:border-accent-purple outline-none transition-all focus:bg-white/10" />
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent-purple group-focus-within:w-full transition-all duration-500" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="relative group"
                >
                  <input type="email" placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xs font-bold tracking-widest focus:border-accent-purple outline-none transition-all focus:bg-white/10" />
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent-purple group-focus-within:w-full transition-all duration-500" />
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="relative group"
              >
                <input type="text" placeholder="SUBJECT" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xs font-bold tracking-widest focus:border-accent-purple outline-none transition-all focus:bg-white/10" />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent-purple group-focus-within:w-full transition-all duration-500" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="relative group"
              >
                <textarea placeholder="MESSAGE" rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xs font-bold tracking-widest focus:border-accent-purple outline-none transition-all focus:bg-white/10 resize-none" />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent-purple group-focus-within:w-full transition-all duration-500" />
              </motion.div>
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 15px 40px rgba(124,58,237,0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 rounded-2xl btn-gradient text-white font-black text-xs tracking-[0.4em] shadow-[0_10px_30px_rgba(124,58,237,0.3)] transition-all flex items-center justify-center gap-3 group"
              >
                SEND MESSAGE
                <Send className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-xl font-display font-black tracking-tighter">
          AMIT<span className="text-accent-purple">.</span>
        </div>
        <div className="text-[10px] font-bold tracking-widest text-zinc-600">
          © 2026 AMIT KUMAR. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-6">
          <a href="https://github.com/Amitsingh9693" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://linkedin.com/in/amit-kumar1405" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-white transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="mailto:amitsingh14506@gmail.com" className="text-zinc-600 hover:text-white transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};




// --- Glitch Loader Component ---
const glitchFrames = [
  '█ ▒ ▓ ░ █ ▒ ▓ ░',
  '█▓▒░█▓▒░█▓▒░█▓▒░',
  '█▒░█▒░█▒░█▒░█▒░█',
  '█ ▒ ▓ ░ █ ▒ ▓ ░',
  '█▓▒░█▓▒░█▓▒░█▓▒░',
  '█▒░█▒░█▒░█▒░█▒░█',
  '█ ▒ ▓ ░ █ ▒ ▓ ░',
  '█▓▒░█▓▒░█▓▒░█▓▒░',
  '█▒░█▒░█▒░█▒░█▒░█',
  '█ ▒ ▓ ░ █ ▒ ▓ ░',
  '█▓▒░█▓▒░█▓▒░█▓▒░',
  '█▒░█▒░█▒░█▒░█▒░█',
  '█ ▒ ▓ ░ █ ▒ ▓ ░',
  '█▓▒░█▓▒░█▓▒░█▓▒░',
  '█▒░█▒░█▒░█▒░█▒░█',
  '█ ▒ ▓ ░ █ ▒ ▓ ░',
  '█▓▒░█▓▒░█▓▒░█▓▒░',
  '█▒░█▒░█▒░█▒░█▒░█',
  '█ ▒ ▓ ░ █ ▒ ▓ ░',
  '█▓▒░█▓▒░█▓▒░█▓▒░',
  '█▒░█▒░█▒░█▒░█▒░█',
];

function GlitchLoader() {
  const [frame, setFrame] = useState(0);
  const [showName, setShowName] = useState(false);
  useEffect(() => {
    if (frame < glitchFrames.length - 1) {
      const t = setTimeout(() => setFrame(frame + 1), 60 + Math.random() * 60);
      return () => clearTimeout(t);
    } else {
      setTimeout(() => setShowName(true), 350);
    }
  }, [frame]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      style={{ background: 'repeating-linear-gradient(90deg, #18182A 0 2px, #0A0A1A 2px 8px)' }}
    >
      <div className="relative flex flex-col items-center">
        {/* Flicker Overlay */}
        <motion.div 
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 0.5, 0.1, 0.4, 0.2] }}
          transition={{ duration: 0.7, repeat: Infinity, repeatType: 'mirror' }}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'linear-gradient(180deg, transparent 80%, #fff1 100%)' }}
        />
        {/* Glitch Text */}
        {!showName ? (
          <motion.div
            key="glitch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, filter: [
              'contrast(1.5) brightness(1.2)',
              'contrast(2.5) brightness(2.2) hue-rotate(30deg)',
              'contrast(1.2) brightness(0.8) hue-rotate(-30deg)',
              'contrast(1.5) brightness(1.2)'
            ] }}
            transition={{ duration: 0.2 }}
            className="text-4xl md:text-6xl font-black tracking-widest text-accent-purple select-none"
            style={{ letterSpacing: '0.2em', textShadow: '0 0 12px #8B5CF6, 0 0 2px #fff' }}
          >
            {glitchFrames[frame]}
          </motion.div>
        ) : (
          <motion.div
            key="name"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-black tracking-widest bg-gradient-to-r from-accent-purple via-white to-accent-purple bg-clip-text text-transparent select-none drop-shadow-2xl"
            style={{ letterSpacing: '0.18em', textShadow: '0 0 24px #8B5CF6, 0 0 2px #fff' }}
          >
            AMIT SINGH
          </motion.div>
        )}
        {/* Scanline effect */}
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: ['-100%', '120%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 w-full h-2 bg-gradient-to-r from-white/30 via-accent-purple/60 to-white/30 opacity-40 blur-sm z-20"
        />
      </div>
    </motion.div>
  );
}
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const scrollProgress = useRef(0);
  const mouse = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      scrollProgress.current = Math.min(Math.max(progress, 0), 1);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ];
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a1a] to-[#18181b] text-white selection:bg-accent-cyan/30 overflow-x-hidden">
      <StarsBackground count={300} />
      <CursorGlow />

      <AnimatePresence>
        {isLoading && <GlitchLoader />}
      </AnimatePresence>

      {/* Fixed 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas shadows dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene mouse={mouse} scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Achievements />
        <Training />
        <Experience />
        <Contact />
        <Footer />
      </div>

      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-purple/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-purple/5 rounded-full blur-[150px]" />
      </div>
    </div>
  );
}

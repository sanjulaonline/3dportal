import { Environment, MeshPortalMaterial, OrbitControls, useTexture, RoundedBox, PositionPoint, Text, CameraControls } from "@react-three/drei";
import * as THREE from "three"
import { Alien } from "./Alien";
import { Ninja } from "./Ninja";
import { Orc_Skull } from "./Orc_Skull";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";


export const Experience = () => {

  const [active, setActive] = useState(null);
const [hovered, setHovered] = useState(null);
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt( 0, 0, 5, targetPosition.x, targetPosition.y, targetPosition.z, true)
    } else {
      controlsRef.current.setLookAt( 0, 0, 9, 0, 0, 0, true)
    }
  }, [active])
  
  return (
    <>
    <ambientLight intensity={0.5}/>
    <Environment preset="sunset"/>
    <CameraControls ref={controlsRef} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4}/>
    <MonsterStage texture={"textures/anime_art_style_a_water_based_pokemon_like_environ.jpg"} color="#713b8e" name="Alien" active={active} setActive={setActive} hovered={hovered} setHovered={setHovered}>
      <Alien scale={0.6} position-y={-1} hovered={ hovered === "Alien"}/>
    </MonsterStage>
    <MonsterStage texture={"textures/anime_art_style_cactus_forest.jpg"} color="#131111" name="Ninja" position-x={-3.1} rotation-y={Math.PI/8} active={active} setActive={setActive} hovered={hovered} setHovered={setHovered}>
      <Ninja scale={0.7} position-y={-1} hovered={ hovered === "Ninja"}/>
    </MonsterStage>
    <MonsterStage texture={"textures/dragon.png"} color="#62762b" name="Deamon" position-x={3.1} rotation-y={-Math.PI/8} active={active} setActive={setActive} hovered={hovered} setHovered={setHovered}>
      <Orc_Skull scale={0.7} position-y={-1} hovered={ hovered === "Deamon"}/>
    </MonsterStage>
    </>
  );
};


const MonsterStage = ({ children, texture, name, color, active, setActive, hovered, setHovered,...props}) => {
  const map = useTexture (texture);
  const portalMaterial = useRef();

  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.3,  delta)
  })

  return (<group{...props}>
    <Text font="fonts/DelaGothicOne-Regular.ttf" fontSize={0.3} position={[0, -1.3, 0.06]} anchorY={"bottom"}>{name}<meshBasicMaterial color={color} toneMapped={false}/></Text>
    <RoundedBox name={name} args={[3, 4, 0.1]} onDoubleClick={() => setActive( active === name ? null : name)} onPointerClick={() => setActive(active === name ? null : name)} onPointerEnter={() => setHovered(name)} onPointerLeave={() => setHovered(null)}>
        <MeshPortalMaterial side={THREE.DoubleSide} ref={portalMaterial}>
        <ambientLight intensity={0.5}/>
        <Environment preset="sunset"/>
        {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]}/>
            <meshStandardMaterial map ={map} side={THREE.BackSide}/>
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>)
}
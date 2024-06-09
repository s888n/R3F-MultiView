/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
	View,
	Center,
	Environment,
	OrbitControls,
	PivotControls,
	RandomizedLight,
	OrthographicCamera,
	AccumulativeShadows,
	Text,
} from "@react-three/drei";
import { useRef, forwardRef } from "react";
import { create } from "zustand";

const matrix = new THREE.Matrix4();
const positions = {
	Right: [10, 0, 0],
	Left: [-10, 0, 0],
	Top: [0, 10, 0],
	Bottom: [0, -10, 0],
	Front: [0, 0, 10],
	Back: [0, 0, -10],
};
const useStore = create((set) => ({
	projection: "Perspective",
	top: "Back",
	middle: "Top",
	bottom: "Right",
	setPanelView: (wich, view) => set({ [wich]: view }),
	setProjection: (projection) => set({ projection }),
}));

const Cube = () => {
	const ref = useRef();
	useFrame(() => {
		ref.current.rotation.x = ref.current.rotation.y += 0.01;
	});
	return (
		<mesh position={[0, 0, 0]} castShadow receiveShadow ref={ref}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color="red" />
		</mesh>
	);
};

function PanelCamera({ which }) {
	const view = useStore((state) => state[which]);
	return (
		<OrthographicCamera makeDefault position={positions[view]} zoom={100} />
	);
}

function Scene({ background = "white", children, ...props }) {
	return (
		<>
			<color attach="background" args={[background]} />
			<ambientLight />
			<directionalLight
				position={[10, 10, -15]}
				castShadow
				shadow-bias={-0.0001}
				shadow-mapSize={1024}
			/>
			<Environment preset="city" />
			<group
				matrixAutoUpdate={false}
				onUpdate={(self) => (self.matrix = matrix)}
				{...props}
			>
				<Center>
					<Text color="black" fontSize={0.5} position={[0, 2, 0]}>
						Hello World
					</Text>
					<Cube />
				</Center>
				{children}
			</group>
		</>
	);
}
// i want to split the canvas into 2 panels on the top and bottom
const TopPanel = forwardRef(function TopPanel({ children }, fref) {
	return (
		<div ref={fref} className="panel">
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "50%",
					border: "2px solid black",
				}}
			>
				{children}
			</View>
		</div>
	);
});

const BottomPanel = forwardRef(function BottomPanel(
	{ children, ...props },
	fref
) {
	return (
		<div ref={fref} className="panel">
			<View
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					width: "100%",
					height: "50%",
					border: "2px solid black",
				}}
			>
				{children}
			</View>
		</div>
	);
});

function App() {
	const view1 = useRef();
	const view2 = useRef();
	return (
		<div className="App">
			<Canvas
				shadows
				// frameloop="demand"
				eventSource={document.getElementById("root")}
			>
				<View.Port />
			</Canvas>
			<TopPanel ref={view1}>
				<PivotControls scale={0.4} depthTest={false} matrix={matrix} />
				<Scene background="aquamarine" matrix={matrix}>
					<PanelCamera which="top" />
					{/* <perspectiveCamera makeDefault position={[0, 0, -100]} /> */}
					<AccumulativeShadows
						temporal
						frames={100}
						position={[0, -0.4, 0]}
						scale={14}
						alphaTest={0.85}
						color="orange"
						colorBlend={0.5}
					>
						<RandomizedLight
							amount={8}
							radius={8}
							ambient={0.5}
							position={[5, 5, -10]}
							bias={0.001}
						/>
					</AccumulativeShadows>
				</Scene>
				<OrbitControls makeDefault />
			</TopPanel>
			<BottomPanel ref={view2}>
				{/* <PanelCamera which="front" /> */}
				<PivotControls scale={0.4} depthTest={false} matrix={matrix} />
				<Scene background="aquamarine" matrix={matrix}>
					<AccumulativeShadows
						temporal
						frames={100}
						position={[0, -0.4, 0]}
						scale={14}
						alphaTest={0.85}
						color="orange"
						colorBlend={0.5}
					>
						<RandomizedLight
							amount={8}
							radius={8}
							ambient={0.5}
							position={[5, 5, -10]}
							bias={0.001}
						/>
					</AccumulativeShadows>
				</Scene>
				<OrbitControls makeDefault />
			</BottomPanel>
		</div>
	);
}

export default App;

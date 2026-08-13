import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

AOS.init({once:true,duration:850,easing:'ease-out-cubic',offset:80});

const canvas=document.querySelector('#scene');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(42,1,.1,100); camera.position.z=6.8;
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
canvas.replaceWith(renderer.domElement); renderer.domElement.id='scene';
const view=renderer.domElement;

const group=new THREE.Group(); scene.add(group);
const points=new THREE.Points(new THREE.IcosahedronGeometry(1.75,6),new THREE.PointsMaterial({color:0xc7ff35,size:.018,transparent:true,opacity:.8,sizeAttenuation:true}));
group.add(points);
const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.58,3),new THREE.MeshBasicMaterial({color:0x111111,wireframe:true,transparent:true,opacity:.07})); group.add(wire);
const starGeo=new THREE.BufferGeometry(),count=650,arr=new Float32Array(count*3);
for(let i=0;i<arr.length;i++)arr[i]=(Math.random()-.5)*14;
starGeo.setAttribute('position',new THREE.BufferAttribute(arr,3));
scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0x77736a,size:.012,transparent:true,opacity:.32})));
let tx=0,ty=0,sy=0;
addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*.75;ty=(e.clientY/innerHeight-.5)*.5});
addEventListener('scroll',()=>sy=scrollY,{passive:true});
function resize(){const box=view.getBoundingClientRect(),w=Math.max(1,box.width),h=Math.max(1,box.height);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}
resize(); addEventListener('resize',resize);
function animate(){requestAnimationFrame(animate);group.rotation.y+=(tx-group.rotation.y)*.025+.0012;group.rotation.x+=(ty-group.rotation.x)*.025;wire.rotation.y-=.0007;wire.rotation.x+=.0004;group.position.y=-Math.min(sy*.0018,.55);renderer.render(scene,camera)} animate();

const speedEls=document.querySelectorAll('[data-speed]');
function parallax(){speedEls.forEach(el=>{const speed=parseFloat(el.dataset.speed)||.1;el.style.transform=`translate3d(${scrollY*speed}px,0,0)`});requestAnimationFrame(parallax)} parallax();

const projects=document.querySelectorAll('.project');
projects.forEach(p=>p.addEventListener('pointermove',e=>{const r=p.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;p.style.transform=`perspective(900px) rotateX(${y*-2.2}deg) rotateY(${x*2.2}deg)`}));
projects.forEach(p=>p.addEventListener('pointerleave',()=>p.style.transform=''));

const links=document.querySelectorAll('a');
links.forEach(a=>{a.addEventListener('pointerenter',()=>document.body.classList.add('link-hover'));a.addEventListener('pointerleave',()=>document.body.classList.remove('link-hover'))});

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'})}}));
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (window.AOS) AOS.init({once:true,duration:650,easing:'ease-out-cubic',offset:80,disable:reduced});

const canvas=document.querySelector('#scene');
if(canvas){
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.z=6.2;
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
 const group=new THREE.Group();scene.add(group);
 const points=new THREE.Points(new THREE.IcosahedronGeometry(1.75,5),new THREE.PointsMaterial({color:0xff9100,size:.018,transparent:true,opacity:.72,sizeAttenuation:true}));group.add(points);
 const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.58,3),new THREE.MeshBasicMaterial({color:0xffb34a,wireframe:true,transparent:true,opacity:.2}));group.add(wire);
 const inner=new THREE.Mesh(new THREE.IcosahedronGeometry(1.18,2),new THREE.MeshBasicMaterial({color:0xff9100,wireframe:true,transparent:true,opacity:.12}));group.add(inner);
 const starGeo=new THREE.BufferGeometry(),count=700,arr=new Float32Array(count*3);for(let i=0;i<arr.length;i++)arr[i]=(Math.random()-.5)*14;starGeo.setAttribute('position',new THREE.BufferAttribute(arr,3));scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0x77736a,size:.012,transparent:true,opacity:.28})));
 const light=new THREE.PointLight(0xff9100,5,9);light.position.set(2,2,3);scene.add(light);
 let tx=0,ty=0,sy=0;addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*.8;ty=(e.clientY/innerHeight-.5)*.5});addEventListener('scroll',()=>sy=scrollY,{passive:true});
 function resize(){const r=canvas.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}resize();addEventListener('resize',resize);
 function animate(){requestAnimationFrame(animate);if(!reduced){group.rotation.y+=(tx-group.rotation.y)*.025+.0014;group.rotation.x+=(ty-group.rotation.x)*.025;wire.rotation.y-=.0008;inner.rotation.y+=.001;group.position.y=-Math.min(sy*.0016,.5)}renderer.render(scene,camera)}animate();
}

const speedEls=document.querySelectorAll('[data-speed]');
if(!reduced){let ticking=false;addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{speedEls.forEach(el=>{const speed=parseFloat(el.dataset.speed)||.1;el.style.transform=`translate3d(${scrollY*speed}px,0,0)`});ticking=false})},{passive:true})}

const projects=document.querySelectorAll('.project');
if(!reduced){projects.forEach(p=>p.addEventListener('pointermove',e=>{const r=p.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;p.style.transform=`perspective(1000px) rotateX(${y*-1.5}deg) rotateY(${x*1.5}deg)`}));projects.forEach(p=>p.addEventListener('pointerleave',()=>p.style.transform=''))}

const links=document.querySelectorAll('a');links.forEach(a=>{a.addEventListener('pointerenter',()=>document.body.classList.add('link-hover'));a.addEventListener('pointerleave',()=>document.body.classList.remove('link-hover'))});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:reduced?'auto':'smooth'})}}));
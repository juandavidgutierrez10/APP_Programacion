// Ejecuta TODOS los bloques `codigo` ejecutables (y los `ejemplo` de tutor) de una unidad en el simulador y con Java real; avisa de diferencias.
const fs=require('fs'),cp=require('child_process'),vm=require('vm');
require('../js/java-sim.js'); const {run}=require('../js/java-run.js');
const ut=process.argv[2]||'ut4'; let U; global.registrarUnidad=u=>{U=u}; global.window=global;
vm.runInThisContext(fs.readFileSync(__dirname+'/../contenido/'+ut+'.js','utf8'));
const env={...process.env}; delete env.JAVA_TOOL_OPTIONS;
const items=[];
const walk=(bl,sec)=>bl.forEach(b=>{ if(b.t==='codigo'&&b.ejecutable) items.push([sec,b.titulo,b.code,b.stdin||'']); if(b.bloques) walk(b.bloques,sec); });
U.secciones.forEach(s=>{ walk(s.bloques,s.id); ((s.tutor||{}).pasos||[]).forEach(p=>{ if(p.ejemplo&&p.ejemplo.ejecutable) items.push([s.id,'tutor: '+p.titulo,p.ejemplo.code,'']); }); });
let ok=0, bad=0, ce=0;
items.forEach(([sec,t,code,inp],i)=>{
  const dir='/tmp/ej_'+ut+'_'+i; fs.mkdirSync(dir,{recursive:true});
  const m=/public\s+class\s+(\w+)/.exec(code)||/class\s+(\w+)/.exec(code); const cls=m?m[1]:'Main';
  let src=code; if(!m){ const L=code.split('\n'); src=L.filter(l=>/^import /.test(l)).join(' ')+' public class Main { public static void main(String[] args) { '+L.filter(l=>!/^import /.test(l)).join('\n')+' } }'; }
  const name=m?cls:'Main'; fs.writeFileSync(dir+'/'+name+'.java',src);
  const c=cp.spawnSync('javac',['-encoding','UTF-8','-d',dir,dir+'/'+name+'.java'],{encoding:'utf8',env});
  const sim=run(code,inp,{});
  if(c.status!==0){ const simCE=sim.error&&sim.error.kind==='compile'; if(simCE){ce++;console.log('  (error de compilación esperado, el sim también lo da)',sec,'|',t);} else {bad++;console.log('DIFF: Java no compila pero el sim sí →',sec,'|',t);} return; }
  const r=cp.spawnSync('java',['-Duser.language=es','-Duser.country=ES','-Dfile.encoding=UTF-8','-Dstdout.encoding=UTF-8','-cp',dir,name],{input:inp,encoding:'utf8',env});
  const simOut=sim.out.filter(o=>!o.err).map(o=>o.s).join('');
  if(sim.error&&sim.error.kind!=='runtime'){bad++;console.log('SIM ERROR',sec,'|',t,'→',sim.error.msg);return;}
  if(simOut!==r.stdout){bad++;console.log('DIFF salida',sec,'|',t,'\n  real:',JSON.stringify(r.stdout),'\n  sim :',JSON.stringify(simOut));return;}
  ok++;
});
console.log(ut,': ejecutables',items.length,'OK',ok,'compile-error esperado',ce,'PROBLEMAS',bad);

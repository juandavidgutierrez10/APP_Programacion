// Prueba diferencial: ejecuta cada programa con Java real y con el simulador y compara.
const fs=require('fs'),path=require('path'),cp=require('child_process');
require('../js/java-sim.js'); const {run}=require('../js/java-run.js');
const cleanEnv={...process.env}; delete cleanEnv.JAVA_TOOL_OPTIONS;
const dir=path.join(__dirname,'progs'); const only=process.argv[2];
let ok=0,bad=0; const fails=[];
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.java')).sort()){
  if(only&&!f.includes(only))continue;
  const name=f.replace('.java',''); const src=fs.readFileSync(path.join(dir,f),'utf8');
  const inp=fs.existsSync(path.join(dir,name+'.in'))?fs.readFileSync(path.join(dir,name+'.in'),'utf8'):'';
  const tmp='/tmp/jt/'+name; fs.mkdirSync(tmp,{recursive:true});
  const cm=(/public\s+class\s+(\w+)/.exec(src)||/class\s+(\w+)/.exec(src)); if(!cm){continue;} const cls=cm[1];
  fs.writeFileSync(path.join(tmp,cls+'.java'),src);
  const ea=/\/\/ ea/.test(src)?['-ea']:[];
  const c=cp.spawnSync('javac',['-encoding','UTF-8','-d',tmp,path.join(tmp,cls+'.java')],{encoding:'utf8',env:cleanEnv});
  let real;
  if(c.status!==0){real={compileError:true,text:''};}
  else{ const r=cp.spawnSync('java',[...ea,'-Duser.language=es','-Duser.country=ES','-Dfile.encoding=UTF-8','-Dstdout.encoding=UTF-8','-cp',tmp,cls],{input:inp,encoding:'utf8',env:cleanEnv}); real={text:r.stdout, err:r.stderr.split('\n')[0]||''}; }
  const sim=run(src,inp,{assertions:!!ea.length});
  let good;
  if(real.compileError){ if(f.startsWith('x_')){continue;} good=sim.error&&sim.error.kind==='compile'; }
  else { good=!(sim.error&&sim.error.kind!=='runtime') && sim.out.filter(o=>!o.err).map(o=>o.s).join('')===real.text; if(good && real.err){ const simErr=(sim.out.find(o=>o.err)||{s:''}).s.split('\n')[0]; const nz=x=>x.replace(/^Exception in thread "main" /,'').replace(/(NullPointerException: Cannot [a-z]+ .*? because ).*/,'$1X'); good=nz(simErr)===nz(real.err); } else if(good && !real.err && sim.uncaught) good=false; }
  if(good) ok++; else {bad++; fails.push({f,real,sim:{text:sim.out.map(o=>o.s).join(''),error:sim.error}});}
}
console.log('OK',ok,'FALLOS',bad);
for(const x of fails){console.log('\n=== FALLO',x.f); console.log('REAL:',JSON.stringify(x.real).slice(0,600)); console.log('SIM :',JSON.stringify(x.sim).slice(0,600));}
process.exit(bad?1:0);

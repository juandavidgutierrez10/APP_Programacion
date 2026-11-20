// Valida el contenido: node tests/validar_contenido.js [utN] [--java]
// Comprueba estructura, salidas del simulador y (con --java) contra Java real.
const fs=require('fs'),path=require('path'),cp=require('child_process');
require('../js/java-sim.js');const {run}=require('../js/java-run.js');
const only=process.argv.find(a=>/^ut\d$/.test(a)),useJava=process.argv.includes('--java');
const env={...process.env};delete env.JAVA_TOOL_OPTIONS;
const dir=path.join(__dirname,'..','contenido');let errs=0,checks=0;
const bad=(u,w,m)=>{errs++;console.log('✗ ['+u+'] '+w+': '+m);};
const wrap=s=>{if(/\b(class|interface|enum|record)\s+\w+/.test(s))return s;const L=s.split('\n');return L.filter(l=>/^import /.test(l)).map(l=>l.trim()+' ').join('')+'public class Main { public static void main(String[] args) { '+L.filter(l=>!/^import /.test(l)).join('\n')+'\n} }';};
function real(src,inp){const t=fs.mkdtempSync('/tmp/val');const cls=(/public\s+class\s+(\w+)/.exec(src)||/class\s+(\w+)/.exec(src))[1];fs.writeFileSync(t+'/'+cls+'.java',src);
 const c=cp.spawnSync('javac',['-encoding','UTF-8','-d',t,t+'/'+cls+'.java'],{encoding:'utf8',env});if(c.status!==0)return {compile:true,text:''};
 const r=cp.spawnSync('java',['-Duser.language=es','-Duser.country=ES','-Dfile.encoding=UTF-8','-Dstdout.encoding=UTF-8','-cp',t,cls],{input:inp||'',encoding:'utf8',env});return {text:r.stdout};}
const norm=s=>(s||'').replace(/\s+$/,'');
function salida(src,inp){const r=run(src,inp||'',{});return r;}
function chkSalida(u,w,code,esperado,inp){checks++;const r=salida(code,inp);
 if(r.error&&r.error.kind!=='x'&&!/Exception|Error/.test(esperado||'')){bad(u,w,'el simulador falla: '+r.error.msg);return;}
 if(norm(r.text)!==norm(esperado))bad(u,w,'salida simulador distinta.\n  esperado: '+JSON.stringify(esperado)+'\n  obtenido: '+JSON.stringify(r.text));
 if(useJava){const j=real(wrap(code),inp);if(!j.compile&&norm(j.text)!==norm(esperado))bad(u,w,'Java real distinto: '+JSON.stringify(j.text));}}
function chkTests(u,w,b){const sol=b.solucion;if(!sol){bad(u,w,'sin solución');return;}
 (b.tests||[]).forEach((t,i)=>{checks++;const r=salida(sol,t.in||'');const got=r.text||'';
  const ok=t.out!==undefined?norm(got)===norm(t.out):t.contiene!==undefined?got.includes(t.contiene):true;
  if(!ok)bad(u,w+' test'+i,'la solución no pasa su test. got='+JSON.stringify(got)+(r.error?' err='+r.error.msg:''));
  if(useJava&&t.out!==undefined){const j=real(wrap(sol),t.in);if(!j.compile&&norm(j.text)!==norm(t.out))bad(u,w+' test'+i,'Java real distinto: '+JSON.stringify(j.text));}});
 if(b.inicial&&b.tests){const r=salida(b.inicial,(b.tests[0]||{}).in||'');if(!/refactor|depuraci/i.test(b.titulo||'')&&b.tests[0]&&b.tests[0].out!==undefined&&norm(r.text)===norm(b.tests[0].out))bad(u,w,'el código inicial ya pasa el test (el reto no reta)');}}
function tq(u,w,q){if(!q||!q.o||q.o.length<2||q.c<0||q.c>=q.o.length)bad(u,w,'pregunta mal formada: '+(q&&q.p));
 else if(new Set(q.o.map(x=>x.trim())).size!==q.o.length)bad(u,w,'opciones repetidas: '+q.p.slice(0,50));}
function bloques(u,w,bl){bl.forEach((b,i)=>{const id=w+'#'+i+'('+b.t+')';
 if(b.t==='predecir')chkSalida(u,id,b.code,b.salida,b.stdin);
 else if(b.t==='codigo'&&b.salida!==undefined)chkSalida(u,id,b.code,b.salida,b.stdin);
 else if(b.t==='ejecuta'||b.t==='reto')chkTests(u,id,b);
 else if(b.t==='test')tq(u,id,b);
 else if(b.t==='profundizar')bloques(u,id,b.bloques||[]);
 else if(b.t==='huecos'){if(!/\{\{[^}]+\}\}/.test(b.codigo))bad(u,id,'sin huecos');}
 else if(b.t==='ordenar'&&(b.items||[]).length<2)bad(u,id,'pocos items');
 else if(b.t==='relacionar'&&(b.pares||[]).length<2)bad(u,id,'pocos pares');
 else if(b.t==='traza'){const n=b.cols.length;b.filas.forEach((f,j)=>{if(f.length!==n)bad(u,id,'fila '+j+' con '+f.length+' celdas, esperadas '+n)});}
 else if(b.t==='codigo'&&b.ejecutable){checks++;const r=salida(b.code,b.stdin);if(r.error&&r.error.kind==='unsupported')bad(u,id,'el simulador no soporta este código: '+r.error.msg);}
 else if(['ordenar','relacionar'].includes(b.t)){}
 else if(!['texto','codigo','aviso','tabla','memoria','abierta','practica'].includes(b.t))bad(u,id,'tipo de bloque desconocido');});}
for(const f of fs.readdirSync(dir).filter(f=>/^ut\d\.js$/.test(f)&&(!only||f.startsWith(only))).sort()){
 let U;global.registrarUnidad=x=>{U=x};eval(fs.readFileSync(path.join(dir,f),'utf8').replace(/^/,''));if(!U){bad(f,'-','no registra unidad');continue;}
 const secIds=new Set(U.secciones.map(s=>s.id));
 U.secciones.forEach(s=>{bloques(U.id,s.id,s.bloques);const t=s.tutor;if(!t){bad(U.id,s.id,'sin tutor');return;}
  (t.inicial||[]).forEach((q,i)=>tq(U.id,s.id+' tutor.inicial'+i,q));
  (t.pasos||[]).forEach((p,i)=>{if(p.pregunta)tq(U.id,s.id+' paso'+i,p.pregunta);(p.cubre||[]).forEach(c=>{if(c>=(t.inicial||[]).length)bad(U.id,s.id+' paso'+i,'cubre índice inexistente '+c)});
   if(p.ejemplo&&p.ejemplo.code){checks++;const r=salida(p.ejemplo.code,'');if(r.error&&r.error.kind==='unsupported')bad(U.id,s.id+' paso'+i,'ejemplo no soportado: '+r.error.msg)}});
  const cub=new Set((t.pasos||[]).flatMap(p=>p.cubre||[]));(t.inicial||[]).forEach((q,i)=>{if(!cub.has(i))bad(U.id,s.id,'la pregunta inicial '+i+' no está cubierta por ningún paso')});
  if(t.reto)chkTests(U.id,s.id+' tutor.reto',t.reto);if(t.retoPro)chkTests(U.id,s.id+' tutor.retoPro',t.retoPro);});
 U.banco.forEach((q,i)=>{tq(U.id,'banco'+i,q);if(!secIds.has(q.sec))bad(U.id,'banco'+i,'sec desconocida '+q.sec);
  if(q.salida!==undefined){const m=/```\n?([\s\S]*?)```/.exec(q.p);const code=m?m[1]:(/`(System\.out[^`]*)`/.exec(q.p)||[])[1];
   if(code){checks++;const IMP='import java.time.LocalDate;\nimport java.awt.Point;\nimport java.util.*;\n';const r=salida(IMP+code,'');const o=q.o[q.c].replace(/`/g,'');if(norm(r.text)!==norm(q.salida)||(r.text&&norm(r.text)!==norm(o)&&!/^`/.test(q.o[q.c])&&false))bad(U.id,'banco'+i,'salida del simulador '+JSON.stringify(r.text)+' ≠ '+JSON.stringify(q.salida));
    if(useJava){const j=real(wrap(IMP+code));if(!j.compile&&norm(j.text)!==norm(q.salida))bad(U.id,'banco'+i,'Java real: '+JSON.stringify(j.text));}}}});
 const n=U.banco.length;if(n<U.testN*1.5)bad(U.id,'banco','solo '+n+' preguntas para muestras de '+U.testN);
 const cnt=U.secciones.map(s=>U.banco.filter(q=>q.sec===s.id).length);console.log(U.id+': '+U.secciones.length+' secciones, '+n+' preguntas ('+cnt.join('/')+')');}
console.log(errs?('\n'+errs+' problemas'):'\nTodo correcto','· '+checks+' comprobaciones');process.exit(errs?1:0);

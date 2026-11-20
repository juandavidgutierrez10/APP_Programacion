import asyncio, json, re
from playwright.async_api import async_playwright
URL='file:///home/claude/app/index.html'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width':1280,'height':900})
        errs=[]
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
        # ---------- 1) TODOS los ejercicios con su solución pasan en el navegador
        # leemos las unidades del propio contenido (registrarUnidad guarda en window.UNIDADES)
        await pg.goto(URL); await pg.wait_for_timeout(300)
        info = await pg.evaluate("""() => { const U = window.UNIDADES || {}; const out=[]; for (const id in U) { for (const s of U[id].secciones) { const walk=(bl)=>bl.forEach((b,i)=>{ if (b.t==='ejecuta'||b.t==='reto') out.push({u:id,s:s.id,t:b.t,sol:b.solucion,tests:b.tests.length}); if(b.t==='profundizar') walk(b.bloques||[]); }); walk(s.bloques); } } return out; }""")
        print('ejercicios en contenido:', len(info))
        fails=0; total=0
        for u in ['ut1','ut2','ut3']:
            secs = sorted({i['s'] for i in info if i['u']==u}, key=lambda x:x)
            for s in secs:
                await pg.goto(URL+f'#/u/{u}/s/{s}'); await pg.wait_for_timeout(250)
                sols=[i for i in info if i['u']==u and i['s']==s]
                # bloques de pro solo se ven en modo pro: activar pro si hay retos
                if any(i['t']=='reto' for i in sols):
                    sw = pg.get_by_role('switch')
                    if (await sw.get_attribute('aria-checked'))!='true': await sw.click(); await pg.wait_for_timeout(250)
                cards = pg.locator('.tj-ejecuta, .tj-reto')
                n = await cards.count()
                if n!=len(sols): print('  ! nº de tarjetas', n, 'vs contenido', len(sols), s)
                for k in range(min(n,len(sols))):
                    card=cards.nth(k)
                    # orden en DOM = orden de contenido (ejecuta y reto mezclados)
                    ta=card.locator('textarea').first
                    sol=sols[k]['sol']
                    await ta.fill(sol)
                    await card.get_by_role('button', name=re.compile('Comprobar con las pruebas')).click(); await pg.wait_for_timeout(120)
                    txt=(await card.locator('.tests-res').inner_text()).lower()
                    total+=1
                    ok = ('✓' in txt) and ('✗' not in txt) and ('✘' not in txt) and ('fall' not in txt.replace('falla','')) and txt.count('✓')>=sols[k]['tests']
                    if not ok:
                        fails+=1; print('  FALLA', u, s, k, txt[:200].replace('\n',' | '))
                if any(i['t']=='reto' for i in sols):
                    await pg.get_by_role('switch').click()
        print('ejercicios comprobados:', total, 'fallos:', fails)
        print('ERRS', errs[:5])
        await b.close()
asyncio.run(main())

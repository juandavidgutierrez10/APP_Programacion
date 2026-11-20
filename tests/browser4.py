import asyncio, json, re
from playwright.async_api import async_playwright
URL='file:///home/claude/app/index.html'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width':1100,'height':900})
        errs=[]
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
        # ---- tutor: contestar siempre la opción 0 (suele fallar) hasta el final
        await pg.goto(URL+'#/u/ut3/s/ut3-switch/tutor'); await pg.wait_for_timeout(400)
        steps=0
        for it in range(60):
            await pg.wait_for_timeout(120)
            # 1) pregunta abierta: elegir opción y comprobar
            sel = pg.locator('.chat .burbuja:last-of-type label.opcion, .chat label.opcion:not(.bloqueada)')
            comp = pg.locator(".chat button:visible:has-text(\"Comprobar\"):not([disabled])")
            if await comp.count():
                # elegir la 1ª opción de la última pregunta sin contestar
                ins = pg.locator('.chat .opciones input:not([disabled])')
                if await ins.count(): await ins.first.check(force=True)
                await comp.last.click(); steps+=1; continue
            cont = pg.locator('.chat button:visible:not([disabled])').filter(has_text=re.compile('Empezar|Continuar|Siguiente|Entendido|Seguir|Ir al reto|Vamos|Ver resultado|Terminar'))
            if await cont.count():
                await cont.last.click(); steps+=1; continue
            break
        print('acciones tutor:', steps)
        await pg.screenshot(path='/tmp/s_tutor_fin.png', full_page=True)
        txt = await pg.inner_text('.chat')
        print('TUTOR TAIL:', txt[-700:].replace('\n',' | '))
        # ---- autoeval
        await pg.goto(URL+'#/u/ut3/test'); await pg.wait_for_timeout(300)
        await pg.get_by_role('button', name=re.compile('Empezar|otra muestra')).click(); await pg.wait_for_timeout(300)
        n = await pg.locator('fieldset.preg').count(); print('preguntas en muestra:', n)
        # contestar 6 con la correcta no se sabe desde la UI; contestamos 8 con la opción 0 y 12 en blanco
        for i in range(8):
            await pg.locator('fieldset.preg').nth(i).locator('label.opcion').first.click()
        await pg.get_by_role('button', name='Corregir').click(); await pg.wait_for_timeout(200)
        await pg.get_by_role('button', name=re.compile('Sí, corregir ya')).click(); await pg.wait_for_timeout(300)
        print('RESULT:', (await pg.locator('.resultado').inner_text()).replace('\n',' | '))
        print('REPASAR:', (await pg.locator('.repasar').inner_text())[:300].replace('\n',' | '))
        await pg.screenshot(path='/tmp/s_resultado.png', full_page=False)
        # ---- memoria: flechas SVG
        await pg.goto(URL+'#/u/ut2/s/ut2-referencias'); await pg.wait_for_timeout(500)
        print('paths memoria:', await pg.locator('.mem-svg path').count())
        m = pg.locator('figure.memoria').first
        await m.scroll_into_view_if_needed(); await m.screenshot(path='/tmp/s_mem.png')
        # ---- profundizar cerrado por defecto
        opened = await pg.locator('details.profundizar[open]').count(); tot = await pg.locator('details.profundizar').count()
        print('profundizar abiertos/total:', opened, '/', tot)
        # ---- pro: bloques pro visibles solo en pro
        await pg.goto(URL+'#/u/ut1/s/ut1-tipos'); await pg.wait_for_timeout(300)
        a1 = await pg.locator('.tj-reto, .aviso-pro').count()
        await pg.get_by_role('switch').click(); await pg.wait_for_timeout(300)
        a2 = await pg.locator('.tj-reto, .aviso-pro').count()
        print('bloques pro (aprobar → pro):', a1, '→', a2)
        # ---- bloqueada
        await pg.goto(URL+'#/u/ut4'); await pg.wait_for_timeout(300)
        print('UT4:', (await pg.inner_text('main'))[:150].replace('\n',' | '))
        # ---- móvil
        await pg.set_viewport_size({'width':390,'height':800})
        await pg.goto(URL+'#/u/ut3/s/ut3-bucles'); await pg.wait_for_timeout(400)
        await pg.screenshot(path='/tmp/s_movil.png')
        ov = await pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
        print('desbordamiento horizontal en móvil:', ov)
        print('ERRS', errs[:5])
        await b.close()
asyncio.run(main())

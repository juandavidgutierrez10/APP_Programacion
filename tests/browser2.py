import asyncio, json
from playwright.async_api import async_playwright
URL='file:///home/claude/app/index.html'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width':1280,'height':900})
        errs=[]
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
        await pg.goto(URL+'#/u/ut1/s/ut1-estructura'); await pg.wait_for_timeout(500)
        btns = await pg.locator('button').all_inner_texts()
        print('BUTTONS', sorted(set(btns))[:40])
        # ejecutar primer editor
        run = pg.get_by_role('button', name='Ejecutar').first
        await run.click(); await pg.wait_for_timeout(300)
        print('OUT1', (await pg.locator('.editor-salida, .salida, .out').first.inner_text())[:200])
        # responder un test
        await pg.screenshot(path='/tmp/s_sec.png', full_page=False)
        # modo pro
        await pg.get_by_role('switch').click(); await pg.wait_for_timeout(300)
        print('data-modo', await pg.evaluate("document.documentElement.getAttribute('data-modo')||document.body.getAttribute('data-modo')"))
        await pg.screenshot(path='/tmp/s_pro.png', full_page=False)
        await pg.get_by_role('switch').click()
        # ut3 bucles: scroll y screenshot de ejercicio
        await pg.goto(URL+'#/u/ut3/s/ut3-bucles'); await pg.wait_for_timeout(500)
        await pg.screenshot(path='/tmp/s_bucles.png', full_page=True)
        # tutor
        await pg.goto(URL+'#/u/ut3/s/ut3-bucles/tutor'); await pg.wait_for_timeout(500)
        await pg.screenshot(path='/tmp/s_tutor.png', full_page=True)
        print('TUTOR TEXT', (await pg.inner_text('main'))[:600])
        # autoeval
        await pg.goto(URL+'#/u/ut3/test'); await pg.wait_for_timeout(500)
        await pg.screenshot(path='/tmp/s_test.png', full_page=True)
        print('TEST TEXT', (await pg.inner_text('main'))[:400])
        print('ERRS', errs)
        await b.close()
asyncio.run(main())

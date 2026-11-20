import asyncio, sys, json
from playwright.async_api import async_playwright
URL='file:///home/claude/app/index.html'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width':1280,'height':900})
        errs=[]
        pg.on('console', lambda m: errs.append(('console.'+m.type, m.text)) if m.type in ('error','warning') else None)
        pg.on('pageerror', lambda e: errs.append(('pageerror', str(e))))
        await pg.goto(URL); await pg.wait_for_timeout(500)
        print('home title:', await pg.title())
        print('cards:', await pg.locator('.unidad-card, .card-unidad, [data-unidad]').count())
        await pg.screenshot(path='/tmp/s_home.png', full_page=True)
        for h in ['#/u/ut1','#/u/ut1/s/ut1-variables','#/u/ut2/s/ut2-referencias','#/u/ut3/s/ut3-bucles','#/u/ut3/s/ut3-bucles/tutor','#/u/ut3/test','#/u/ut4']:
            await pg.goto(URL+h); await pg.wait_for_timeout(400)
            body = await pg.inner_text('body')
            print(h, 'len', len(body))
        print('ERRS', json.dumps(errs, ensure_ascii=False)[:2000])
        await b.close()
asyncio.run(main())

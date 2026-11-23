# 실전 연습장 미션 판정 점검 (로컬 서버 8765번 필요)
import asyncio
from playwright.async_api import async_playwright
async def setr(page,sc,name,v):
    await page.evaluate("([sc,n,v])=>{const e=document.querySelector('#'+sc+' [name='+n+']');if(e.type==='checkbox'){e.checked=v;}else e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}",[sc,name,v])
async def done(page,sc): return await page.evaluate("sc=>[...document.querySelectorAll('#'+sc+' .missions li')].map(l=>l.classList.contains('done'))",sc)
async def board(page,sc): return await page.evaluate("sc=>[...document.querySelectorAll('#'+sc+' .board div')].map(d=>d.textContent).join(' | ')",sc)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        page=await b.new_page();await page.route('**/fonts.g*/**',lambda r: r.abort())
        await page.goto("http://localhost:8765/practice/index.html#salon");await page.wait_for_timeout(800)
        print('salon before',await done(page,'salon'))
        await setr(page,'salon','order','lively');print(await board(page,'salon'))
        await setr(page,'salon','order','mystic');await setr(page,'salon','bang',10);await setr(page,'salon','end','flat');print(await board(page,'salon'))
        await setr(page,'salon','order','neat');await setr(page,'salon','bang',4);await setr(page,'salon','tie','pony');print(await board(page,'salon'))
        print('salon after',await done(page,'salon'))
        await page.click('.tabs button[data-t=wind]')
        print('wind before',await done(page,'wind'))
        await setr(page,'wind','wind',3);await setr(page,'wind','len',60);print(await board(page,'wind'))
        await setr(page,'wind','len',40);await setr(page,'wind','stiff',10);print(await board(page,'wind'))
        await setr(page,'wind','stiff',3);await setr(page,'wind','wind',2);await setr(page,'wind','wet',True);print(await board(page,'wind'))
        print('wind after',await done(page,'wind'))
        await page.click('.tabs button[data-t=workshop]')
        await setr(page,'workshop','job','wind')
        for n,v in [('len','waist'),('bang','side'),('part','center'),('vol','in'),('lock','locks'),('color','black'),('shine','band'),('move','wind'),('keep',True),('neg',True)]: await setr(page,'workshop',n,v)
        print('workshop after',await done(page,'workshop'),await board(page,'workshop'))
        await page.click('.tabs button[data-t=desk]')
        SYM=['앞머리를 지나 이마','수영모','철사','풀린 생머리','세로 줄','앞머리는 왼쪽','뽀송','눈 색과 얼굴형']
        CA=['가르마 위치(이마 선)','부피 없음','다발 없음(한 올씩)','묶은 점 무시','윤기 방향','바람 방향 둘','젖은 머리 무게','가림 영역 과다']
        for _ in range(60):
            sym=await page.text_content('#desk .sym');k=[i for i,s in enumerate(SYM) if s in sym][0]
            await page.click(f"#desk .deskopts button:text-is('{CA[k]}')");await page.wait_for_timeout(560)
        print('desk after',await done(page,'desk'))
        await b.close()
asyncio.run(main())

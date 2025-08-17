import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await page.goto("http://localhost:5173/")

        # Click the emoji game button
        await page.get_by_text("Play 😀 Matching Game").click()

        # Wait for 0.5 seconds to see the cards flipped
        await asyncio.sleep(0.5)
        await page.screenshot(path="jules-scratch/verification/01_cards_flipped.png")

        # Wait for another 1 second to see the cards flipped back
        await asyncio.sleep(1)
        await page.screenshot(path="jules-scratch/verification/02_cards_flipped_back.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

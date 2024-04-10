import puppeteer from "puppeteer";

export async function GET(request) {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto("https://bit-screen.vercel.app/");
		const screenshot = await page.screenshot({
			clip: {
				x: 0,
				y: 0,
				width: 540,
				height: 960,
			},
		});
		await browser.close();
		return new Response(screenshot, {
			headers: {
				"Content-Type": "image/png",
			},
		});
	} catch (error) {
		console.error("Error taking screenshot:", error);
		return new Response("Error taking screenshot.", { status: 500 });
	}
}

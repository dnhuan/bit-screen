import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
chromium.setHeadlessMode = true;

export async function GET(request) {
	try {
		// console.log(request.headers.get("host"));
		let browser;
		let scheme;
		if (process.env.VERCEL_ENV === "development") {
			browser = await puppeteer.launch();
			scheme = "http://";
		} else {
			browser = await puppeteer.launch({
				args: chromium.args,
				defaultViewport: chromium.defaultViewport,
				executablePath: await chromium.executablePath(),
				headless: chromium.headless,
			});
			scheme = "https://";
		}
		const page = await browser.newPage();
		await page.goto(`${scheme}${request.headers.get("host")}`, {
			waitUntil: "networkidle0",
		});
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

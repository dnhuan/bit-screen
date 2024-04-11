import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
chromium.setHeadlessMode = true;

export async function GET(request) {
	try {
		let browser;
		console.log(process.env.ENVIRONMENT);
		if (process.env.ENVIRONMENT === "DEV") {
			browser = await puppeteer.launch();
		} else {
			browser = await puppeteer.launch({
				args: chromium.args,
				defaultViewport: chromium.defaultViewport,
				executablePath: await chromium.executablePath(),
				headless: chromium.headless,
			});
		}
		const page = await browser.newPage();
		await page.goto("https://bit-screen.vercel.app/", {
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

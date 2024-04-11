import puppeteer from "puppeteer";
import sharp from "sharp";
import Jimp from "jimp";
import chromium from "@sparticuz/chromium";
chromium.setHeadlessMode = true;

export async function GET(request) {
	try {
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

		const bitmap = await sharp(screenshot)
			.resize(540, 960)
			.greyscale()
			.extractChannel(1)
			.raw({ depth: "uchar" })
			.toBuffer();
		console.log(bitmap);
		return new Response(bitmap, {
			headers: {
				"Content-Type": "application/octet-stream",
			},
		});
	} catch (error) {
		console.error("Error taking screenshot:", error);
		return new Response("Error taking screenshot.", { status: 500 });
	}
}

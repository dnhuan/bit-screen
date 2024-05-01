import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import sharp from "sharp";

const SITE_WIDTH = 478;
const SITE_HEIGHT = 2000;

export async function GET(request) {
	let browser;
	let page;
	try {
		browser = await puppeteer.connect({
			browserURL: "http://localhost:9222",
		});

		page = await browser.newPage();
		await page.setViewport({
			width: SITE_WIDTH,
			height: SITE_HEIGHT,
		});
		await page.emulateTimezone("America/Los_Angeles");
		page.goto(`https://openweathermap.org/city/5392171`);
		await page.waitForSelector(".owm-weather-icon");

		// Finish loading the page, now get current weather
		const currentWeather = await page.$(".current-container");
		const screenshotTop = await currentWeather.screenshot();

		// // Clean up for forecast
		// await page.$$eval(".chevron-container", (els) =>
		// 	els.forEach((el) => el.remove())
		// );

		// // Get forecast
		// const forecast = await page.$(
		// 	"#weather-widget > div.section-content > div.grid-container.grid-5-4"
		// );
		// const screenshotBottom = await forecast.screenshot();
		await page.close();
		await browser.disconnect();
		page = null;
		browser = null;

		// const screenshotSharp = await joinImages([screenshotTop], {
		// 	direction: "vertical",
		// 	offset: 20,
		// 	color: "#fff",
		// });

		const screenshot = await sharp(screenshotTop)
			.rotate(90)
			.png()
			.toBuffer();

		return new Response(screenshot, {
			headers: {
				"Content-Type": "image/png",
				"Cache-Control": "stale-while-revalidate=60",
			},
		});
	} catch (error) {
		if (page) await page.close();
		if (browser) await browser.disconnect();

		console.error("Error taking screenshot:", error);
		return new Response("Error taking screenshot.", { status: 500 });
	}
}

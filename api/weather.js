import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { joinImages } from "join-images";

const SITE_WIDTH = 480;
const SITE_HEIGHT = 2000;

export async function GET(request) {
	try {
		let browser;
		if (process.env.VERCEL_ENV === "development") {
			browser = await puppeteer.launch({
				headless: false,
				devtools: false,
			});
		} else {
			browser = await puppeteer.launch({
				executablePath: await chromium.executablePath(),
				headless: true,
			});
		}
		const page = await browser.newPage();
		await page.setViewport({
			width: SITE_WIDTH,
			height: SITE_HEIGHT,
		});
		await page.emulateTimezone("America/Los_Angeles");
		await page.goto(`https://openweathermap.org/city/5392171`, {
			waitUntil: "networkidle2",
		});
		await page.waitForSelector(".owm-weather-icon");

		// Finish loading the page, now get current weather
		const currentWeather = await page.$(".current-container");
		const screenshotTop = await currentWeather.screenshot();

		// Clean up for forecast
		await page.$$eval(".chevron-container", (els) =>
			els.forEach((el) => el.remove())
		);

		// Get forecast
		const forecast = await page.$(
			"#weather-widget > div.section-content > div.grid-container.grid-5-4"
		);
		const screenshotBottom = await forecast.screenshot();

		await browser.close();

		const screenshotSharp = await joinImages(
			[screenshotTop, screenshotBottom],
			{
				direction: "vertical",
				offset: 10,
				color: "#fff",
			}
		);
		const screenshot = await screenshotSharp.png().toBuffer();
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

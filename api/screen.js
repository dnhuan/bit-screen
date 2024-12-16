import puppeteer from "puppeteer-core";
import sharp from "sharp";

const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 540;

function compactBuffer(binaryData) {
	const pixels = new Uint8Array(binaryData);

	// Calculate byte size for output array
	const outputSize = Math.ceil(SCREEN_WIDTH / 2) * SCREEN_HEIGHT;

	// Prepare output buffer
	const outputBuffer = Buffer.alloc(outputSize);

	for (let y = 0; y < SCREEN_HEIGHT; y++) {
		let byte = 0;
		for (let x = 0; x < SCREEN_WIDTH; x++) {
			const pixelIndex = y * SCREEN_WIDTH + x;
			const pixelValue = pixels[pixelIndex];
			if (x % 2 === 0) {
				byte = pixelValue >> 4;
			} else {
				byte |= pixelValue & 0xf0;
				outputBuffer.writeUInt8(
					byte,
					y * Math.ceil(SCREEN_WIDTH / 2) + Math.floor(x / 2)
				);
			}
		}
	}

	return outputBuffer;
}

export const maxDuration = 300;

export async function GET(request) {
	let browser, page;
	try {
		let scheme;
		browser = await puppeteer.connect({
			browserURL: "http://localhost:9222",
		});
		scheme = "http://";
		const pages = await browser.pages(); // Get all open pages (tabs)
		await Promise.all(pages.map(async (page) => await page.close()));
		page = await browser.newPage();
		await page.emulateTimezone("America/Los_Angeles");
		await page.goto(`${scheme}${request.headers.get("host")}`, {
			waitUntil: "networkidle0",
			timeout: 0,
		});
		const screenshot = await page.screenshot({
			clip: {
				x: 0,
				y: 0,
				width: SCREEN_HEIGHT,
				height: SCREEN_WIDTH,
			},
		});
		await page.close();
		await browser.disconnect();

		const { searchParams } = new URL(request.url);
		const hasDebug = searchParams.has("debug");
		const debug = hasDebug ? parseInt(searchParams.get("debug")) : 0;

		const bitmap = sharp(screenshot)
			.rotate(270)
			.resize(SCREEN_WIDTH, SCREEN_HEIGHT)
			.greyscale()
			.extractChannel(1)
			.raw({ depth: "uchar" });

		if (debug === 1) {
			const exportImage = await bitmap.png().toBuffer();
			return new Response(exportImage, {
				headers: {
					"Content-Type": "image/png",
				},
			});
		}

		const exportBitmap = await bitmap.toBuffer();

		if (debug === 2) {
			return new Response(exportBitmap, {
				headers: {
					"Content-Type": "application/octet-stream",
				},
			});
		}
		const exportBufferArray = compactBuffer(exportBitmap);
		return new Response(exportBufferArray, {
			headers: {
				"Content-Type": "application/octet-stream",
			},
		});
	} catch (error) {
		console.error("Error taking screenshot:", error);
		return new Response("Error taking screenshot.", { status: 500 });
	}
}

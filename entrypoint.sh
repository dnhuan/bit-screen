#!/bin/bash
export VIPS_CONCURRENCY=16
export VIPS_CACHE=TRUE
yarn vercel dev -l 3001 --yes &
# Start Chrome in the background
chromium-browser --remote-debugging-port=9222 \
                 --remote-debugging-address=0.0.0.0 \
                 --headless \
                 --no-first-run \
                 --no-default-browser-check \
                 --disable-translate \
                 --disable-extensions \
                 --disable-background-networking \
                 --disable-sync \
                 --disable-default-apps \
                 --enable-features=ConversionMeasurement,AttributionReportingCrossAppWeb \
                 --metrics-recording-only \
                 --safebrowsing-disable-auto-update \
                 --autoplay-policy=user-gesture-required \
                 --disable-background-timer-throttling \
                 --disable-backgrounding-occluded-windows \
                 --disable-breakpad \
                 --disable-client-side-phishing-detection \
                 --disable-component-update \
                 --disable-dev-shm-usage \
                 --disable-domain-reliability \
                 --disable-features=AudioServiceOutOfProcess \
                 --disable-hang-monitor \
                 --disable-ipc-flooding-protection \
                 --disable-notifications \
                 --disable-offer-store-unmasked-wallet-cards \
                 --disable-popup-blocking \
                 --disable-print-preview \
                 --disable-prompt-on-repost \
                 --disable-renderer-backgrounding \
                 --disable-setuid-sandbox \
                 --disable-speech-api \
                 --hide-scrollbars \
                 --disable-gpu \
                 --ignore-gpu-blacklist \
                 --mute-audio \
                 --no-pings \
                 --no-sandbox \
                 --no-zygote \
                 --password-store=basic \
                 --use-gl=swiftshader \
                 --use-mock-keychain &

CHROME_PID=$!

# Wait for Chrome to exit
wait $CHROME_PID
CHROME_EXIT_CODE=$?

# Check if Chrome exited gracefully
if [ $CHROME_EXIT_CODE -eq 0 ]; then
    echo "Chrome exited gracefully"
    # Exit with an error code to trigger a Docker restart
    exit 1
else
    echo "Chrome exited with an error code"
    # Exit with the original exit code
    exit $CHROME_EXIT_CODE
fi

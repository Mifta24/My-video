#!/bin/bash
# Render Long V3 per potongan (video saja). Potongan yang sudah ada dilewati; potongan macet dibunuh (timeout) lalu diulang.
set -u
cd "$(dirname "$0")/.."
export LD_LIBRARY_PATH=$HOME/.hermes/tools/chromium-libs/root/usr/lib64
EXE=$HOME/.hermes/tools/chromium-1208/chrome-linux64/chrome
OUT=out/suhuf-bakteri/parts
mkdir -p $OUT
TOTAL=${TOTAL:?}
STEP=${STEP:-400}
a=${START:-0}
while [ $a -lt $TOTAL ]; do
  b=$((a+STEP-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1))
  f=$OUT/v_$(printf %05d $a).mp4
  tries=0
  while [ ! -s $f ] && [ $tries -lt 3 ]; do
    tries=$((tries+1))
    echo "[$(date +%T)] render $a-$b (try $tries)"
    timeout ${CHUNK_TIMEOUT:-900} npx remotion render src/index.ts Bakteri-YouTube-Long $f --frames=$a-$b --muted --codec=h264 --crf=18 --gl=swangle --concurrency=${CONC:-3} --browser-executable=$EXE --timeout=120000 > $OUT/log_$a.txt 2>&1 || { echo "GAGAL/timeout $a"; rm -f $f; pkill -9 -f chrome-linux64; sleep 3; }
  done
  [ -s $f ] || { echo "MENYERAH di $a"; exit 1; }
  a=$((b+1))
done
echo "[$(date +%T)] selesai potongan"

const geodisp = document.getElementById("geodisp");
const geodispLat = document.getElementById("geodispLat");
const geodispLng = document.getElementById("geodispLng");
const refreshLocBtn = document.getElementById("refresh-loc-btn");
const copyLatBtn = document.getElementById("copy-lat-btn");
const copyLngBtn = document.getElementById("copy-lng-btn");

let currentLat = "";
let currentLng = "";
let map = null;

const options = {
  // enableHighAccuracy: true,
  timeout: 10000,
  // maximumAge: 0,
};

function setRefreshingState(isRefreshing) {
  refreshLocBtn.disabled = isRefreshing;
  refreshLocBtn.innerText = isRefreshing ? "取得中..." : "現在地を再取得";
}

function requestCurrentLocation() {
  if (!navigator.geolocation) {
    geodisp.textContent = "このブラウザは位置情報に対応していません。";
    return;
  }

  setRefreshingState(true);
  geodisp.textContent = "現在地を取得しています...";
  navigator.geolocation.getCurrentPosition(success, error, options);
}

async function copyToClipboard(text, buttonElement) {
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    const originalText = buttonElement.innerText;
    buttonElement.innerText = "コピー完了!";
    buttonElement.disabled = true;

    setTimeout(() => {
      buttonElement.innerText = originalText;
      buttonElement.disabled = false;
    }, 1500);
  } catch (err) {
    alert("コピーに失敗しました: " + err);
  }
}

refreshLocBtn.addEventListener("click", requestCurrentLocation);
copyLatBtn.addEventListener("click", () => copyToClipboard(currentLat, copyLatBtn));
copyLngBtn.addEventListener("click", () => copyToClipboard(currentLng, copyLngBtn));

function initOrUpdateMap(lat, lng) {
  const center = ol.proj.fromLonLat([lng, lat]);

  if (!map) {
    map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
      ],
      view: new ol.View({
        center,
        zoom: 15.0,
      }),
      target: "map",
    });
  } else {
    map.getView().setCenter(center);
  }
}

function success(pos) {
  setRefreshingState(false);

  const crd = pos.coords;
  currentLat = String(crd.latitude);
  currentLng = String(crd.longitude);

  console.log("現在の位置:");
  console.log(`誤差 ${crd.accuracy} メートル`);

  geodisp.textContent = `緯度 ${crd.latitude} 経度 ${crd.longitude} 誤差 ${crd.accuracy} メートル`;
  geodispLat.textContent = currentLat;
  geodispLng.textContent = currentLng;

  initOrUpdateMap(crd.latitude, crd.longitude);
}

function error(err) {
  setRefreshingState(false);

  geodisp.textContent = `ERROR(${err.code}): ${err.message}`;
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// 初回読み込み時に現在地を取得
requestCurrentLocation();

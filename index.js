const geodisp = document.getElementById("geodisp");
const geodispLat = document.getElementById("geodispLat");
const geodispLng = document.getElementById("geodispLng");
const copyLatBtn = document.getElementById("copy-lat-btn");
const copyLngBtn = document.getElementById("copy-lng-btn");

let currentLat = "";
let currentLng = "";
let map = null;

const options = {
  // enableHighAccuracy: true,
  // timeout: 5000,
  // maximumAge: 0,
};

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

copyLatBtn.addEventListener("click", () => copyToClipboard(currentLat, copyLatBtn));
copyLngBtn.addEventListener("click", () => copyToClipboard(currentLng, copyLngBtn));

function initOrUpdateMap(lat, lng) {
  const center = ol.proj.fromLonLat([lng, lat]);

  if (!map) {
    map = new ol.Map({
      view: new ol.View({
        center,
        zoom: 15.0,
      }),
      target: "map",
    });

    // olms.apply には LayerGroup ではなく ol.Map インスタンスを渡す
    olms.apply(map, "https://tiles.openfreemap.org/styles/liberty").catch((err) => {
      console.error("地図スタイルの適用に失敗しました:", err);
    });
  } else {
    map.getView().setCenter(center);
  }
}

function success(pos) {
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
  geodisp.textContent = `ERROR(${err.code}): ${err.message}`;
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

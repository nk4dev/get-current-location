
const geodisp = document.getElementById("geodisp");
const geodispLot = document.getElementById("geodispLot");
const geodispLat = document.getElementById("geodispLat");

const openfreemap = new ol.layer.Group()
const options = {
  //enableHighAccuracy: true,
  //timeout: 5000,
  //  maximumAge: 0,
};

async function copyToClipboard(text, buttonElement) {
  try {
    await navigator.clipboard.writeText(text);
    const originalText = buttonElement.innerText;
    buttonElement.innerText = "コピー完了!";
    buttonElement.disabled = true;

    // 1.5秒後にボタンの表示を元に戻す
    setTimeout(() => {
      buttonElement.innerText = originalText;
      buttonElement.disabled = false;
    }, 1500);
  } catch (err) {
    alert("コピーに失敗しました: " + err);
  }
}

function success(pos) {
  const crd = pos.coords;

  console.log("現在の位置:");
  //console.log(`緯度: ${crd.latitude}`);
  //console.log(`軽度: ${crd.longitude}`);
  console.log(`誤差 ${crd.accuracy} メートル`);

  geodisp.innerHTML = `緯度 ${crd.latitude} 経度${crd.longitude} 誤差 ${crd.accuracy} メートル`;
  geodispLot.innerHTML = `${crd.latitude}`;
  geodispLat.innerHTML = `${crd.longitude}`

  const copyLatBtn = document.getElementById("copy-lat-btn");
  const copyLngBtn = document.getElementById("copy-lng-btn");

  copyLatBtn.addEventListener("click", () => copyToClipboard(String(crd.latitude), copyLatBtn));
  copyLngBtn.addEventListener("click", () => copyToClipboard(String(crd.longitude), copyLngBtn));

  const map = new ol.Map({
    layers: [openfreemap],
    view: new ol.View({ center: ol.proj.fromLonLat([crd.longitude, crd.latitude]), zoom: 13.5 }),
    target: 'map',
  })
  olms.apply(openfreemap, 'https://tiles.openfreemap.org/styles/liberty')
}

function error(err) {
  geodisp.innerHTML = `ERROR(${err.code}): ${err.message}`;
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

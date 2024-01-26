const progress = document.querySelector("circle-progress");

let temp = {
  temperatureData: undefined,
};

let elementArray = []; // Dışarıda tanımlanmış elementArray

window.onload = () => {
  updateProgress(0);
};

function addCSS(cssFilePath) {
  var i = 1;
  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.type = "text/css";
  linkElement.href = cssFilePath;

  document.head.appendChild(linkElement);
  elementArray.push(i); // Link eklenirse elementArray'e ekle
}

const updateProgress = (value) => {
  console.log(elementArray);
  var valueInt = parseInt(value);
  if (valueInt <= 100 && valueInt >= -100) {
    if (valueInt < 0) {
      // Eğer elementArray boşsa veya içinde hiç link yoksa, CSS ekleyin
      if (elementArray.length === 0) {
        addCSS("/minus.css");
      }
    } else {
      // Eğer elementArray doluysa, linkleri kaldırın
      const existingLinkElements = document.querySelectorAll(
        'link[rel="stylesheet"][href="/minus.css"]'
      );

      existingLinkElements.forEach((linkElement) => {
        linkElement.parentNode.removeChild(linkElement);
      });
      // elementArray'i temizle
      elementArray = [];
    }
    progress.value = value;
    progress.textFormat = (value) => {
      return value + "°C";
    };
  } else {
    progress.value = -100;
    progress.textFormat = () => {
      return "Error";
    };
  }
};

const handleFetchError = (error) => {
  console.log("Veri işleme hatası: " + error);
};

const fetchTemp = async () => {
  try {
    const data = await fetch(
      "https://kcmteknoloji.net/api.php?UserSecretKey=admin"
    );
    if (!data.ok) {
      throw new Error("Veri Çekilemedi");
    }
    const responseData = await data.json();
    if (responseData && responseData.length >= 0) {
      temp.temperatureData = responseData[0].targetTemperature;
      if (
        parseInt(temp.temperatureData) <= 100 &&
        parseInt(temp.temperatureData) >= -100
      ) {
        updateProgress(temp.temperatureData);
      } else {
        updateProgress(temp.temperatureData);
        throw new Error("Hatalı sıcaklık verisi");
      }
    } else {
      throw new Error("Sıcaklık yakalanamadı");
    }
  } catch (error) {
    console.log(error);
  }
};

setInterval(fetchTemp, 2000);

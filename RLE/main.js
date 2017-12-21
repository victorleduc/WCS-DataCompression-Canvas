/*
- Algorithme de compression :
    - Recherche des caractères répétés plus de n fois (n fixé par l'utilisateur)
    - Remplacement de l'itération de caractères par:
      * un caractère spécial identifiant une compression
      * le nombre de fois où le caractère est répété
      * le caractère répété
  - Algorithme de décompression :
    - Durant la lecture du fichier compressé, lorsque le caractère spécial est reconnu,
      on effectue l’opération inverse de la compression tout en supprimant ce caractère spécial.
*/

function compressionRLESimple(donneesACompresser) {
  let data = donneesACompresser.match(/(.)\1*/g);
  data = data.map(word => word.length + word[0]);
  return data.join("");
}

function decompressionRLESimple(donneesCompressees) {
  let data = donneesCompressees.match(/\d+[a-z]/ig);
  data = data.map(word => {
    let charNumber = word.match(/\d+/g)[0];
    let char = word[word.length - 1];
    return char.repeat(charNumber);
  });
  return data.join("");
}

function compressionRLEAvance(donnees, seuil, delimiteur) {
  let data = donnees.match(/(.)\1*/g);
  data = data.map(word => word.length > seuil ? delimiteur + word.length + word[0] : word);
  return data.join("");
}

function decompressionRLEAvance(donneesCompressees, delimiteur) {
  let regex = new RegExp("(" + delimiteur + "\\d+[a-z])|([a-z]\1*)", "ig");
  let data = donneesCompressees.match(regex);
  data = data.map(word => {
    if (word[0] == delimiteur) {
      let charNumber = word.match(/\d+/g)[0];
      let char = word[word.length - 1];
      return char.repeat(charNumber);
    }
    return word;
  });
  return data.join("");
  console.log(data);
}


function compression(donnees, seuil, delimiteur) {
  return compressionRLEAvance(donnees, seuil, delimiteur);
  // return compressionRLESimple(donnees);
}
function decompression(donnees, delimiteur) {
  return decompressionRLEAvance(donnees, delimiteur);
  //return decompressionRLESimple(donnees);
}

var toCompressSize = $('td#tocompress-size');
var toCompressData = $('td#tocompress-data');
var compressedSize = $('td#compressed-size');
var compressedData = $('td#compressed-data');
var compressionGain = $('td#compression-gain');
var compressionRatio = $('td#compression-ratio');
var uncompressedSize = $('td#uncompressed-size');
var uncompressedData = $('td#uncompressed-data');
var processStatus = $('td#process-status');

// Register some display listeners
toCompressData.on("DOMSubtreeModified", function () {
  toCompressSize.text(toCompressData.text().length);
  compressedData.text(compression(toCompressData.text(), 2, '@'));
});
compressedData.on("DOMSubtreeModified", function () {
  compressedSize.text(compressedData.text().length);
  compressionGain.text(toCompressSize.text() - compressedSize.text());
  compressionRatio.text(Number(compressionGain.text() / toCompressSize.text() * 100).toFixed(1) + " %");
  uncompressedData.text(decompression(compressedData.text(), '@'));
});
uncompressedData.on("DOMSubtreeModified", function () {
  uncompressedSize.text(uncompressedData.text().length);
  if (toCompressData.text() === uncompressedData.text()) {
    processStatus.text("OK");
  } else {
    processStatus.text("ERROR");
  }
});

var inputData = "WWWWWWWWWBWWWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWBWWWWWWWW";
var outputData;

toCompressData.text(inputData);

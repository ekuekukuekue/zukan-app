// 共通関数

// localStorageから図鑑データを取得
function getZukans() {
  const json = localStorage.getItem('zukans');
  return json ? JSON.parse(json) : [];
}

// localStorageに図鑑データを保存
function saveZukans(zukans) {
  localStorage.setItem('zukans', JSON.stringify(zukans));
}

// 新しい図鑑を追加
function addZukan(name) {
  const zukans = getZukans();
  const newZukan = {
    id: Date.now().toString(),
    name: name,
    photos: []
  };
  zukans.push(newZukan);
  saveZukans(zukans);
  return newZukan.id;
}

// 特定の図鑑をIDで削除
function deleteZukan(id) {
  let zukans = getZukans();
  zukans = zukans.filter(zukan => zukan.id !== id);
  saveZukans(zukans);
}

// 特定の図鑑をIDで取得
function getZukanById(id) {
  const zukans = getZukans();
  return zukans.find(zukan => zukan.id === id);
}

// 特定の図鑑から写真をIDで削除する関数
function deletePhotoFromZukan(zukanId, photoId) {
  const zukans = getZukans();
  const zukan = zukans.find(z => z.id === zukanId);
  if (zukan) {
    zukan.photos = zukan.photos.filter(photo => photo.id !== photoId);
    saveZukans(zukans);
  }
}

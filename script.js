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

// 共有された図鑑から写真を削除する関数 (新しい関数)
async function deletePhotoFromSharedZukan(zukanId, photoId, token) {
  const owner = 'ekuekukuekue';
  const repo = 'zukan-app';
  const path = `shared-zukans/${zukanId}.json`;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('図鑑の取得に失敗しました。');
    }

    const fileContent = await response.json();
    const zukan = JSON.parse(atob(fileContent.content));

    const updatedPhotos = zukan.photos.filter(photo => photo.id !== photoId);
    zukan.photos = updatedPhotos;
    
    const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(zukan))));

    const putResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Delete photo ${photoId} from zukan ${zukanId}`,
        content: updatedContent,
        sha: fileContent.sha
      })
    });

    if (!putResponse.ok) {
      throw new Error('写真の削除に失敗しました。');
    }

    alert('写真が正常に削除されました。');
    location.reload();

  } catch (error) {
    alert(`写真の削除に失敗しました: ${error.message}`);
    console.error(error);
  }
}

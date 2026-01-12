function postToBlueSky(text, userId, password, imageID=null, alt_text="投稿画像") {
  // BlueSky APIのエンドポイント
  var loginUrl = 'https://bsky.social/xrpc/com.atproto.server.createSession';
  var postUrl = 'https://bsky.social/xrpc/com.atproto.repo.createRecord';
  var uploadBlobUrl = 'https://bsky.social/xrpc/com.atproto.repo.uploadBlob';

  /**
   * 指数バックオフ付きでUrlFetchAppを実行する内部ヘルパー
   */
  function fetchWithRetry(url, options) {
    let lastError;
    // 最大5回リトライ（待機時間: 1s, 2s, 4s, 8s, 16s）
    for (let i = 0; i < 5; i++) {
      try {
        const response = UrlFetchApp.fetch(url, options);
        const code = response.getResponseCode();
        if (code >= 200 && code < 300) return response;
      } catch (e) {
        lastError = e;
        // 502 (Bad Gateway), 503 (Service Unavailable), 504 (Gateway Timeout) 
        // およびタイムアウトエラーの場合のみリトライを実行
        if (e.message.includes("502") || e.message.includes("503") || e.message.includes("504") || e.message.includes("Timeout")) {
          Logger.log((i + 1) + '回目リトライ実施: ' + e.message);
          const sleepTime = Math.pow(2, i) * 1000;
          Utilities.sleep(sleepTime);
          continue;
        }
        throw e; // 400系エラー（認証失敗等）はリトライせずに例外を投げる
      }
    }
    throw new Error("最大リトライ回数を超過しました: " + lastError.message);
  }

  // ログインリクエストの作成
  var loginPayload = {
    identifier: userId,
    password: password
  };
  var loginOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(loginPayload)
  };

  // ログインリクエストの送信
  var loginResponse = UrlFetchApp.fetch(loginUrl, loginOptions);
  var loginData = JSON.parse(loginResponse.getContentText());
  var accessJwt = loginData.accessJwt;

  var postPayload = {
    repo: loginData.did,
    collection: 'app.bsky.feed.post',
    record: {
      text: text,
      createdAt: new Date().toISOString(),
      langs: ["ja"] // 投稿言語設定
    }
  };
  var postOptions = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + accessJwt
    },
    payload: JSON.stringify(postPayload)
  };

  // 画像が指定されている場合、blobをアップロードしてレコードに添付
  if (imageID) {
    try {
      var file = DriveApp.getFileById(imageID);
      var blob = file.getBlob();

      var uploadBlobOptions = {
        method: 'post',
        contentType: blob.getContentType(),
        headers: {
          'Authorization': 'Bearer ' + accessJwt
        },
        payload: blob.getBytes()
      };

      var uploadBlobResponse = fetchWithRetry(uploadBlobUrl, uploadBlobOptions);
      var uploadBlobData = JSON.parse(uploadBlobResponse.getContentText());

      postPayload.record.embed = {
        $type: 'app.bsky.embed.images',
        images: [{
          image: uploadBlobData.blob,
          alt: alt_text // 必要に応じて代替テキストを設定
        }]
      };
      postOptions.payload = JSON.stringify(postPayload);
    } catch (e) {
      Logger.log('画像アップロードエラー: ' + e);
      // 画像アップロードに失敗しても投稿自体は続行
    }
  }

  var postResponse = fetchWithRetry(postUrl, postOptions);
  var postData = JSON.parse(postResponse.getContentText());

  Logger.log(postData);
}

function testPostToBlueSky() {
  var text = '[bot]TEST投稿';
  var userId = PropertiesService.getScriptProperties().getProperty('bsky_uid');
  var password = PropertiesService.getScriptProperties().getProperty('bsky_pass');

  postToBlueSky(text, userId, password);
}
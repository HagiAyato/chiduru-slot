/**
 * スロット本体
 */
function _process_slot(){
  const items = ["松", "尾", "千", "鶴"];
  let slotResult = [];

  // スロットを3つ回す（3つの結果を出す）
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * items.length);
    slotResult.push(items[randomIndex]);
  }

  // 結果を文字列に変換
  const slotResultString = slotResult.join(""); // 区切り文字なしで連結

  //　判定の上投稿
  _check_post_result(slotResultString)

  // 結果を表示
  console.log(slotResultString);
}

function _check_post_result(slotResultString){
  // 結果をポスト
  var userId = PropertiesService.getScriptProperties().getProperty('bsky_uid');
  var password = PropertiesService.getScriptProperties().getProperty('bsky_pass');
  var imageID = null;
  var alt_text = "";

  // 結果次第で画像追加
  switch(slotResultString){
    case "松尾千鶴":
      imageID = PropertiesService.getScriptProperties().getProperty('img_matsuo_chiduru')
      alt_text = '松尾千鶴の画像';
      break;
    case "鶴千尾松":
      imageID = PropertiesService.getScriptProperties().getProperty('img_tsuruchi_omatsu')
      alt_text = '鶴千尾松の画像';
      break;
    case "松松松松":
      imageID = PropertiesService.getScriptProperties().getProperty('img_matsumatsumatsumatsu')
      alt_text = '松原の画像';
      break;
    case "鶴鶴鶴鶴":
      imageID = PropertiesService.getScriptProperties().getProperty('img_tsurutsurutsurutsuru')
      alt_text = '鶴の画像';
      break;
    case "千千千千":
      imageID = PropertiesService.getScriptProperties().getProperty('img_icchou')
      alt_text = '千×千×千×千=1兆の画像';
      break;
  }
  postToBlueSky("[bot]スロット結果：" + slotResultString, userId, password, imageID, alt_text);
}

/**
 * これを定期実行で呼び出す
 */
function main() {
  _process_slot()
}

function test_check_post(){
  _check_post_result("鶴鶴鶴鶴")
}

# chiduru-slot

## 概要
松尾千鶴スロットbotのGoogle Apps Scriptコードです。  
松尾千鶴スロット（ランダム抽選）機能を実行し、結果をBlueSkyへ自動投稿します。

## 構成ファイル
- [`slot_main.gs`](slot_main.gs)  
  松尾千鶴スロット機能（ランダム抽選・結果表示など）を実装しています。
- [`post_bluesky.gs`](post_bluesky.gs)  
  BlueSky APIを利用して記事情報をBlueSkyに投稿します。サムネイル画像のアップロードにも対応しています。
- [`appsscript.json`](appsscript.json)  
  GASプロジェクトの設定ファイル。

## 主な機能

### スロット機能
[`_process_slot`](slot_main.gs)  
松尾千鶴に関連したスロットを実行し、ランダムな結果（画像ID・メッセージなど）を返します。

### BlueSkyへの投稿
[`postToBlueSky`](post_bluesky.gs)  
BlueSky APIにログインし、記事情報（タイトル・リンク・説明・サムネイル画像）を投稿します。

### テスト投稿
[`testPostToBlueSky`](post_bluesky.gs)  
スクリプトプロパティからテスト用のユーザーID・パスワードを取得し、BlueSkyへの投稿をテストします。

## 動作環境
Google Apps Script

## 実際に動かしているbot紹介
[Blueskyアイマスラブライブ新着動画botを作ってみた(+カスタムフィードも)](https://note.com/ayato_nananiji/n/n459ec7b29835)

## 松尾千鶴とは
- [まつお ちづる松尾 千鶴 - アイドル名鑑](https://idollist.idolmaster-official.jp/detail/20149)
- [松尾千鶴Wiki　～Wiki尾千鶴～](https://seesaawiki.jp/chizuru_matsuo/)

## 参考記事
- [GASを使ってblueskyで投稿をする方法](https://note.com/uwaaauwaaaa/n/nbcd279d4cf26)
- [GASでBlueskyのBotをつくった備忘録](https://note.com/keiga/n/n527865bcf0d5)
- [Google Apps ScriptでGoogleドライブを操作する最も簡単なスクリプト](https://tonari-it.com/gas-google-drive-app/)
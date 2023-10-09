# <div align="center"><img  src="https://user-images.githubusercontent.com/58886915/166198400-c2134044-1198-4647-a8b6-da9c4a204c68.svg" width="40"/> </br>Pingvin Share</div>

---

_READMEを別の言語で読む: [Spanish](/docs/README.es.md), [English](/README.md), [Simplified Chinese](/docs/README.zh-cn.md), [日本語](/docs/README.ja-jp.md)_

---

Pingvin Share は、セルフホスト型のファイル共有プラットフォームであり、WeTransfer、ギガファイル便などの代替プラットフォームです。

## ✨ 特徴的な機能

- リンクを用いたファイル共有
- ファイルサイズ無制限 (ストレージスペースの範囲内で)
- 共有への有効期限の設定
- 訪問回数の制限とパスワードの設定により共有を安全に保つ
- メールでリンクを共有
- ClamAVと連携して、ウイルスチェックが可能

## 🐧 Pingvin Shareについて知る

- [デモ](https://pingvin-share.dev.eliasschneider.com)
- [DB Techによるレビュー](https://www.youtube.com/watch?v=rWwNeZCOPJA)

<img src="https://user-images.githubusercontent.com/58886915/225038319-b2ef742c-3a74-4eb6-9689-4207a36842a4.png" width="700"/>

## ⌨️ セットアップ

> 注意: Pingvin Shareは、早期段階であり、バグが含まれている場合があります。

### Dockerでインストール (おすすめ)

1. `docker-compose.yml`ファイルをダウンロード
2. `docker-compose up -d`を実行

Webサイトは、`http://localhost:3000`でリッスンされます。これでPingvin Shareをお使い頂けます🐧!

### スタンドアローンインストール

必要なツール:

- [Node.js](https://nodejs.org/en/download/) >= 16
- [Git](https://git-scm.com/downloads)
- [pm2](https://pm2.keymetrics.io/) Pingvin Shareをバックグラウンドで動作させるために必要

```bash
git clone https://github.com/stonith404/pingvin-share
cd pingvin-share

# 最新バージョンをチェックアウト
git fetch --tags && git checkout $(git describe --tags `git rev-list --tags --max-count=1`)

# バックエンドを開始
cd backend
npm install
npm run build
pm2 start --name="pingvin-share-backend" npm -- run prod

#フロントエンドを開始
cd ../frontend
npm install
npm run build
pm2 start --name="pingvin-share-frontend" npm -- run start
```

Webサイトは、`http://localhost:3000`でリッスンされます。これでPingvin Shareをお使い頂けます🐧!

### 連携機能

#### ClamAV (Dockerのみ)

ClamAVは、共有されたファイルをスキャンし、感染したファイルを見つけた場合に削除するために使用されます。

1. ClamAVコンテナをDocker Composeの定義ファイル(`docker-compose.yml`を確認)に追加し、コンテナを開始してください。
2. Dockerは、Pingvin Shareを開始する前に、ClamAVの準備が整うまで待機します。これには、1分から2分ほどかかります。
3. Pingvin Shareのログに"ClamAV is active"というログが記録されます。

ClamAVは、非常に多くのリソースを必要とします、詳しくは[リソース](https://docs.clamav.net/manual/Installing/Docker.html#memory-ram-requirements)をご確認ください。

### 追加情報

- [Synology NASへのインストール方法](https://mariushosting.com/how-to-install-pingvin-share-on-your-synology-nas/)

### 新しいバージョンへのアップグレード

Pingvin Shareは早期段階のため、アップグレード前に必ずリリースノートを確認して、アップグレードしても問題ないかどうかご確認ください。

#### Docker

```bash
docker compose pull
docker compose up -d
```

#### スタンドアローン

1. アプリを停止する
   ```bash
   pm2 stop pingvin-share-backend pingvin-share-frontend
   ```
2. `git clone`のステップを除いて、[インストールガイド](#stand-alone-installation)をくり返してください。

   ```bash
   cd pingvin-share

   # 最新バージョンをチェックアウト
   git fetch --tags && git checkout $(git describe --tags `git rev-list --tags --max-count=1`)

   # バックエンドを開始
   cd backend
   npm run build
   pm2 restart pingvin-share-backend

   #フロントエンドを開始
   cd ../frontend
   npm run build
   pm2 restart pingvin-share-frontend
   ```

### 設定

管理者のダッシュボード内の「設定」ページから、Pingvin Shareをカスタマイズできます。

#### 環境変数

インストール時の特定の設定で、環境変数を使用できます。次の環境変数が使用可能です:

##### バックエンド

| Variable         | Default Value                                      | Description                            |
| ---------------- | -------------------------------------------------- | -------------------------------------- |
| `PORT`           | `8080`                                             | The port on which the backend listens. |
| `DATABASE_URL`   | `file:../data/pingvin-share.db?connection_limit=1` | The URL of the SQLite database.        |
| `DATA_DIRECTORY` | `./data`                                           | The directory where data is stored.    |
| `CLAMAV_HOST`    | `127.0.0.1`                                        | The IP address of the ClamAV server.   |
| `CLAMAV_PORT`    | `3310`                                             | The port number of the ClamAV server.  |

##### フロントエンド

| Variable  | Default Value           | Description                              |
| --------- | ----------------------- | ---------------------------------------- |
| `PORT`    | `3000`                  | The port on which the frontend listens.  |
| `API_URL` | `http://localhost:8080` | The URL of the backend for the frontend. |

## 🖤 コントリビュート

### 翻訳

Pingvin Shareをあなたが使用している言語に翻訳するお手伝いを募集しています。
[Crowdin](https://crowdin.com/project/pingvin-share)上で、簡単にPingvin Shareの翻訳作業への参加が可能です。

あなたの言語がありませんか？ 気軽に[リクエスト](https://github.com/stonith404/pingvin-share/issues/new?assignees=&labels=language-request&projects=&template=language-request.yml&title=%F0%9F%8C%90+Language+request%3A+%3Clanguage+name+in+english%3E)してください。

翻訳中に問題がありましたか？ [ローカライズに関するディスカッション](https://github.com/stonith404/pingvin-share/discussions/198)に是非参加してください。

### プロジェクト

Pingvin Shareへのコントリビュートをいつでもお待ちしています！ [コントリビューションガイド](/CONTRIBUTING.md)を確認して、是非参加してください。

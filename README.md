# discord-voice-notify-bot-js

特定のボイスチャンネルに人が入ったとき、特定のテキストチャンネルに通知テキストを送るDiscord Bot。

## Requirements

- Docker 28.1.1
- Docker Compose version v2.35.1-desktop.1

## Installation

1. このリポジトリをクローンする

## Usage

1. `.env.example`を`.env.prod`にコピーする
1. [Discord Developer Portal](https://discord.com/developers/applications)でBotアプリケーションを作成する
1. 作成したBotアプリケーションのトークンを`.env.prod`の`DISCORD_BOT_TOKEN`に設定する
1. OAuth2ページのURL Generatorで、SCOPES: bot、BOT PERMISSIONS:View Channels, Send Messages, ConnectとしてURLを生成する
1. 上記で生成したURLをブラウザで開き、Botを自分のサーバーに追加する
1. 監視したいボイスチャンネルと、通知したいテキストチャンネルのIDを取得し、`.env.prod`の`TARGET_VOICE_CHANNEL_ID`と`TARGET_TEXT_CHANNEL_ID`に設定する

初回はビルドする。

```sh
docker compose -f compose.prod.yaml build
```

ビルドが完了したら、Botを起動する。

```bash
docker compose -f compose.prod.yaml up -d
```

Botが起動した状態で指定したボイスチャンネルに人が入ると、指定したテキストチャンネルに通知が送信される。
停止時は次のコマンドを実行する。

```bash
docker compose -f compose.prod.yaml down
```

ログは次のコマンドで確認できる。

```bash
docker compose -f compose.prod.yaml logs -f
```

## Author

- [NakuRei](https://github.com/NakuRei)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

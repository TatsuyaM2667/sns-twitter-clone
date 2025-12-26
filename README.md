# SNS Twitter Clone App

このプロジェクトは、人気のソーシャルメディアプラットフォームであるTwitterの主要機能を模倣したクローンアプリケーションです。React Native を用いてモバイル（iOS/Android）アプリケーションを、そして Electron を用いてデスクトップアプリケーション（Windows/macOS/Linux）を構築しています。単一のコードベースから複数のプラットフォームに対応することを目指しています。
## 主な機能
 * 投稿の作成と表示: テキストベースの投稿（ツイート）を作成し、タイムラインに表示します。
 * 画像投稿: Cloudinary を利用した画像アップロードと表示。
 * リアルタイム更新: 新しい投稿がリアルタイムでタイムラインに反映されます。
 * ユーザーインタラクション: 投稿への「いいね」や返信（コメント）機能。
 * ユーザー認証: Firebase Authentication による安全なログイン・ログアウト機能。
 * マルチプラットフォーム対応:
   * モバイルアプリ: React NativeによるiOS/Androidネイティブアプリ。
   * デスクトップアプリ: ElectronによるWindows/macOS/Linuxデスクトップアプリ。
 * シンプルなUI: Twitterにインスパイアされた、クリーンで使いやすいインターフェース。
## 使用技術
このプロジェクトでは、以下の主要な技術スタックを採用しています。
 ### フロントエンド / UIフレームワーク:
   * React Native: モバイルアプリケーション（iOS/Android）の構築に使用。
   * React: ElectronデスクトップアプリケーションのUI構築に使用。
 ### デスクトップアプリケーションフレームワーク:
   * Electron: Web技術（HTML, CSS, JavaScript）を用いてデスクトップアプリケーションを開発。
 ### プログラミング言語:
   * JavaScript / TypeScript: アプリケーションロジックの主要言語。
 ### スタイル:
   * CSS / Styled Components / Tailwind CSS など: UIのスタイリング。
 ### バックエンド / データベース:
   Firebase:
     *Firebase Authentication: ユーザー認証システム。
     *Firestore / Realtime Database: 投稿データやユーザーデータの保存とリアルタイム同期。
   * Cloudinary: 画像のアップロード、保存、配信、最適化。
### プロジェクトの狙い / 工夫した点
 * クロスプラットフォーム開発の挑戦: React NativeとElectronを組み合わせることで、Web技術をベースにしながら、モバイルとデスクトップの両方でネイティブに近い体験を提供することを目指しました。これにより、開発効率の向上と、幅広いユーザーへのリーチを可能にしています。
 * Twitterのコア機能の再現: ソーシャルネットワーキングの基本的な要素（投稿、タイムライン、インタラクション、画像投稿）をシンプルに実装し、その動作原理を理解することに焦点を当てています。
 * 堅牢なバックエンドの構築: Firebaseを認証とデータストアに、Cloudinaryを画像管理に利用することで、スケーラブルで安定したバックエンドシステムを効率的に構築しています。
 * 学習と実験: 各フレームワークの特性や、異なる環境での開発プロセス、そして外部サービスとの連携を学ぶための実践的なプロジェクトです。
### セットアップ方法 (開発者向け)
このプロジェクトをローカル環境で動かすための手順です。
#### 前提条件
 * Node.js (LTS推奨)
 * npm または Yarn
 * （モバイルアプリ開発の場合）Xcode (macOS) / Android Studio
 * Firebase アカウント
 * Cloudinary アカウント
#### 1. リポジトリのクローン
```bash
git clone https://github.com/TatsuyaM2667/sns-twitter-clone.git
cd sns-twitter-clone
```
#### 2. 依存関係のインストール
プロジェクトルートディレクトリで、モバイルとデスクトップ両方の依存関係をインストールします。
```bash
# 全体の依存関係
npm install # または yarn install

# Electronアプリの依存関係（もし別のフォルダにある場合）
# 例: cd electron-app && npm install
```
#### 3. Firebase プロジェクトのセットアップ
 * Firebase コンソールにアクセスし、新しいプロジェクトを作成します。
 * プロジェクト内で Authentication を有効にし、使用したいサインインプロバイダ（例: メール/パスワード、Googleなど）を有効にします。
 * Firestore または Realtime Database を作成し、テスト用に適切なセキュリティルールを設定します。（本番環境ではより厳密なルール設定が必要です）
 * プロジェクト設定の「マイアプリ」から「ウェブアプリ」を追加し、表示される firebaseConfig オブジェクトを控えておきます。
4. Cloudinary アカウントのセットアップ
 * Cloudinary にサインアップまたはログインします。
 * ダッシュボードから、Cloud name, API Key, API Secret を控えておきます。
#### 5. 環境変数の設定
プロジェクトのルートに .env ファイルを作成し、以下の情報を記述します。これらの変数は、アプリケーションのコード内でアクセスされます。
```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID # 必要であれば

# Cloudinary Configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
REACT_APP_CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
REACT_APP_CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
```
注意: API_SECRET はクライアントサイドのコードに直接含めず、サーバーサイド（例えば、Firebase Functions など）で処理するようにしてください。このクローンアプリの規模によってはクライアントサイドから直接アップロードするケースもありますが、セキュリティを考慮するとサーバーサイドでの処理が推奨されます。
#### 6. アプリケーションの実行

モバイルアプリ (React Native)
```bash
# iOSシミュレーターで実行

npx react-native run-ios

# Androidエミュレーターで実行
npx react-native run-android

デスクトップアプリ (Electron)
# 開発モードで実行
npm run electron-dev # または yarn electron-dev
```
（※package.json の scripts に合わせてコマンドを調整してください）
## 👨‍💻 作者
- [TatsuyaM2667](https://github.com/TatsuyaM2667)

import { useNavigate } from 'react-router-dom';
import styles from './PrivacyPage.module.css';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>プライバシーポリシー</h1>
      <p className={styles.updated}>最終更新日: 2026年3月22日</p>

      <section className={styles.section}>
        <p className={styles.intro}>
          「たまごのパーク攻略」（以下「本アプリ」）は、ユーザーの皆さまの個人情報を適切に取り扱います。本アプリをご利用いただく前に、以下の内容をご確認ください。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>1. 収集する情報</h2>
        <h3 className={styles.subheading}>必須項目（アカウント登録時）</h3>
        <ul className={styles.list}>
          <li>メールアドレス</li>
          <li>4桁のPINコード</li>
        </ul>
        <h3 className={styles.subheading}>任意項目（プロフィール設定時）</h3>
        <ul className={styles.list}>
          <li>生年月日</li>
          <li>性別</li>
        </ul>
        <p className={styles.note}>
          ※ 任意項目を入力しなくても、本アプリの基本機能はすべてご利用いただけます。任意項目は、あなたに合ったパーソナライズコメントの表示に利用します。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>2. 利用目的</h2>
        <ul className={styles.list}>
          <li>アカウントの認証・管理</li>
          <li>プランニング機能・チェックリスト等の個人データの保存</li>
          <li>パーソナライズされたコメント・おすすめ情報の表示</li>
          <li>サービスの改善・利用状況の分析</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>3. 第三者提供</h2>
        <p className={styles.text}>
          収集した個人情報を、ユーザーの同意なく第三者に提供することはありません。ただし、法令に基づく場合はこの限りではありません。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>4. 外部サービスの利用</h2>
        <p className={styles.text}>本アプリでは以下の外部サービスを利用しています。</p>
        <ul className={styles.list}>
          <li>
            <strong>Open-Meteo API</strong> — 天気予報情報の取得（個人情報の送信はありません）
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>5. データの保管・セキュリティ</h2>
        <ul className={styles.list}>
          <li>PINコードは暗号化して保管します</li>
          <li>通信はHTTPSにより暗号化されています</li>
          <li>不正アクセス防止のため、適切なセキュリティ対策を講じます</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>6. データの削除</h2>
        <p className={styles.text}>
          アカウントの削除をご希望の場合は、下記のお問い合わせ先までご連絡ください。アカウントに紐づくすべてのデータを削除いたします。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>7. ポリシーの変更</h2>
        <p className={styles.text}>
          本ポリシーの内容は、必要に応じて変更することがあります。変更後のポリシーは本ページに掲載した時点で効力を生じます。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>8. お問い合わせ</h2>
        <p className={styles.text}>
          本ポリシーに関するお問い合わせは、Instagram
          <a
            href="https://www.instagram.com/tamago_usj_guide/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.extLink}
          >
            @tamago_usj_guide
          </a>
          のDMまでご連絡ください。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>9. 免責事項</h2>
        <p className={styles.text}>
          本アプリはユニバーサル・スタジオ・ジャパンの公式アプリではありません。掲載情報は変更される場合があり、正確性を保証するものではありません。最新情報は公式サイトをご確認ください。
        </p>
      </section>

      <button className={styles.backButton} onClick={() => navigate(-1)}>
        戻る
      </button>
    </div>
  );
}

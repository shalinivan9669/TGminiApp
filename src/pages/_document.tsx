// src/pages/_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="ru">
        <Head>
          {/* Любые дополнительные теги head */}
        </Head>
        <body>
          <Main />
          <div id="modal-root"></div> {/* Контейнер для модальных окон */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

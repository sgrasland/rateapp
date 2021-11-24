import '../styles/global.css'
import '../styles/vars.css'
import { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next';

const App = function ({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default appWithTranslation(App);
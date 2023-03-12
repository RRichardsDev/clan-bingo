import '../styles/globals.css'
import type { AppProps } from 'next/app'


function MyApp({ Component, pageProps }: AppProps) {

  return <>
  <style jsx global>
    {`

  `}
  </style>
  <Component {...pageProps} />
  </>
}

export default MyApp

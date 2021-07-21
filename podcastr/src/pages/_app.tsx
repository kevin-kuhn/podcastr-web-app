import "../styles/global.scss"

import { Header } from "../components/header"
import { Player } from "../components/player"

import { PlayerProvider } from "../contexts/player"

import styles from "../styles/app.module.scss"

function MyApp({ Component, pageProps }) {
	return (
		<PlayerProvider>
			<div className={styles.wrapper}>
				<main>
					<Header />
					<Component {...pageProps} />
				</main>
				<Player />
			</div>
		</PlayerProvider>
	)
}

export default MyApp

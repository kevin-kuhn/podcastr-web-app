import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import Image from "next/image"

import logo from "../../../public/logo.svg"

import styles from "./styles.module.scss"

export const Header = () => {
	const currentDate = format(new Date(), 'EEEEEE, d MMMM', { locale: ptBR})

	return (
		<header className={styles.container}>
			<Image src={logo} alt='Podcastr' />
			<p>O melhor para você ouvir, sempre</p>
			<span>{currentDate}</span>
		</header>
	)
}

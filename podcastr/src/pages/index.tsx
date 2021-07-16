import { GetStaticProps, NextPage } from "next"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { api } from "../services/api"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"

import playGreenImg from "../../public/play-green.svg"

import styles from "../styles/home.module.scss"

type Episode = {
	id: string
	title: string
	members: string
	publishedAt: string
	thumbnail: string
	description: string
	duration: number
	durationAsString: string
	url: string
}

type HomeProps = {
	latestEpisodes: Episode[]
	allEpisodes: Episode[]
}

const Home: NextPage<HomeProps> = ({ latestEpisodes, allEpisodes }) => {
	return (
		<div className={styles.homePage}>
			<section className={styles.latestEpisodes}>
				<h2>Últimos lançamentos</h2>
				<ul>
					{latestEpisodes.map(episode => (
						<li key={episode.id}>
							<Image
								src={episode.thumbnail}
								alt={episode.title}
								width={192}
								height={192}
								objectFit="cover"
							/>

							<div className={styles.episodeDetails}>
								<a href=''>{episode.title}</a>
								<p>{episode.members}</p>
								<span>{episode.publishedAt}</span>
								<span>{episode.durationAsString}</span>
							</div>

							<button type='button'>
								<Image src={playGreenImg} alt='Tocar episódio' />
							</button>
						</li>
					))}
				</ul>
			</section>
			<section className={styles.allEpisodes}></section>
		</div>
	)
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await api.get("episodes", {
		params: {
			_limit: 12,
			_sort: "publiched_at",
			_order: "desc",
		},
	})

	const episodes = data.map(episode => {
		return {
			id: episode.id,
			title: episode.title,
			thumbnail: episode.thumbnail,
			members: episode.members,
			publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
				locale: ptBR,
			}),
			duration: Number(episode.file.duration),
			durationAsString: convertDurationToTimeString(
				Number(episode.file.duration)
			),
			description: episode.description,
			url: episode.file.url,
		}
	})

	const latestEpisodes = episodes.slice(0, 2)
	const allEpisodes = episodes.slice(2, episodes.length)

	return {
		props: {
			allEpisodes,
			latestEpisodes,
		},
		// revalidate: 60 * 60 * 8, //A cada 8 horas, quando alguem acessar essa pagina uma nova versão vai ser gerada
		revalidate: 1,
	}
}

import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { api } from "../../services/api"
import { format, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"
import Image from "next/image"
import Link from "next/link"
import Head from "next/head"

import arrowLeftImg from "../../../public/arrow-left.svg"
import playImg from "../../../public/play.svg"

import { usePlayer } from "../../contexts/player"

import styles from "../../styles/episode.module.scss"

type Episode = {
	id: string
	title: string
	members: string
	publishedAt: string
	thumbnail: string
	duration: number
	durationAsString: string
	description: string
	url: string
}

type EpisodeProps = {
	episode: Episode
}

const Episode: NextPage<EpisodeProps> = ({ episode }) => {
	const { playEpisode } = usePlayer()

	return (
		<div className={styles.episode}>
			<Head>
				<title>{episode.title}</title>
			</Head>
			
			<div className={styles.thumbnailContainer}>
				<Link href='/' passHref>
					<button type='button'>
						<Image src={arrowLeftImg} alt='Voltar' onClick={() => {}} />
					</button>
				</Link>
				<Image
					width={700}
					height={160}
					src={episode.thumbnail}
					objectFit='cover'
					alt={episode.title}
				/>
				<button type='button' onClick={() => playEpisode(episode)}>
					<Image src={playImg} alt='Tocar episódio' />
				</button>
			</div>

			<header>
				<h1>{episode.title}</h1>
				<span>{episode.members}</span>
				<span>{episode.publishedAt}</span>
				<span>{episode.durationAsString}</span>
			</header>

			<div
				className={styles.description}
				dangerouslySetInnerHTML={{ __html: episode.description }}
			/>
		</div>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await api.get("episodes", {
		params: {
			_limit: 2,
			_sort: "publiched_at",
			_order: "desc",
		},
	})

	const paths = data.map((episode: Episode) => {
		return { params: { slug: episode.id } }
	})

	return {
		paths,
		fallback: "blocking",
	}
}

export const getStaticProps: GetStaticProps = async context => {
	const { slug } = context.params
	const { data } = await api.get(`/episodes/${slug}`)

	const episode = {
		id: data.id,
		title: data.title,
		thumbnail: data.thumbnail,
		members: data.members,
		publishedAt: format(parseISO(data.published_at), "d MMM yy", {
			locale: ptBR,
		}),
		duration: Number(data.file.duration),
		durationAsString: convertDurationToTimeString(Number(data.file.duration)),
		description: data.description,
		url: data.file.url,
	}

	return {
		props: { episode },
		revalidate: 60 * 60 * 24, //24 hours
	}
}
export default Episode

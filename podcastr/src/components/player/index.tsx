import { useEffect, useRef } from "react"
import styles from "./styles.module.scss"
import Image from "next/image"

import Slider from "rc-slider"

import playingImg from "../../../public/playing.svg"
import pauseImg from "../../../public/pause.svg"
import shuffleImg from "../../../public/shuffle.svg"
import playPreviousImg from "../../../public/play-previous.svg"
import playNextImg from "../../../public/play-next.svg"
import playImg from "../../../public/play.svg"
import repeatImg from "../../../public/repeat.svg"
import { usePlayer } from "../../contexts/player"

import "rc-slider/assets/index.css"

export const Player = () => {
	const audioRef = useRef<HTMLAudioElement>(null)

	const {
		episodeList,
		currentEpisodeIndex,
		isPlaying,
		toggleStatusPlayEpisode,
		setPlayingState,
	} = usePlayer()

	useEffect(() => {
		if (!audioRef.current) {
			return
		}

		if (isPlaying) {
			audioRef.current.play()
		} else {
			audioRef.current.pause()
		}
	}, [isPlaying])

	const episode = episodeList[currentEpisodeIndex]

	return (
		<div className={styles.container}>
			<header>
				<Image src={playingImg} alt='Tocando agora' />
				<strong>Tocando agora</strong>
			</header>

			{episode ? (
				<div className={styles.currentEpisode}>
					<Image
						width={192}
						height={192}
						src={episode.thumbnail}
						objectFit='cover'
						alt={episode.title}
					/>
					<strong>{episode.title}</strong>
					<span>{episode.members}</span>
				</div>
			) : (
				<div className={styles.emptyPlayer}>
					<strong>Selecione um podcast para ouvir</strong>
				</div>
			)}

			<footer className={!episode ? styles.empty : ""}>
				<div className={styles.progress}>
					<span>00:00</span>
					{episode ? (
						<Slider
							trackStyle={{ backgroundColor: "#04d361" }}
							railStyle={{ backgroundColor: "#9875ff" }}
							handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
						/>
					) : (
						<div className={styles.slider}>
							<div className={styles.emptySlider} />
						</div>
					)}
					<span>00:00</span>
				</div>

				{episode && (
					<audio
						ref={audioRef}
						src={episode.url}
						autoPlay
						onPlay={() => setPlayingState(true)}
						onPause={() => setPlayingState(false)}
					/>
				)}

				<div className={styles.buttons}>
					<button type='button' disabled={!episode}>
						<Image src={shuffleImg} alt='Embaralhar' />
					</button>
					<button type='button' disabled={!episode}>
						<Image src={playPreviousImg} alt='Tocar anterior' />
					</button>
					<button
						type='button'
						className={styles.playButton}
						disabled={!episode}
						onClick={toggleStatusPlayEpisode}
					>
						{isPlaying ? (
							<Image src={pauseImg} alt='Pause' />
						) : (
							<Image src={playImg} alt='Tocar' />
						)}
					</button>
					<button type='button' disabled={!episode}>
						<Image src={playNextImg} alt='Tocar próxima' />
					</button>
					<button type='button' disabled={!episode}>
						<Image src={repeatImg} alt='Repetir' />
					</button>
				</div>
			</footer>
		</div>
	)
}

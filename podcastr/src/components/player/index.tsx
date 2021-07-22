import { useEffect, useMemo, useRef, useState } from "react"
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
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"

export const Player = () => {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [progress, setProgress] = useState(0)

	const {
		episodeList,
		currentEpisodeIndex,
		isPlaying,
		hasNext,
		hasPrevious,
		isLooping,
		isShuffling,
		toggleStatusShuffling,
		toggleStatusPlayEpisode,
		toggleStatusLooping,
		setPlayingState,
		playNext,
		clearPlayerState,
		playPrevious,
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

	const setupProgressListener = () => {
		audioRef.current.currentTime = 0

		audioRef.current.addEventListener("timeupdate", () => {
			setProgress(Math.floor(audioRef.current.currentTime))
		})
	}

	const handleSeek = (amount: number) => {
		audioRef.current.currentTime = amount
		setProgress(amount)
	}

	const handleEpisodeEnded = () => {
		hasNext ? playNext() : clearPlayerState()
	}

	const episode = useMemo(
		() => episodeList[currentEpisodeIndex],
		[episodeList, currentEpisodeIndex]
	)

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
					<span>{convertDurationToTimeString(progress)}</span>
					{episode ? (
						<Slider
							max={episode.duration}
							value={progress}
							onChange={handleSeek}
							trackStyle={{ backgroundColor: "#04d361" }}
							railStyle={{ backgroundColor: "#9875ff" }}
							handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
						/>
					) : (
						<div className={styles.slider}>
							<div className={styles.emptySlider} />
						</div>
					)}
					<span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
				</div>

				{episode && (
					<audio
						ref={audioRef}
						src={episode.url}
						loop={isLooping}
						autoPlay
						onPlay={() => setPlayingState(true)}
						onPause={() => setPlayingState(false)}
						onEnded={handleEpisodeEnded}
						onLoadedMetadata={setupProgressListener}
					/>
				)}

				<div className={styles.buttons}>
					<button
						type='button'
						className={isShuffling ? styles.isActive : ""}
						onClick={toggleStatusShuffling}
						disabled={!episode || episodeList.length === 1}
					>
						<Image src={shuffleImg} alt='Embaralhar' />
					</button>
					<button
						type='button'
						onClick={playPrevious}
						disabled={!episode || !hasPrevious}
					>
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
					<button
						type='button'
						onClick={playNext}
						disabled={!episode || !hasNext}
					>
						<Image src={playNextImg} alt='Tocar próxima' />
					</button>
					<button
						type='button'
						className={isLooping ? styles.isActive : ""}
						onClick={toggleStatusLooping}
						disabled={!episode}
					>
						<Image src={repeatImg} alt='Repetir' />
					</button>
				</div>
			</footer>
		</div>
	)
}

import { createContext, useState, useContext, useMemo } from "react"

type Episode = {
	title: string
	members: string
	thumbnail: string
	url: string
	duration: number
}

type PlayerContextData = {
	episodeList: Episode[]
	currentEpisodeIndex: number
	isPlaying: boolean
	isLooping: boolean
	hasNext: boolean
	isShuffling: boolean
	hasPrevious: boolean
	playNext: () => void
	playPrevious: () => void
	playList: (list: Episode[], index: number) => void
	setPlayingState: (state: boolean) => void
	playEpisode: (episode: Episode) => void
	toggleStatusPlayEpisode: () => void
	toggleStatusLooping: () => void
	clearPlayerState: () => void
	toggleStatusShuffling: () => void
}

const PlayerContext = createContext({} as PlayerContextData)

export const PlayerProvider: React.FC = ({ children }) => {
	const [episodeList, setEpisodeList] = useState<Episode[]>([])
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0)
	const [isPlaying, setIsPlaying] = useState<boolean>(false)
	const [isLooping, setIsLooping] = useState<boolean>(false)
	const [isShuffling, setIsShuffling] = useState<boolean>(false)

	const hasPrevious = useMemo(
		() => currentEpisodeIndex > 0,
		[currentEpisodeIndex]
	)

	const hasNext = useMemo(
		() => isShuffling || currentEpisodeIndex + 1 < episodeList.length,
		[currentEpisodeIndex, episodeList.length, isShuffling]
	)

	const clearPlayerState = () => {
		setEpisodeList([])
		setCurrentEpisodeIndex(0)
	}

	const playEpisode = (episode: Episode) => {
		setEpisodeList([episode])
		setCurrentEpisodeIndex(0)
		setIsPlaying(true)
	}

	const playList = (list: Episode[], index: number) => {
		setEpisodeList(list)
		setCurrentEpisodeIndex(index)
		setIsPlaying(true)
	}

	const toggleStatusPlayEpisode = () => {
		setIsPlaying(isPlaying => !isPlaying)
	}

	const toggleStatusLooping = () => {
		setIsLooping(isLooping => !isLooping)
	}

	const toggleStatusShuffling = () => {
		setIsShuffling(isShuffling => !isShuffling)
	}

	const setPlayingState = (state: boolean) => {
		setIsPlaying(state)
	}

	const playNext = () => {
		if (isShuffling) {
			const nextRandomEpisodeIndex = Math.floor(
				Math.random() * episodeList.length
			)

			setCurrentEpisodeIndex(nextRandomEpisodeIndex)
		} else if (hasNext) {
			setCurrentEpisodeIndex(currentEpisodeIndex => currentEpisodeIndex + 1)
		}
	}

	const playPrevious = () => {
		if (hasPrevious) {
			setCurrentEpisodeIndex(currentEpisodeIndex => currentEpisodeIndex - 1)
		}
	}

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				isPlaying,
				hasNext,
				hasPrevious,
				isLooping,
				isShuffling,
				playList,
				playNext,
				playPrevious,
				playEpisode,
				setPlayingState,
				toggleStatusLooping,
				clearPlayerState,
				toggleStatusPlayEpisode,
				toggleStatusShuffling,
			}}
		>
			{children}
		</PlayerContext.Provider>
	)
}

export const usePlayer = () => useContext(PlayerContext)

export default PlayerContext

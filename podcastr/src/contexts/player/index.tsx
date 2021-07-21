import { createContext, useState, useContext } from "react"

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
	playEpisode: (episode: Episode) => void
	toggleStatusPlayEpisode: () => void
	setPlayingState: (state: boolean) => void
}

const PlayerContext = createContext({} as PlayerContextData)

export const PlayerProvider = ({ children }) => {
	const [episodeList, setEpisodeList] = useState<Episode[]>([])
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0)
	const [isPlaying, setIsPlaying] = useState<boolean>(false)

	const playEpisode = (episode: Episode) => {
		setEpisodeList([episode])
		setCurrentEpisodeIndex(0)
		setIsPlaying(true)
	}

	const toggleStatusPlayEpisode = () => {
		setIsPlaying(isPlaying => !isPlaying)
	}

	const setPlayingState = (state: boolean) => {
		setPlayingState(state)
	}

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				isPlaying,
				playEpisode,
				setPlayingState,
				toggleStatusPlayEpisode
			}}
		>
			{children}
		</PlayerContext.Provider>
	)
}

export const usePlayer = () => useContext(PlayerContext)

export default PlayerContext

export default function Home(props) {
	return <div>{JSON.stringify(props.episodes)}</div>
}

export const getStaticProps = async () => {
	const response = await fetch("http://localhost:3333/episodes")
	const data = await response.json()

	return {
		props: {
			episodes: data,
		},
		revalidate: 60 * 60 * 8 //A cada 8 horas, quando alguem acessar essa pagina uma nova versão vai ser gerada
	}
}

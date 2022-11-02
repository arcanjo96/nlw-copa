interface HomeProps {
  count: number;
}

export default function Home(props: HomeProps) {
  return (
    <h1>Contagem: { props.count }</h1>
  )
}

export const getServerSideProps = async () => {
  const response = fetch('http://localhost:3333/pools');
  const data = await (await response).json();

  return {
    props: {
      count: data.count
    }
  }
}

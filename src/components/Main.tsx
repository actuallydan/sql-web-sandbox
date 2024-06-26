import dynamic from 'next/dynamic'

const Main = dynamic(() => import('../components/Main'), { ssr: false })

function App() {
    return <Main />
}

export default App;

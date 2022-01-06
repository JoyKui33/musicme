import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>MusicMe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
       <Sidebar/>
       <Center/>
        {/* Center */}
      </main>
      <div>{/*Player*/}</div>
    </div>
  )
}

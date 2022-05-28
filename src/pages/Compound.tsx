import React from 'react'
import { Link } from 'react-router-dom'
import Pill from '../components/Pill'

import { useAPI } from '../hooks/useAPI'

export default function Compound() {
  const { data: apiData } = useAPI()

  const compoundAPY = React.useMemo(() => {
    return apiData?.marinate.apy ?? null
  }, [apiData])

  const apyPill = React.useMemo(() => {
    return (
      <Pill
        className={`mt-8 m-auto text-2xl ${
          compoundAPY ? 'w-48' : 'w-72 text-lg'
        }`}
      >
        {compoundAPY ? `~${compoundAPY}% APY ` : 'Typically 10+% APY'}
      </Pill>
    )
  }, [compoundAPY])

  return (
    <main>
      <header className="text-center w-full mt-8 p-4">
        <h1 className="font-bold text-5xl text-white tracking-widest uppercase md:text-6xl">
          Compound
        </h1>
        <p className="max-w-xs text-white m-auto mt-8">
          <span>Earn boosted rewards in</span>
          <strong> mUMAMI </strong>
          <span>and maximize your passive income</span>
        </p>

        {apyPill}
      </header>

      <section>
        <div className="bg-white mt-8 py-8 w-full">
          <div className="m-auto max-w-2xl px-4 w-full min-h-[500px]">
            <div className="font-semibold text-gray-600 uppercase">
              <Link to="/app" className="underline">
                /app
              </Link>
              /compound
            </div>

            <p className="mt-8 leading-loose">
              Autocompound your $mUMAMI your for higher APY. Deposit and
              withdraw at any time.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
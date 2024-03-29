import React from 'react'

import { useAPI } from './useAPI'

export function useEstProtocolRevenue() {
  const { data: apiData, isError: isApiError } = useAPI()

  return React.useMemo(() => {
    if (!apiData || !apiData?.marinate?.marinateTVL || isApiError) {
      return null
    }

    // total treasury APR
    const apr = 0.44314
    const estRevenue = (Number(apiData?.marinate?.marinateTVL) * apr) / 12

    return Intl.NumberFormat('en-US').format(Math.floor(estRevenue))
  }, [apiData, isApiError])
}

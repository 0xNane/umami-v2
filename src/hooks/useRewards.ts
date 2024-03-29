import React from 'react'
import { ethers } from 'ethers'
import { useAccount, useSigner, erc20ABI } from 'wagmi'
import { useQuery, useQueryClient } from 'react-query'
import { useNotifications } from 'reapop'

import { useContracts } from './useContracts'
import { useIsArbitrum } from './useIsArbitrum'

export function useRewards() {
  const { data: account } = useAccount()
  const { data: signer } = useSigner()
  const { notify } = useNotifications()
  const queryClient = useQueryClient()

  const contracts = useContracts()
  const isArbitrum = useIsArbitrum()

  const initialMarinateRewards = React.useMemo(() => {
    return [
      {
        token: 'UMAMI',
        amount: 0,
      },
      {
        token: 'WETH',
        amount: 0,
      },
    ]
  }, [])

  const getMarinateRewards = React.useCallback(async () => {
    try {
      if (!account || !signer) {
        throw new Error('No signer or no account to check rewards for')
      }

      const [rewardToken1, rewardToken2] = await Promise.all([
        contracts.mumami.rewardTokens(0),
        contracts.mumami.rewardTokens(1),
      ])
      const token1Contract = new ethers.Contract(
        rewardToken1,
        erc20ABI,
        signer
      )
      const token2Contract = new ethers.Contract(
        rewardToken2,
        erc20ABI,
        signer
      )

      const [
        token1Symbol,
        token2Symbol,
        token1Rewards,
        token2Rewards,
        token1Decimals,
        token2Decimals,
      ] = await Promise.all([
        token1Contract.symbol(),
        token2Contract.symbol(),
        contracts.mumami.getAvailableTokenRewards(
          account?.address,
          rewardToken1
        ),
        contracts.mumami.getAvailableTokenRewards(
          account?.address,
          rewardToken2
        ),
        token1Contract.decimals(),
        token2Contract.decimals(),
      ])

      return [
        {
          token: token1Symbol,
          amount: Number(
            ethers.utils.formatUnits(token1Rewards, token1Decimals)
          ),
        },
        {
          token: token2Symbol,
          amount: Number(
            ethers.utils.formatUnits(token2Rewards, token2Decimals)
          ),
        },
      ]
    } catch (err) {
      console.log(err)
      notify('Unable to fetch available Marinate rewards', 'error')
      return initialMarinateRewards
    }
  }, [account, initialMarinateRewards, contracts, notify, signer])

  const getAllRewards = React.useCallback(async () => {
    const mumami = await getMarinateRewards()

    return { mumami }
  }, [getMarinateRewards])

  return useQuery('rewards', getAllRewards, {
    initialData: queryClient.getQueryData('rewards') ?? {
      mumami: initialMarinateRewards,
    },
    enabled: !!account && !!signer && isArbitrum,
  })
}

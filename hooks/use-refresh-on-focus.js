import React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Refresh the query when the screen is focused
 */
export function useRefreshOnFocus() {
  const queryClient = useQueryClient()
  const firstTimeRef = React.useRef(true)

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false
        return
      }

      // refetch all stale active queries
      queryClient.refetchQueries({
        queryKey: ['posts'],
        stale: true,
        type: 'active',
      })
    }, [queryClient]),
  )
}
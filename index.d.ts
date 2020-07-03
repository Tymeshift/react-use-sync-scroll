declare module 'react-use-sync-scroll' {
  import { RefCallback } from 'react'

  export interface SyncScrollOptions {
    /**
     * @default false
     */
    horizontal?: boolean

    /**
     * @default false
     */
    vertical?: boolean
  }

  function useSyncScroll(options: SyncScrollOptions): RefCallback<HTMLElement>

  export default useSyncScroll
}

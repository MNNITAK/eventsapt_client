/**
 * infinite-scroll/index.js
 * ------------------------
 * Central export — import everything from here, not from individual files.
 *
 * import { useInfiniteScroll, InfiniteScrollList } from '@/infinite-scroll';
 */

export { useSentinel } from "./hooks/useSentinel";
export { useInfiniteScroll } from "./hooks/useInfiniteScroll";
export { InfiniteScrollList } from "./components/InfiniteScrollList";

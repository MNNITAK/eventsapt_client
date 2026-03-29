import { StorySection } from "./StorySection"
import { FeedSWR } from "./FeedSWR"

async function Posts({ id_ }) {
  return (
    <>
      {/* Desktop */}
      <div className="md:w-[95%] md:pt-2 hidden md:block w-[100%] h-[90%] md:h-full md:ml-4">
        <div id="desktopFeed" className="w-[100%] h-[100%] overflow-y-auto preferenceList">
          {/* Stories sit at the top of the scrollable feed — they scroll away naturally */}
          <StorySection />
          <FeedSWR />
        </div>
      </div>

      {/* Mobile */}
      <div id="MobilePost" className="w-[100%] md:hidden mt-2 px-2">
        <StorySection />
        <FeedSWR />
      </div>
    </>
  )
}

export { Posts }

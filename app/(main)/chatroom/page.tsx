import DummyPostCard from "@/app/_components/DummyPostCard"

const Chatrooms = () => {
  return (
    <div className="flex flex-col w-full gap-2 lg:h-dvh h-[calc(100dvh-68px)] overflow-scroll scrollbar-none">
  {Array.from({ length: 4 }).map((_, i) => (
    <DummyPostCard
      key={i}
      text={2 + (i % 3)}
      image={1 + (i % 4)}
    />
  ))}
          </div>
  )
}

export default Chatrooms

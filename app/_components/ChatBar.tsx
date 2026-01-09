'use client'
const ChatBar = () => {

  return (
    <main className="overflow-scroll overscroll-none hidden md:block md:w-2/5 sticky lg:top-0 md:top-17 right-0 bottom-0 scrollbar-none h-[calc(100dvh-68px)] lg:h-dvh">
        <div className='h-15 grid grid-cols-2 sticky top-0 bg-black'>
            <button className="flex justify-center items-center">Chat</button>
            <button className="flex justify-center items-center">Chatroom</button>
        </div>
        <div className="bg-neutral-900 min-h-dvh">

        </div>
    </main>
  )
}

export default ChatBar

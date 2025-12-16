'use client'
const ChatBar = () => {

  return (
    <main className="overflow-scroll scrollbar-none">
        <div className='h-15 grid grid-cols-2 sticky top-0'>
            <button className="flex justify-center items-center">Chat</button>
            <button className="flex justify-center items-center">Chatroom</button>
        </div>
        <div className="bg-neutral-900 min-h-dvh">

        </div>
    </main>
  )
}

export default ChatBar

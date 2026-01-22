import Profile from "@/app/_components/Profile";

const OtherUserProfile = async ({ params }: {params: {username: string}}) => {
  const {username}  = await params;
  return (
    <div>
      <Profile userId={`${username}`}/>
    </div>
  );
};

export default OtherUserProfile;

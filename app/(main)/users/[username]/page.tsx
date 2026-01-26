import Profile from "@/app/_components/Profile";

const UserProfile = async ({ params }: {params: {username: string}}) => {
  const {username}  = await params;
  return (
    <div className="md:px-2">
      <Profile userId={`${username}`}/>
    </div>
  );
};

export default UserProfile;

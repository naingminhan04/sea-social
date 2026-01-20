const OtherUserProfile = async ({ params }: {params: {username: string}}) => {
  const {username}  = await params;
  return (
    <div>
      <h1>Other User Profile: {username}</h1>
    </div>
  );
};

export default OtherUserProfile;

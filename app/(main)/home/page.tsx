import PostReel from "../../_components/PostReel";
import AddPostBtn from "@/app/_components/AddPostForm";
const HomePage = () => {
  return (
    <main className="p-2">
      <PostReel />
      <AddPostBtn state={"reel"} />
    </main>
  );
};

export default HomePage;

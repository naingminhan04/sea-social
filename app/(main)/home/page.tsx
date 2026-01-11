import PostReel from "../../_components/PostReel";
import AddPostBtn from "@/app/_components/AddPostForm";
const HomePage = () => {
  return (
    <main className="relative">
    <PostReel /><AddPostBtn state={"reel"} />
    </main>
  );
};

export default HomePage;

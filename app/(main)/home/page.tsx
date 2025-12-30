import Posts from "../../_components/Posts";
import AddPostBtn from "@/app/_components/AddPostForm";
const HomePage = () => {
  return (
    <main className="relative">
      <Posts />
      <AddPostBtn />
    </main>
  );
};

export default HomePage;

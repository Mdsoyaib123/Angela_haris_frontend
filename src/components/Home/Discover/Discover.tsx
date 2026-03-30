import PostsGallery from "./PostsGallery";
import img from "@/assets/angelaharris/MediaMonitoringImg.jpg";
import SearchBar from "./SearchBar";

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  itemCount?: number;
}
const mockData: GalleryItem[] = [
  {
    id: "1",
    type: "image",
    src: img,
    itemCount: 3,
  },
  {
    id: "2",
    type: "image",
    src: img,
  },
  {
    id: "3",
    type: "video",
    thumbnail: img,
    src: img,
  },
  {
    id: "4",
    type: "image",
    src: img,
    itemCount: 2,
  },
  {
    id: "5",
    type: "image",
    src: img,
  },
  {
    id: "6",
    type: "video",
    thumbnail: img,
    src: img,
  },
];

export default function Discover() {
  return (
    <div>
      <SearchBar />

      <div className="mt-4 lg:mt-6">
        <PostsGallery items={mockData} />
      </div>
    </div>
  );
}

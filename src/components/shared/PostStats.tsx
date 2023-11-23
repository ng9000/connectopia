import {
  useDeleteSavedPosts,
  useGetCurrentUser,
  useLikePosts,
  useSavePosts,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useState, useEffect } from "react";
import Loader from "./Loader";

type statsType = {
  post: Models.Document;
  userId: string;
};
const PostStats = ({ post, userId }: statsType) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(likesList);

  const { mutate: likePost } = useLikePosts();
  const { mutate: savePost, isPending: isSavingPost } = useSavePosts();
  const { mutate: deleteSavePost, isPending: isDeletingSavedPost } =
    useDeleteSavedPosts();
  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setSaved(!!savedPostRecord);
  }, []);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    if (newLikes.includes(userId)) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };

  const handleSavedPost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setSaved(false);
      deleteSavePost(savedPostRecord.$id);
    } else {
      savePost({ postId: post.$id, userId });
      setSaved(true);
    }
  };
  return (
    <div className="flex justify-between items-center z-20 ">
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          onClick={handleLikePost}
          width={20}
          height={20}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isDeletingSavedPost ? (
          <Loader />
        ) : (
          <img
            src={saved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            onClick={handleSavedPost}
            width={20}
            height={20}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;

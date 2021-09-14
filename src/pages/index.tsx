import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import tw, { styled } from 'twin.macro';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import { getCurrentDate } from '@/utils/dates';
import type { PostData } from '@/utils/types';

import Layout from '@/components/Layout';
import Paragraph from '@/components/Paragraph';
import Post from '@/components/Post';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import CreatedBy from '@/components/CreatedBy';

const IndexPage: NextPage = () => {
  const [date, setDate] = useState(getCurrentDate());
  const [posts, setPosts] = useState<PostData[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    queryPosts();
  }, []);

  const queryPosts = async () => {
    setProcessing(true);
    const response = await fetch(`/api/photos?date=${date}`).then((res) =>
      res.json()
    );
    setDate(response.new_date);
    setPosts((prevPosts) => [...prevPosts, ...response.photos]);
    setProcessing(false);
  };

  const [sentryRef] = useInfiniteScroll({
    loading: processing,
    hasNextPage: true,
    onLoadMore: queryPosts,
    disabled: false,
    rootMargin: '0px 0px 100px 0px'
  });

  return (
    <Layout
      title="Spacestagram"
      column={
        <>
          <Paragraph title="Welcome 👋">
            {
              'Welcome to Spacestagram! 🚀\nImage-sharing from the final frontier,\nbrought to you by NASA’s APOD image API.\n\nBrowse, like, and share posts about space straight from NASA. Any photos you like are automatically saved to your profile so you can always take a look at them later!\n\nP.S. You can double tap a photo to like it!'
            }
          </Paragraph>
          <CreatedBy />
        </>
      }
    >
      <Paragraph title="Posts" />
      <PostsContainer>
        {posts.map((post) => (
          <Post key={post.date} data={post} />
        ))}
      </PostsContainer>
      <BottomContainer>
        <LoadingContainer ref={sentryRef}>
          <Loading />
        </LoadingContainer>
        <Paragraph>Taking a while? Click below to retry.</Paragraph>
        <Button block onClick={queryPosts} ariaLabel="Load more posts">
          Load More Posts
        </Button>
      </BottomContainer>
    </Layout>
  );
};

const PostsContainer = styled.div`
  ${tw`flex flex-col space-y-4`}
`;

const LoadingContainer = styled.div`
  ${tw`flex justify-center py-8`}
`;

const BottomContainer = styled.div`
  ${tw`flex flex-col w-full px-3`}
`;

export default IndexPage;

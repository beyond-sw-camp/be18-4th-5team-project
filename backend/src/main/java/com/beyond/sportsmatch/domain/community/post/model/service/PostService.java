package com.beyond.sportsmatch.domain.community.post.model.service;

import com.beyond.sportsmatch.domain.community.post.model.dto.NeighborPostDto;
import com.beyond.sportsmatch.domain.community.post.model.dto.PostRequestDto;
import com.beyond.sportsmatch.domain.community.post.model.dto.PostResponseDto;
import com.beyond.sportsmatch.domain.community.post.model.dto.PostsResponseDto;
import com.beyond.sportsmatch.domain.community.post.model.dto.SearchPostsResponseDto;
import com.beyond.sportsmatch.domain.community.post.model.dto.UpdatePostRequestDto;
import com.beyond.sportsmatch.domain.community.post.model.entity.Category;
import com.beyond.sportsmatch.domain.community.post.model.entity.Post;
import com.beyond.sportsmatch.domain.user.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface PostService {
    Post save(Post post);

    Optional<Category> findCategoryById(int categoryId);

    int getTotalCount(String category);

    List<PostsResponseDto> getPosts(int page, int numOfRows, String category, String sortBy, String sortDir);

    Optional<Post> getPostById(int postId);

    PostResponseDto getPost(int postId, User user);

    void deletePost(int postId);

    PostResponseDto updatePost(UpdatePostRequestDto postRequestDto, List<MultipartFile> files, User user, int postId);

    Post createPost(PostRequestDto postRequestDto, List<MultipartFile> files, User user, Category category);

    Page<SearchPostsResponseDto> searchPosts(String type, String keyword, int page, int numOfRows, String sortBy, String sortDir);

    Map<String, NeighborPostDto> getNeighborPosts(int postId, User user, String category);
}

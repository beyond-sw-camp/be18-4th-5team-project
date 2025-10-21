package com.beyond.sportsmatch.domain.friend.model.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@ToString
@RequiredArgsConstructor
public class FriendResponseDto {

    private final int UserId;

    private final String nickname;

    private final String profileImage;

    private final LocalDateTime createdAt;
}
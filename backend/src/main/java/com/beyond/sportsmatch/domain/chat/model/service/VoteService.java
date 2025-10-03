package com.beyond.sportsmatch.domain.chat.model.service;

import com.beyond.sportsmatch.common.exception.ChatException;
import com.beyond.sportsmatch.common.exception.SportsMatchException;
import com.beyond.sportsmatch.common.exception.message.ExceptionMessage;
import com.beyond.sportsmatch.domain.chat.model.repository.ChatRoomRepository;
import com.beyond.sportsmatch.domain.chat.model.repository.VoteRepository;
import com.beyond.sportsmatch.domain.chat.model.repository.VoteResultRepository;
import com.beyond.sportsmatch.domain.chat.model.entity.ChatRoom;
import com.beyond.sportsmatch.domain.chat.model.entity.Vote;
import com.beyond.sportsmatch.domain.chat.model.entity.VoteResult;
import com.beyond.sportsmatch.auth.model.service.UserDetailsImpl;
import com.google.gson.Gson;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoteService {
    private final ChatRoomRepository chatRoomRepository;
    private final VoteRepository voteRepository;
    private final VoteResultRepository voteResultRepository;

    public Vote createVote(int chatRoomId, String title, List<String> options) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElseThrow(() ->
                new ChatException(ExceptionMessage.CHATROOM_NOT_FOUND));
        if(title == null || title.isBlank() || options == null || options.isEmpty()) {
            throw new SportsMatchException(ExceptionMessage.VOTE_INVALID_INPUT);
        }
        Vote vote = Vote.builder()
                .chatRoom(chatRoom)
                .title(title)
                .options(new Gson().toJson(options))
                .build();
        return  voteRepository.save(vote);
    }

    public void castVote(int voteId, String selectedOption) {
        Vote vote = voteRepository.findById(voteId).orElseThrow(()->
                new ChatException(ExceptionMessage.VOTE_NOT_FOUND));
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ChatException(ExceptionMessage.UNAUTHORIZED);
        }
        var userDetails = (UserDetailsImpl) auth.getPrincipal();
        boolean alreadyVoted = voteResultRepository.existsByVoteAndUser(vote, userDetails.getUser());
        if (alreadyVoted) {
            throw new ChatException(ExceptionMessage.ALREADY_CASTED_VOTE);
        }

        VoteResult voteResult = VoteResult.builder()
                .vote(vote)
                .user(userDetails.getUser())
                .selectedOption(selectedOption)
                .build();

        voteResultRepository.save(voteResult);

    }

    public Object getResults(int voteId) {
        Vote vote = voteRepository.findById(voteId).orElseThrow(()->
                new ChatException(ExceptionMessage.VOTE_NOT_FOUND));
        List<VoteResult> results = voteResultRepository.findByVote(vote);

        return results.stream().collect(Collectors.groupingBy(VoteResult::getSelectedOption, Collectors.counting()));
    }

    public List<Vote> listByChatRoom(int chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElseThrow(()->
                new EntityNotFoundException("채팅방을 찾을 수 없습니다."));
        return voteRepository.findByChatRoomOrderByCreatedAtDesc(chatRoom);
    }
}

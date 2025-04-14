package rbob.soft.chatndice.controller;

import rbob.soft.chatndice.model.ChatMessage;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final Random random = new Random();

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public ChatMessage handleMessage(@DestinationVariable String roomId, ChatMessage message) {

        if ("DICE".equalsIgnoreCase(message.getType())) {
            int sides = parseDiceSides(message.getDiceType());
            int count = Math.max(1, message.getDiceCount());

            List<Integer> rolls = new ArrayList<>();
            for (int i = 0; i < count; i++) {
                rolls.add(random.nextInt(sides) + 1);
            }

            message.setContent("🎲 rolled " + count + message.getDiceType() + ": " + rolls);
        }

        return message;
    }

    private int parseDiceSides(String diceType) {
        if (diceType == null || !diceType.startsWith("d")) return 6; // default to d6
        try {
            return Integer.parseInt(diceType.substring(1));
        } catch (NumberFormatException e) {
            return 6;
        }
    }
}
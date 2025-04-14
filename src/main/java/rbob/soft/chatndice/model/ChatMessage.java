package rbob.soft.chatndice.model;


public class ChatMessage {
    private String type; // "CHAT" or "DICE"
    private String content;
    private String sender;
    private String roomId;

    // For DICE type
    private String diceType; // e.g. "d6", "d20"
    private int diceCount;

    // Getters and Setters
    // (add for diceType and diceCount)
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getDiceType() { return diceType; }
    public void setDiceType(String diceType) { this.diceType = diceType; }

    public int getDiceCount() { return diceCount; }
    public void setDiceCount(int diceCount) { this.diceCount = diceCount; }
}
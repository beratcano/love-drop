-- Run this SQL in Supabase SQL Editor to create the messages table

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read messages from their own matches
CREATE POLICY "Users can read their match messages" ON messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM matches 
            WHERE matches.id = messages.match_id 
            AND matches.user_id = auth.uid()
        )
    );

-- Policy: Users can insert messages to their own matches  
CREATE POLICY "Users can send messages to their matches" ON messages
    FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM matches 
            WHERE matches.id = messages.match_id 
            AND matches.user_id = auth.uid()
        )
    );

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

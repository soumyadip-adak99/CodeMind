import React from "react";

function ChatView({ repoId }: { repoId: string }) {
    return <div className="text-white">{repoId}</div>;
}

export default ChatView;

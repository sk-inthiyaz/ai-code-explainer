import React from "react";

const Message = ({ role, content }) => {
  return (
    <div className={`message ${role}`}>
      <div className="bubble">{content}</div>
    </div>
  );
};

export default Message;

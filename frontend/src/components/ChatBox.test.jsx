import { render, screen } from "@testing-library/react";
import ChatBox from "./ChatBox";

describe("ChatBox", () => {
  it("renders the chat input and log", () => {
    render(<ChatBox language="en" />);
    expect(screen.getByRole("textbox", { name: /chat message/i })).toBeInTheDocument();
    expect(screen.getByRole("log")).toBeInTheDocument();
  });
});

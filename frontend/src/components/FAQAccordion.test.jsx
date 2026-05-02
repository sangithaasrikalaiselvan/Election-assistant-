import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FAQAccordion from "./FAQAccordion";

const faq = [
  {
    id: "faq-1",
    question: "How do I register?",
    answer: "Register online",
    keywords: ["register"],
  },
];

describe("FAQAccordion", () => {
  it("supports search input and keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<FAQAccordion faq={faq} loading={false} />);

    const searchInput = screen.getByLabelText(/search faqs/i);
    await user.tab();
    expect(searchInput).toHaveFocus();

    await user.type(searchInput, "register");
    const summary = screen.getByText(/how do i register/i);
    await user.click(summary);

    expect(summary.closest("details")).toHaveAttribute("open");

    searchInput.focus();
    await user.keyboard("{Escape}");
    expect(searchInput).toHaveValue("");
  });
});

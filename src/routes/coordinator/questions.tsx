import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/coordinator/questions")({
  component: QuestionsLayout,
});

function QuestionsLayout() {
  return <Outlet />;
}
